/*
  Warnings:

  - You are about to drop the column `attended` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "attended",
ADD COLUMN     "artistName" TEXT NOT NULL DEFAULT 'Unknown Artist',
ADD COLUMN     "city" TEXT,
ADD COLUMN     "concertDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "venue" TEXT NOT NULL DEFAULT 'Unknown Venue';

-- CreateTable
CREATE TABLE "ApiCache" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiCache_key_key" ON "ApiCache"("key");

-- CreateIndex
CREATE INDEX "ApiCache_key_idx" ON "ApiCache"("key");

-- CreateIndex
CREATE INDEX "ApiCache_expiresAt_idx" ON "ApiCache"("expiresAt");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_concertId_idx" ON "Review"("concertId");

-- CreateIndex
CREATE INDEX "Review_artistName_idx" ON "Review"("artistName");

-- CreateIndex
CREATE INDEX "Review_concertDate_idx" ON "Review"("concertDate");
