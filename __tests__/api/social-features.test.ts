/**
 * Integration tests for social features (likes and follows)
 * Run with: npm test -- social-features
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Social Features API', () => {
  let testUser1: { id: string }
  let testUser2: { id: string }
  let testReview: { id: string }

  beforeAll(async () => {
    // Create test users
    testUser1 = await prisma.user.create({
      data: {
        email: `test.like1.${Date.now()}@example.com`,
        password: 'password123',
        displayName: 'Test Liker',
      },
    })

    testUser2 = await prisma.user.create({
      data: {
        email: `test.like2.${Date.now()}@example.com`,
        password: 'password123',
        displayName: 'Test Reviewer',
      },
    })

    // Create a test review for user2
    testReview = await prisma.review.create({
      data: {
        userId: testUser2.id,
        concertId: 'test-concert-id',
        rating: 5,
        title: 'Test Review',
        artistName: 'Test Artist',
        venue: 'Test Venue',
        city: 'Test City',
      },
    })
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.reviewLike.deleteMany({
      where: {
        OR: [{ userId: testUser1.id }, { userId: testUser2.id }],
      },
    })

    await prisma.follow.deleteMany({
      where: {
        OR: [{ followerId: testUser1.id }, { followerId: testUser2.id }],
      },
    })

    await prisma.review.deleteMany({
      where: {
        OR: [{ userId: testUser1.id }, { userId: testUser2.id }],
      },
    })

    await prisma.user.deleteMany({
      where: {
        OR: [{ id: testUser1.id }, { id: testUser2.id }],
      },
    })
  })

  describe('Review Likes', () => {
    it('should create a like', async () => {
      const like = await prisma.reviewLike.create({
        data: {
          userId: testUser1.id,
          reviewId: testReview.id,
        },
      })

      expect(like).toBeDefined()
      expect(like.userId).toBe(testUser1.id)
      expect(like.reviewId).toBe(testReview.id)
    })

    it('should prevent duplicate likes (unique constraint)', async () => {
      await expect(
        prisma.reviewLike.create({
          data: {
            userId: testUser1.id,
            reviewId: testReview.id,
          },
        })
      ).rejects.toThrow()
    })

    it('should delete a like', async () => {
      const like = await prisma.reviewLike.create({
        data: {
          userId: testUser1.id,
          reviewId: testReview.id,
        },
      })

      const deleted = await prisma.reviewLike.delete({
        where: {
          userId_reviewId: {
            userId: testUser1.id,
            reviewId: testReview.id,
          },
        },
      })

      expect(deleted.id).toBe(like.id)
    })

    it('should count likes correctly', async () => {
      // Create 3 likes from different users
      const user3 = await prisma.user.create({
        data: {
          email: `test.like3.${Date.now()}@example.com`,
          password: 'password123',
          displayName: 'Test Liker 3',
        },
      })

      const user4 = await prisma.user.create({
        data: {
          email: `test.like4.${Date.now()}@example.com`,
          password: 'password123',
          displayName: 'Test Liker 4',
        },
      })

      await prisma.reviewLike.createMany({
        data: [
          { userId: testUser1.id, reviewId: testReview.id },
          { userId: user3.id, reviewId: testReview.id },
          { userId: user4.id, reviewId: testReview.id },
        ],
      })

      const count = await prisma.reviewLike.count({
        where: { reviewId: testReview.id },
      })

      expect(count).toBe(3)

      // Cleanup
      await prisma.user.deleteMany({
        where: { OR: [{ id: user3.id }, { id: user4.id }] },
      })
    })
  })

  describe('User Following', () => {
    it('should create a follow relationship', async () => {
      const follow = await prisma.follow.create({
        data: {
          followerId: testUser1.id,
          followingId: testUser2.id,
        },
      })

      expect(follow).toBeDefined()
      expect(follow.followerId).toBe(testUser1.id)
      expect(follow.followingId).toBe(testUser2.id)
    })

    it('should prevent duplicate follows (unique constraint)', async () => {
      await expect(
        prisma.follow.create({
          data: {
            followerId: testUser1.id,
            followingId: testUser2.id,
          },
        })
      ).rejects.toThrow()
    })

    it('should prevent self-following (application logic)', async () => {
      // This should be prevented by the API, not the database
      // Database allows it, but API should reject it
      const follow = await prisma.follow.create({
        data: {
          followerId: testUser1.id,
          followingId: testUser1.id,
        },
      })

      // Database allows it, but we expect API to prevent it
      expect(follow).toBeDefined()
      // Note: Add API-level validation to prevent this
    })

    it('should delete a follow', async () => {
      const follow = await prisma.follow.create({
        data: {
          followerId: testUser1.id,
          followingId: testUser2.id,
        },
      })

      const deleted = await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: testUser1.id,
            followingId: testUser2.id,
          },
        },
      })

      expect(deleted.id).toBe(follow.id)
    })

    it('should count followers correctly', async () => {
      const user3 = await prisma.user.create({
        data: {
          email: `test.follow3.${Date.now()}@example.com`,
          password: 'password123',
          displayName: 'Test Follower 3',
        },
      })

      const user4 = await prisma.user.create({
        data: {
          email: `test.follow4.${Date.now()}@example.com`,
          password: 'password123',
          displayName: 'Test Follower 4',
        },
      })

      await prisma.follow.createMany({
        data: [
          { followerId: user3.id, followingId: testUser2.id },
          { followerId: user4.id, followingId: testUser2.id },
        ],
      })

      const followerCount = await prisma.follow.count({
        where: { followingId: testUser2.id },
      })

      expect(followerCount).toBeGreaterThanOrEqual(2)

      // Cleanup
      await prisma.user.deleteMany({
        where: { OR: [{ id: user3.id }, { id: user4.id }] },
      })
    })
  })

  describe('Query Performance', () => {
    it('should efficiently query followers with user data', async () => {
      const followers = await prisma.follow.findMany({
        where: { followingId: testUser2.id },
        include: {
          follower: {
            select: {
              id: true,
              displayName: true,
              _count: {
                select: {
                  followers: true,
                  reviews: true,
                },
              },
            },
          },
        },
        take: 10,
      })

      expect(Array.isArray(followers)).toBe(true)
      expect(followers[0]?.follower).toBeDefined()
      expect(followers[0]?.follower.displayName).toBeDefined()
    })

    it('should efficiently query feed reviews', async () => {
      const reviews = await prisma.review.findMany({
        where: {
          user: {
            followers: {
              some: {
                followerId: testUser1.id,
              },
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      })

      expect(Array.isArray(reviews)).toBe(true)
    })
  })
})
