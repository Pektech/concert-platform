import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data (in reverse order of dependencies)
  await prisma.review.deleteMany();
  await prisma.concert.deleteMany();
  await prisma.user.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.venue.deleteMany();

  // Create Artists
  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: "Taylor Swift",
        bio: "American singer-songwriter known for narrative songs about her personal life.",
        genre: "Pop",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Taylor_Swift_eras_tour_2023.jpg",
      },
    }),
    prisma.artist.create({
      data: {
        name: "Radiohead",
        bio: "English rock band known for their experimental approach to music.",
        genre: "Alternative Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/16/Radiohead.svg",
      },
    }),
    prisma.artist.create({
      data: {
        name: "Kendrick Lamar",
        bio: "American rapper regarded as one of the most influential artists of his generation.",
        genre: "Hip Hop",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Kendrick_Lamar_2018.jpg",
      },
    }),
    prisma.artist.create({
      data: {
        name: "Daft Punk",
        bio: "French electronic music duo known for their visual storytelling and robot personas.",
        genre: "Electronic",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Daft_Punk_2007.jpg",
      },
    }),
    prisma.artist.create({
      data: {
        name: "Fleetwood Mac",
        bio: "British-American rock band formed in London in 1967.",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Fleetwood_Mac_2009.jpg",
      },
    }),
  ]);

  console.log(`Created ${artists.length} artists`);

  // Create Venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: "Madison Square Garden",
        address: "4 Pennsylvania Plaza",
        city: "New York, NY",
        capacity: 20789,
      },
    }),
    prisma.venue.create({
      data: {
        name: "The Forum",
        address: "3900 W Manchester Blvd",
        city: "Inglewood, CA",
        capacity: 17500,
      },
    }),
    prisma.venue.create({
      data: {
        name: "Red Rocks Amphitheatre",
        address: "18300 W Alameda Pkwy",
        city: "Morrison, CO",
        capacity: 9545,
      },
    }),
    prisma.venue.create({
      data: {
        name: "The O2 Arena",
        address: "Peninsula Square",
        city: "London, UK",
        capacity: 20000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "Hollywood Bowl",
        address: "2301 N Highland Ave",
        city: "Los Angeles, CA",
        capacity: 17500,
      },
    }),
  ]);

  console.log(`Created ${venues.length} venues`);

  // Create Concerts
  const concerts = await Promise.all([
    prisma.concert.create({
      data: {
        title: "The Eras Tour",
        description: "A journey through all musical eras of Taylor Swift's career",
        date: new Date("2023-08-05"),
        location: "New York, NY",
        price: 149.99,
        artistId: artists[0].id,
        venueId: venues[0].id,
      },
    }),
    prisma.concert.create({
      data: {
        title: "A Moon Shaped Pool Tour",
        description: "Radiohead's ethereal performance of their latest album",
        date: new Date("2023-06-15"),
        location: "Morrison, CO",
        price: 125.00,
        artistId: artists[1].id,
        venueId: venues[2].id,
      },
    }),
    prisma.concert.create({
      data: {
        title: "The Big Steppers Tour",
        description: "Kendrick Lamar's explosive live show",
        date: new Date("2023-07-22"),
        location: "Inglewood, CA",
        price: 135.00,
        artistId: artists[2].id,
        venueId: venues[1].id,
      },
    }),
    prisma.concert.create({
      data: {
        title: "Random Access Memories Anniversary",
        description: "Celebrating 10 years of the iconic album",
        date: new Date("2023-05-20"),
        location: "London, UK",
        price: 175.00,
        artistId: artists[3].id,
        venueId: venues[3].id,
      },
    }),
    prisma.concert.create({
      data: {
        title: "Rumours Anniversary Tour",
        description: "Playing the legendary Rumours album in full",
        date: new Date("2023-09-10"),
        location: "Los Angeles, CA",
        price: 165.00,
        artistId: artists[4].id,
        venueId: venues[4].id,
      },
    }),
    prisma.concert.create({
      data: {
        title: "Midnights Album Release Show",
        description: "Intimate performance of Taylor Swift's Midnights",
        date: new Date("2022-10-21"),
        location: "London, UK",
        price: 99.99,
        artistId: artists[0].id,
        venueId: venues[3].id,
      },
    }),
    prisma.concert.create({
      data: {
        title: "OK Computer 25th Anniversary",
        description: "Radiohead performs OK Computer in its entirety",
        date: new Date("2022-05-28"),
        location: "Morrison, CO",
        price: 150.00,
        artistId: artists[1].id,
        venueId: venues[2].id,
      },
    }),
    prisma.concert.create({
      data: {
        title: "good kid, m.A.A.d city Decade",
        description: "Celebrating 10 years of the classic album",
        date: new Date("2022-10-22"),
        location: "New York, NY",
        price: 140.00,
        artistId: artists[2].id,
        venueId: venues[0].id,
      },
    }),
  ]);

  console.log(`Created ${concerts.length} concerts`);

  // Create Users with hashed passwords
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alex.johnson@example.com",
        name: "Alex Johnson",
        password: hashedPassword,
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        email: "sarah.chen@example.com",
        name: "Sarah Chen",
        password: hashedPassword,
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        email: "mike.wilson@example.com",
        name: "Mike Wilson",
        password: hashedPassword,
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        email: "emma.davis@example.com",
        name: "Emma Davis",
        password: hashedPassword,
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        email: "chris.martinez@example.com",
        name: "Chris Martinez",
        password: hashedPassword,
        role: "user",
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create Reviews with realistic data
  const reviewsData = [
    // Alex Johnson's reviews (3 reviews)
    {
      userId: users[0].id,
      concertId: concerts[0].id, // Taylor Swift - Eras Tour
      rating: 5,
      text: "Absolutely incredible! Three and a half hours of pure magic. Taylor performed songs from every era and the production was stunning. The crowd energy was electric and I'm still not over the 10-minute version of All Too Well.",
      setlistHighlights: "All Too Well (10 Minute Version), Enchanted, You're On Your Own Kid",
      
    },
    {
      userId: users[0].id,
      concertId: concerts[2].id, // Kendrick Lamar - Big Steppers
      rating: 5,
      text: "Kendrick is a phenomenal performer. The stage design was unlike anything I've seen - that giant puppet walking across the stage was wild. He played all the hits and the energy never dropped.",
      setlistHighlights: "HUMBLE., Alright, MONEY TREES, Sing About Me, I'm Dying of Thirst",
      
    },
    {
      userId: users[0].id,
      concertId: concerts[6].id, // Radiohead - OK Computer
      rating: 4,
      text: "Hearing OK Computer performed live in its entirety was a dream come true. Thom Yorke's vocals were hauntingly beautiful. Only wish the sound mix was a bit better in the back.",
      setlistHighlights: "Paranoid Android, Karma Police, No Surprises, Exit Music (For a Film)",
      
    },

    // Sarah Chen's reviews (4 reviews)
    {
      userId: users[1].id,
      concertId: concerts[1].id, // Radiohead - Moon Shaped Pool
      rating: 5,
      text: "Red Rocks at sunset with Radiohead playing - does it get any better? The strings section added so much depth to the newer songs. Daydreaming gave me chills.",
      setlistHighlights: "Daydreaming, Burn the Witch, Weird Fishes/Arpeggi, Idioteque",
      
    },
    {
      userId: users[1].id,
      concertId: concerts[4].id, // Fleetwood Mac
      rating: 4,
      text: "Such a nostalgic show! Hearing The Chain and Go Your Own Way live was everything. Stevie Nicks still has that magical stage presence. Mike Campbell filled in well on guitar.",
      setlistHighlights: "The Chain, Dreams, Go Your Own Way, Landslide",
      
    },
    {
      userId: users[1].id,
      concertId: concerts[3].id, // Daft Punk
      rating: 5,
      text: "A transcendent experience! The pyramid light show combined with Get Lucky and One More Time had the entire arena dancing. They even played Digital Love which made my year.",
      setlistHighlights: "Get Lucky, One More Time, Digital Love, Harder Better Faster Stronger",
      
    },
    {
      userId: users[1].id,
      concertId: concerts[5].id, // Taylor Swift - Midnights
      rating: 4,
      text: "Intimate venue, great acoustics. Taylor played the entire Midnights album plus a few surprise songs. Anti-Hero live was everything I hoped for. Wished it was a bit longer though.",
      setlistHighlights: "Anti-Hero, Mastermind, Lavender Haze, Midnight Rain",
      
    },

    // Mike Wilson's reviews (2 reviews)
    {
      userId: users[2].id,
      concertId: concerts[7].id, // Kendrick - good kid m.A.A.d city
      rating: 5,
      text: "Hearing good kid, m.A.A.d city front to back was life-changing. Sing About Me, I'm Dying of Thirst hit different in person. The storytelling throughout was incredible.",
      setlistHighlights: "Sing About Me, I'm Dying of Thirst, Swimming Pools (Drank), Bitch, Don't Kill My Vibe",
      
    },
    {
      userId: users[2].id,
      concertId: concerts[0].id, // Taylor Swift - Eras Tour
      rating: 4,
      text: "Went with my daughter and she was over the moon. I was surprised by how much I enjoyed it - Taylor puts on a real show. 3+ hours is a commitment but worth it.",
      setlistHighlights: "Shake It Off, Blank Space, Love Story, We Are Never Ever Getting Back Together",
      
    },

    // Emma Davis's reviews (1 review)
    {
      userId: users[3].id,
      concertId: concerts[1].id, // Radiohead - Moon Shaped Pool
      rating: 5,
      text: "My 15th Radiohead show and somehow they still blow me away every time. Red Rocks is the perfect venue for their sound. Everything in Its Right Place as the closer was perfection.",
      setlistHighlights: "Everything in Its Right Place, Street Spirit (Fade Out), Climbing Up the Walls",
      
    },

    // Chris Martinez's reviews (3 reviews)
    {
      userId: users[4].id,
      concertId: concerts[3].id, // Daft Punk
      rating: 5,
      text: "The helmet reveal during One More Time had me tearing up. Daft Punk knows how to create a moment. The production value was insane - worth every penny.",
      setlistHighlights: "One More Time, Aerodynamic, Face to Face, Too Long",
      
    },
    {
      userId: users[4].id,
      concertId: concerts[4].id, // Fleetwood Mac
      rating: 3,
      text: "Decent show but definitely felt the absence of some original members. Stevie and Mick carried the energy. Good for nostalgia but not the full Fleetwood Mac experience.",
      setlistHighlights: "Dreams, Rhiannon, Go Your Own Way",
      
    },
    {
      userId: users[4].id,
      concertId: concerts[6].id, // Radiohead - OK Computer
      rating: 5,
      text: "A religious experience. Fitter Happier playing with the robotic voice and visual art was genius. The band was tight and Thom's falsetto was on point all night.",
      setlistHighlights: "Paranoid Android, Exit Music (For a Film), Lucky, Climbing Up the Walls",
      
    },
  ];

  for (const reviewData of reviewsData) {
    await prisma.review.create({ data: reviewData });
  }

  console.log(`Created ${reviewsData.length} reviews`);

  // Associate some users with concerts they attended (many-to-many)
  await prisma.concert.update({
    where: { id: concerts[0].id },
    data: { users: { connect: [{ id: users[0].id }, { id: users[2].id }] } },
  });

  await prisma.concert.update({
    where: { id: concerts[1].id },
    data: { users: { connect: [{ id: users[1].id }, { id: users[3].id }] } },
  });

  await prisma.concert.update({
    where: { id: concerts[3].id },
    data: { users: { connect: [{ id: users[1].id }, { id: users[4].id }] } },
  });

  console.log("Database seeded successfully!");
  console.log("\nTest credentials:");
  console.log("Email: alex.johnson@example.com");
  console.log("Email: sarah.chen@example.com");
  console.log("Email: mike.wilson@example.com");
  console.log("Email: emma.davis@example.com");
  console.log("Email: chris.martinez@example.com");
  console.log("Password for all users: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });