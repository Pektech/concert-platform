# Issues - Concert Platform

## Encountered Issues

### 2026-03-08 - Vercel Prisma Build Error

**Issue**: Vercel deployment requires Prisma client to be generated after npm install.

**Solution**: Added `"postinstall": "prisma generate"` to package.json scripts section.

**Why**: The postinstall script runs automatically after npm install, ensuring the Prisma client is generated during the Vercel build process.
