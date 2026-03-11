#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║          ConcertVibe Development Status                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Next.js Dev Server
echo "🚂 Next.js Dev Server:"
if pgrep -f "next dev" > /dev/null; then
    echo "   ✅ Running"
    PORT=$(lsof -ti :3000 2>/dev/null || lsof -ti :3001 2>/dev/null)
    if [ ! -z "$PORT" ]; then
        echo "   📍 Port: 3000 or 3001"
    fi
else
    echo "   ❌ Not running"
fi
echo ""

# PostgreSQL (App DB)
echo "🗄️  PostgreSQL (App Database):"
if sudo systemctl is-active --quiet postgresql; then
    echo "   ✅ Running"
    sudo systemctl status postgresql --no-pager -l | grep "Active:"
else
    echo "   ❌ Not running"
fi
echo ""

# MusicBrainz Docker
echo "🎵 MusicBrainz Docker:"
if docker compose ps 2>/dev/null | grep -q "Up"; then
    echo "   ✅ Running"
    docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | head -10
else
    echo "   ❌ Not running"
fi
echo ""

# NGINX (Production only)
echo "🌐 NGINX:"
if sudo systemctl is-active --quiet nginx; then
    echo "   ✅ Running"
else
    echo "   ⚠️  Not running (dev mode)"
fi
echo ""

# Disk Usage
echo "💾 Disk Usage:"
df -h / | tail -1 | awk '{print "   Used: " $3 " / " $2 " (" $5 " used)"}'
echo ""

# Memory Usage
echo "🧠 Memory Usage:"
free -h | grep Mem | awk '{print "   Used: " $3 " / " $2 " (" int($3/$2*100) "% used)"}'
echo ""

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Quick Commands:                                       ║"
echo "║    npm run dev          - Start Next.js               ║"
echo "║    pm2 start/stop/logs  - Manage Next.js              ║"
echo "║    docker compose up    - Start MusicBrainz           ║"
echo "╚════════════════════════════════════════════════════════╝"
