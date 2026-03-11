# MusicBrainz Local Database Implementation Plan

> **Goal:** Replace Setlist.fm API with a locally-hosted MusicBrainz database via Docker for the concert review application.

---

## Overview

This plan outlines setting up a local MusicBrainz database via Docker using the official `metabrainz/musicbrainz-docker` project. MusicBrainz contains comprehensive music metadata including artists, releases, events (concerts), venues, and places.

---

## Phase 1: Hardware & Storage Assessment

### 1.1 Recommended Hardware Requirements

| Component | With Search Indexing | Without Search |
|-----------|---------------------|----------------|
| **CPU** | 16 threads (x86-64) | 2+ threads |
| **RAM** | 16 GB | 4 GB |
| **Disk Space** | 350 GB | 100 GB |
| **Architecture** | x86-64 only | x86-64 only |

### 1.2 Storage Configuration

```
Target Directory: /media/richard-leddy/extra/marcus/musicbrainz-data/

Subdirectories:
├── db/          # PostgreSQL data (~50-80 GB)
├── solr/        # Search indexes (~60-100 GB)
└── dumps/       # Temporary dump storage (~15 GB during import)
```

### 1.3 Data Dump Sizes (Current as of 2024)

| Dump File | Compressed Size | Uncompressed | Required? |
|-----------|-----------------|--------------|-----------|
| `mbdump.tar.bz2` | ~10 GB | ~50 GB | ✅ Core data (artists, releases, events) |
| `mbdump-derived.tar.bz2` | ~2 GB | ~10 GB | ✅ Tags, ratings, genres |
| `mbdump-editor.tar.bz2` | ~1 GB | ~5 GB | Optional (editor data) |
| Pre-built Search Indexes | ~60 GB | ~150 GB | Optional (can build locally) |

### 1.4 Verify Available Space

```bash
# Check available space on target drive
df -h /media/richard-leddy/extra/marcus/

# Ensure at least 150GB free for minimal setup, 350GB for full setup with search
```

---

## Phase 2: Docker Environment Setup

### 2.1 Install Prerequisites

```bash
# Update package lists
sudo apt-get update

# Install Docker and Docker Compose v2
sudo apt-get install -y docker.io docker-compose-v2 git

# Enable Docker service
sudo systemctl enable --now docker.service

# Verify installation
docker --version
docker compose version

# Add user to docker group (optional, avoids sudo)
sudo usermod -aG docker $USER
newgrp docker  # Apply group membership without logout
```

### 2.2 Clone MusicBrainz Docker Repository

```bash
# Navigate to project directory
cd /media/richard-leddy/extra/marcus

# Clone the official repository
git clone https://github.com/metabrainz/musicbrainz-docker.git
cd musicbrainz-docker

# Check current version
git describe --tags
```

### 2.3 Create Storage Directory

```bash
# Create data directories
mkdir -p /media/richard-leddy/extra/marcus/musicbrainz-data/{db,solr,dumps}

# Set permissions (Docker containers run as specific users)
sudo chown -R 999:999 /media/richard-leddy/extra/marcus/musicbrainz-data/db
sudo chown -R 8983:8983 /media/richard-leddy/extra/marcus/musicbrainz-data/solr
```

### 2.4 Create Environment Configuration

Create `.env` file in the `musicbrainz-docker` directory:

```bash
cat > .env << 'EOF'
# PostgreSQL version
POSTGRES_VERSION=16

# MusicBrainz web server settings
MUSICBRAINZ_WEB_SERVER_HOST=localhost
MUSICBRAINZ_WEB_SERVER_PORT=5000

# Number of server processes (adjust based on CPU)
MUSICBRAINZ_SERVER_PROCESSES=4

# Memory settings (adjust based on available RAM)
# DB shared_buffers = 25% of total RAM recommended
# SOLR_HEAP = 2-4GB for search

# Postgres connection settings
MUSICBRAINZ_POSTGRES_SERVER=db
MUSICBRAINZ_POSTGRES_READONLY_SERVER=db

# RabbitMQ settings
MUSICBRAINZ_RABBITMQ_SERVER=mq

# Redis settings
MUSICBRAINZ_REDIS_SERVER=redis
EOF
```

### 2.5 Create Docker Compose Override for Custom Storage

Create `local/compose/storage.yml`:

```bash
mkdir -p local/compose

cat > local/compose/storage.yml << 'EOF'
# Store database files on external drive
# /media/richard-leddy/extra/marcus/musicbrainz-data/

services:
  db:
    volumes:
      - /media/richard-leddy/extra/marcus/musicbrainz-data/db:/var/lib/postgresql/data

  search:
    volumes:
      - /media/richard-leddy/extra/marcus/musicbrainz-data/solr:/opt/search
EOF
```

### 2.6 Create Memory Settings Override (Optional)

Create `local/compose/memory-settings.yml` for systems with 16GB+ RAM:

```bash
cat > local/compose/memory-settings.yml << 'EOF'
# Memory configuration for 16GB RAM system
# Adjust values based on your available memory

services:
  db:
    # PostgreSQL shared buffers: 25% of RAM
    command: postgres -c "shared_buffers=4GB" -c "shared_preload_libraries=pg_amqp.so"
    deploy:
      resources:
        limits:
          memory: 8G

  search:
    environment:
      # Solr heap: 4GB
      - SOLR_HEAP=4g
    deploy:
      resources:
        limits:
          memory: 6G
EOF
```

### 2.7 Enable Storage Configuration

```bash
# Apply storage override
admin/configure add local/compose/storage.yml

# Optionally add memory settings
admin/configure add local/compose/memory-settings.yml

# Verify configuration
docker compose config
```

---

## Phase 3: Database Installation

### 3.1 Build Docker Images

```bash
# Build all service images (5-30 minutes depending on hardware)
docker compose build

# Verify images were built
docker images | grep metabrainz
```

**Expected images:**
- `metabrainz/musicbrainz-docker-db`
- `metabrainz/musicbrainz-docker-musicbrainz`
- `metabrainz/musicbrainz-docker-indexer`
- `metabrainz/mb-solr`

### 3.2 Download Data Dumps and Create Database

**Option A: Full Download (Recommended)**

```bash
# Download latest full data dumps and create database
# This takes 2-8 hours depending on bandwidth
docker compose run --rm musicbrainz createdb.sh -fetch

# Monitor progress in another terminal
docker compose logs -f musicbrainz
```

**Option B: Use Existing Dumps (If Pre-downloaded)**

```bash
# If you've already downloaded the dumps to a local file
docker compose run --rm musicbrainz createdb.sh /path/to/dumps/
```

### 3.3 Build Materialized Tables (Optional but Recommended)

Materialized tables improve query performance by denormalizing frequently accessed data:

```bash
# Build all materialized tables
docker compose run --rm musicbrainz bash -c 'carton exec -- ./admin/BuildMaterializedTables --database=MAINTENANCE all'

# Or build specific tables
docker compose run --rm musicbrainz bash -c 'carton exec -- ./admin/BuildMaterializedTables --database=MAINTENANCE artist_credit'
```

### 3.4 Start Services

```bash
# Start all services in detached mode
docker compose up -d

# Check service status
docker compose ps

# View logs
docker compose logs -f
```

**Services started:**
- `db` - PostgreSQL database (port 5432)
- `musicbrainz` - Web server & API (port 5000)
- `search` - Solr search server (port 8983)
- `indexer` - Search index rebuilder
- `mq` - RabbitMQ message queue
- `redis` - Redis cache

**Access points:**
- Web interface: http://localhost:5000
- API endpoint: http://localhost:5000/ws/2/
- Solr admin: http://localhost:8983/solr/

---

## Phase 4: Live Data Feed (Replication)

Replication keeps the local database synchronized with the main MusicBrainz server.

### 4.1 Obtain Access Token

1. Create account at https://metabrainz.org/user/register
2. Navigate to https://metabrainz.org/user/access-tokens
3. Generate a new access token
4. Copy the token for next step

**Note:** Non-commercial/personal use is free. Commercial use requires paid subscription.

### 4.2 Configure Replication Token

```bash
# Run the token setup script (prompts for your token)
admin/set-replication-token

# Enable replication configuration
admin/configure add replication-token
docker compose up -d
```

### 4.3 Run Initial Replication

```bash
# Run replication to catch up with latest updates
# This may take time if data dump is old
docker compose exec musicbrainz replication.sh

# Monitor progress in real-time
docker compose exec musicbrainz tail -f mirror.log
```

### 4.4 Schedule Automatic Replication

```bash
# Add cron job for daily replication (default: 3 AM UTC)
admin/configure add replication-cron
docker compose up -d

# Verify cron is configured
docker compose exec musicbrainz crontab -l
```

**Custom replication schedule:**

Edit `local/replication.cron`:
```
# Run replication every 6 hours
0 */6 * * * /opt/musicbrainz/admin/replication/LoadReplicationChanges >> /var/log/musicbrainz/mirror.log 2>&1
```

```bash
# Apply custom cron
echo "MUSICBRAINZ_CRONTAB_PATH=./local/replication.cron" >> .env
docker compose up -d
```

---

## Phase 5: Search Configuration

### 5.1 Option A: Build Search Indexes Locally

```bash
# Build all search indexes (4-6 hours with 16 CPU threads)
docker compose exec indexer python -m sir reindex

# Build specific entity types only
docker compose exec indexer python -m sir reindex --entity-type artist --entity-type event
```

### 5.2 Option B: Download Pre-built Indexes (Faster)

```bash
# Start search service
docker compose up -d search

# Download pre-built search indexes (~60GB compressed)
docker compose exec search fetch-backup-archives

# Load the downloaded indexes
docker compose exec search load-backup-archives

# Clean up downloaded archives (optional)
docker compose exec search remove-backup-archives
```

### 5.3 Enable Live Indexing (Experimental)

For real-time search updates when data changes:

```bash
# Setup AMQP integration
docker compose exec indexer python -m sir amqp_setup
admin/create-amqp-extension
admin/setup-amqp-triggers install

# Enable live indexing
admin/configure add live-indexing-search
docker compose up -d
```

### 5.4 Schedule Weekly Reindex (Recommended)

Add to `/etc/crontab` on host:
```bash
# Rebuild search indexes weekly on Sunday at 1 AM
0 1 * * 7 YOUR_USER cd /media/richard-leddy/extra/marcus/musicbrainz-docker && /usr/bin/docker compose exec -T indexer python -m sir reindex
```

---

## Phase 6: Application Integration

### 6.1 Connection Details

| Service | Host | Port | Database/User | Password |
|---------|------|------|---------------|----------|
| PostgreSQL | localhost | 5432 | musicbrainz_db / musicbrainz | musicbrainz |
| Web API | localhost | 5000 | N/A | N/A |
| Solr | localhost | 8983 | N/A | N/A |

**Note:** Default credentials are in `default/postgres.env`.

### 6.2 Key Database Tables for Concert App

#### Core Tables

| Table | Description |
|-------|-------------|
| `event` | Concerts, festivals, performances |
| `artist` | Musical artists |
| `artist_credit` | Artist credits (supports collaborations) |
| `artist_credit_name` | Names within artist credits |
| `place` | Venues, studios |
| `area` | Geographic locations (cities, countries) |
| `event_artist` | Links events to artists |
| `event_place` | Links events to venues |
| `url` | External URLs |
| `link` | Relationships between entities |
| `link_type` | Types of relationships |

#### Event-Related Columns

```sql
-- Event table structure (simplified)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'event'
ORDER BY ordinal_position;
```

Key columns:
- `id` - Unique identifier (GID)
- `gid` - UUID
- `name` - Event name
- `comment` - Disambiguation
- `type` - Event type ID
- `time` - Event time
- `begin_date_year/month/day` - Start date
- `end_date_year/month/day` - End date
- `cancelled` - Boolean
- `place` - Venue ID

### 6.3 Example Queries for Concert Features

#### Find Events by Artist Name

```sql
-- Find all events where an artist performed
SELECT 
    e.gid AS event_id,
    e.name AS event_name,
    e.begin_date_year || '-' || COALESCE(e.begin_date_month::text, '??') || '-' || COALESCE(e.begin_date_day::text, '??') AS date,
    p.name AS venue,
    a.name AS city
FROM event e
JOIN l_event_artist lea ON lea.entity0 = e.id
JOIN artist ar ON ar.id = lea.entity1
LEFT JOIN place p ON p.id = e.place
LEFT JOIN area a ON a.id = p.area
WHERE ar.name ILIKE '%Radiohead%'
ORDER BY e.begin_date_year DESC, e.begin_date_month DESC, e.begin_date_day DESC;
```

#### Search Artists with Fuzzy Matching

```sql
-- Basic fuzzy search using PostgreSQL trigrams
CREATE EXTENSION IF NOT EXISTS pg_trgm;

SELECT name, gid, comment
FROM artist
WHERE name % 'Radiohed'  -- trigram similarity
ORDER BY similarity(name, 'Radiohed') DESC
LIMIT 10;
```

#### Find Venues by City

```sql
-- Find all venues in a city
SELECT 
    p.gid AS place_id,
    p.name AS venue_name,
    p.type,
    a.name AS city,
    a2.name AS country
FROM place p
JOIN area a ON a.id = p.area
LEFT JOIN area a2 ON a2.id = a.parent
WHERE a.name ILIKE '%New York%'
AND p.type = (SELECT id FROM place_type WHERE name = 'Stadium');
```

#### Get Event Details with All Metadata

```sql
-- Complete event information
SELECT 
    e.gid,
    e.name,
    et.name AS event_type,
    e.begin_date_year || '-' || 
    LPAD(COALESCE(e.begin_date_month::text, '0'), 2, '0') || '-' || 
    LPAD(COALESCE(e.begin_date_day::text, '0'), 2, '0') AS date,
    e.time,
    p.name AS venue,
    p.gid AS venue_mbid,
    a.name AS city,
    a.gid AS city_mbid,
    e.cancelled,
    array_agg(DISTINCT ar.name) AS artists
FROM event e
LEFT JOIN event_type et ON et.id = e.type
LEFT JOIN place p ON p.id = e.place
LEFT JOIN area a ON a.id = p.area
LEFT JOIN l_event_artist lea ON lea.entity0 = e.id
LEFT JOIN artist ar ON ar.id = lea.entity1
WHERE e.gid = 'event-uuid-here'
GROUP BY e.id, et.name, p.name, p.gid, a.name, a.gid;
```

### 6.4 API Integration Options

#### Option 1: Direct PostgreSQL Connection

```typescript
// src/lib/musicbrainz-db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'musicbrainz_db',
  user: 'musicbrainz',
  password: 'musicbrainz',
  max: 10,
});

export async function searchArtists(query: string) {
  const result = await pool.query(`
    SELECT gid, name, comment, type
    FROM artist
    WHERE name ILIKE $1
    ORDER BY name
    LIMIT 20
  `, [`%${query}%`]);
  
  return result.rows;
}

export async function getArtistEvents(artistGid: string) {
  const result = await pool.query(`
    SELECT 
      e.gid, e.name, 
      e.begin_date_year as year,
      e.begin_date_month as month,
      e.begin_date_day as day,
      p.name as venue,
      a.name as city
    FROM event e
    JOIN l_event_artist lea ON lea.entity0 = e.id
    JOIN artist ar ON ar.id = lea.entity1
    LEFT JOIN place p ON p.id = e.place
    LEFT JOIN area a ON a.id = p.area
    WHERE ar.gid = $1
    ORDER BY e.begin_date_year DESC, e.begin_date_month DESC
  `, [artistGid]);
  
  return result.rows;
}
```

#### Option 2: Local MusicBrainz Web Service API

```typescript
// src/lib/musicbrainz-api.ts
const MB_LOCAL_API = 'http://localhost:5000/ws/2';

export async function searchArtist(query: string) {
  const response = await fetch(
    `${MB_LOCAL_API}/artist/?query=name:${encodeURIComponent(query)}&fmt=json&limit=20`
  );
  return response.json();
}

export async function getArtistEvents(mbid: string) {
  const response = await fetch(
    `${MB_LOCAL_API}/artist/${mbid}?inc=event-rels&fmt=json`
  );
  return response.json();
}

export async function searchEvent(query: string) {
  const response = await fetch(
    `${MB_LOCAL_API}/event/?query=${encodeURIComponent(query)}&fmt=json&limit=20`
  );
  return response.json();
}
```

#### Option 3: Solr Search API

```typescript
// src/lib/musicbrainz-solr.ts
const SOLR_API = 'http://localhost:8983/solr';

export async function searchArtists(query: string) {
  const response = await fetch(
    `${SOLR_API}/artist/select?q=artist:${encodeURIComponent(query)}&wt=json&rows=20`
  );
  const data = await response.json();
  return data.response.docs;
}

export async function searchEvents(query: string) {
  const response = await fetch(
    `${SOLR_API}/event/select?q=event:${encodeURIComponent(query)}&wt=json&rows=20`
  );
  const data = await response.json();
  return data.response.docs;
}
```

---

## Phase 7: Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Docker Compose Stack                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌────────────────┐    ┌────────────────┐    ┌────────────────┐        │
│   │  musicbrainz   │    │    search      │    │    indexer     │        │
│   │  (Web Server)  │    │    (Solr)      │    │     (SIR)      │        │
│   │   Port: 5000   │    │  Port: 8983    │    │                │        │
│   └───────┬────────┘    └───────┬────────┘    └───────┬────────┘        │
│           │                     │                     │                  │
│           │         ┌───────────┴───────────┐         │                  │
│           │         │                       │         │                  │
│   ┌───────▼────────┐ │    ┌────────────────┐ │ ┌──────▼────────┐        │
│   │      db        │◄────►│       mq       │◄├─►│    redis      │        │
│   │  (PostgreSQL)  │ │    │   (RabbitMQ)   │ │ │               │        │
│   │   Port: 5432   │ │    │   Port: 5672   │ │ │   Port: 6379  │        │
│   └───────┬────────┘ │    └────────────────┘ │ └───────────────┘        │
│           │          │                       │                           │
└───────────┼──────────┴───────────────────────┴───────────────────────────┘
            │
            │ Docker Volumes
            │
┌───────────▼───────────────────────────────────────────────────────────────┐
│                        External Storage                                    │
│                                                                            │
│   /media/richard-leddy/extra/marcus/musicbrainz-data/                     │
│   ├── db/           PostgreSQL data (~50-80 GB)                           │
│   ├── solr/         Search indexes (~60-100 GB)                           │
│   └── dumps/        Temporary dump storage (~15 GB during import)         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Service Descriptions

| Service | Container | Description |
|---------|-----------|-------------|
| `db` | PostgreSQL 16 | Main database with MusicBrainz schema |
| `musicbrainz` | MusicBrainz Server | Web interface and REST API |
| `search` | Apache Solr | Full-text search engine |
| `indexer` | SIR | Search Index Rebuilder - syncs DB to Solr |
| `mq` | RabbitMQ | Message queue for live indexing |
| `redis` | Redis | Session and cache storage |

---

## Phase 8: Maintenance

### 8.1 Daily Operations

```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f [service_name]

# Monitor replication
docker compose exec musicbrainz tail -f mirror.log
```

### 8.2 Backup Strategy

```bash
# Full database backup
docker compose exec db pg_dump -U musicbrainz musicbrainz_db | gzip > ~/musicbrainz_backup_$(date +%Y%m%d).sql.gz

# Backup PostgreSQL data directory
tar -czvf ~/musicbrainz_data_backup_$(date +%Y%m%d).tar.gz \
    /media/richard-leddy/extra/marcus/musicbrainz-data/db
```

### 8.3 Schema Upgrades

MusicBrainz releases schema changes approximately twice per year.

```bash
# Check for new releases
cd /media/richard-leddy/extra/marcus/musicbrainz-docker
git fetch --tags origin

# View available releases
git tag -l | sort -V | tail -10

# Upgrade to specific version (READ RELEASE NOTES FIRST!)
git checkout v-2025-12-16.0
docker compose build
docker compose up -d
```

**Important:** Always read release notes at:
https://github.com/metabrainz/musicbrainz-docker/releases

### 8.4 Troubleshooting

```bash
# Restart a specific service
docker compose restart musicbrainz

# Recreate database (WARNING: destroys all data)
docker compose run --rm musicbrainz recreatedb.sh -fetch

# Check database connection
docker compose exec db psql -U musicbrainz -d musicbrainz_db -c "SELECT count(*) FROM artist;"

# Purge RabbitMQ queues (if stuck)
admin/purge-message-queues
```

---

## Phase 9: Migration from Setlist.fm

### 9.1 Comparison

| Feature | Setlist.fm | MusicBrainz |
|---------|------------|-------------|
| Primary Focus | Setlists, Concerts | Music Metadata |
| Event Data | Extensive | Basic events |
| Setlist Data | Detailed | Limited |
| Artist Info | Basic | Comprehensive |
| Venue Info | Good | Good |
| API Rate Limits | Yes | No (local) |
| Data Ownership | External | Local |
| Update Frequency | Real-time | Daily replication |

### 9.2 Migration Steps

1. **Map Data Models**
   - Setlist.fm `artist` → MusicBrainz `artist`
   - Setlist.fm `venue` → MusicBrainz `place`
   - Setlist.fm `event` → MusicBrainz `event`
   - Setlist.fm `set` → Not directly available (use external source)

2. **Update API Routes**
   - Replace Setlist.fm API calls with local queries
   - Update response format handling
   - Adjust for MBID vs internal IDs

3. **Handle Missing Data**
   - Setlist data not available in MusicBrainz
   - Consider keeping Setlist.fm as supplementary source
   - Or use user-generated content for setlists

### 9.3 Hybrid Approach (Recommended)

Keep both sources:
- **MusicBrainz** for artist/venue/event discovery
- **Setlist.fm** for detailed setlist information

```typescript
// Example hybrid query
async function getConcertDetails(eventId: string) {
  // Get basic event info from MusicBrainz
  const mbEvent = await getEventFromMusicBrainz(eventId);
  
  // Get setlist from Setlist.fm (if available)
  const setlist = await getSetlistFromSetlistFm(mbEvent.name, mbEvent.date);
  
  return { ...mbEvent, setlist };
}
```

---

## Estimated Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Storage setup & verification | 15 minutes |
| 2 | Docker environment configuration | 30 minutes |
| 3 | Database import | 4-8 hours |
| 4 | Replication setup | 30 minutes |
| 5 | Search indexes | 1-5 hours |
| 6 | Application integration | 2-4 hours |
| 7-9 | Testing & migration | 4-8 hours |
| **Total** | | **12-26 hours** |

---

## Quick Reference Commands

```bash
# === Initial Setup ===
git clone https://github.com/metabrainz/musicbrainz-docker.git
cd musicbrainz-docker
docker compose build
docker compose run --rm musicbrainz createdb.sh -fetch
docker compose up -d

# === Enable Replication ===
admin/set-replication-token  # Enter your token
admin/configure add replication-token
admin/configure add replication-cron
docker compose up -d

# === Enable Search ===
docker compose exec indexer python -m sir reindex
# OR download pre-built:
docker compose exec search fetch-backup-archives
docker compose exec search load-backup-archives

# === Daily Operations ===
docker compose ps                    # Check status
docker compose logs -f musicbrainz   # View logs
docker compose exec musicbrainz tail -f mirror.log  # Replication log

# === Maintenance ===
docker compose restart musicbrainz   # Restart web server
docker compose pull && docker compose up -d  # Update images
```

---

## Resources

- **MusicBrainz Docker:** https://github.com/metabrainz/musicbrainz-docker
- **MusicBrainz Database Schema:** https://musicbrainz.org/doc/MusicBrainz_Database/Schema
- **MusicBrainz API Documentation:** https://musicbrainz.org/doc/MusicBrainz_API
- **Live Data Feed:** https://musicbrainz.org/doc/Live_Data_Feed
- **Data Dumps:** https://metabrainz.org/datasets/postgres-dumps#musicbrainz
- **SIR Documentation:** https://sir.readthedocs.io/

---

## Next Steps

1. [ ] Verify 150GB+ free space on `/media/richard-leddy/extra/marcus/`
2. [ ] Create MetaBrainz account and obtain access token
3. [ ] Execute Phase 2 (Docker setup)
4. [ ] Execute Phase 3 (Database import)
5. [ ] Test queries against local database
6. [ ] Plan application integration strategy
7. [ ] Decide on hybrid vs full migration approach