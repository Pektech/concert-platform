import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Backfilling review cached data...");

  // Update all reviews with cached concert data
  const result = await prisma.$executeRaw`
    UPDATE "Review" r
    SET 
      "artistName" = a.name,
      "venue" = v.name,
      "city" = v.city,
      "concertDate" = c.date
    FROM "Concert" c
    JOIN "Artist" a ON c."artistId" = a.id
    JOIN "Venue" v ON c."venueId" = v.id
    WHERE r."concertId" = c.id
  `;

  console.log(`Updated ${result} reviews with cached concert data`);

  // Verify the update
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      artistName: true,
      venue: true,
      city: true,
      concertDate: true,
    },
    take: 5,
  });

  console.log("\nSample updated reviews:");
  console.log(JSON.stringify(reviews, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });