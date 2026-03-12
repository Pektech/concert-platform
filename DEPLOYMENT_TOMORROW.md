# ConcertVibe VPS Deployment Checklist

## Pre-Deployment

- [ ] RackNerd VPS is running and accessible
- [ ] Domain `concertvibe.pektech.dev` points to VPS IP (DNS A record)
- [ ] SSH access working (`ssh root@your-vps-ip`)

## VPS Setup (VPSKit)

- [ ] Run VPSKit setup script:
  ```bash
  bash <(curl -sL https://raw.githubusercontent.com/mariusdjen/vpskit/main/vpskit.sh)
  ```
- [ ] Complete all 9 setup steps
- [ ] Note the deploy user created (default: `deploy`)
- [ ] Test SSH access with new user

## Database Setup

- [ ] Create production database in Docker
- [ ] Update `DATABASE_URL` in `.env.production`
- [ ] Run Prisma migrations:
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Seed database (optional):
  ```bash
  npx prisma db seed
  ```

## Environment Configuration

- [ ] Copy `.env.production.example` to `.env.production`
- [ ] Generate `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Set `NEXTAUTH_URL=https://concertvibe.pektech.dev`
- [ ] Set production `DATABASE_URL`

## Build & Deploy

- [ ] Install dependencies:
  ```bash
  npm ci
  ```
- [ ] Build Next.js app:
  ```bash
  npm run build
  ```
- [ ] Start with PM2 or Docker
- [ ] Configure Caddy for reverse proxy + SSL

## Post-Deployment

- [ ] Test HTTPS access
- [ ] Test login/signup
- [ ] Test review creation
- [ ] Test social features (likes, follows, feed)
- [ ] Check SSL certificate (should be auto from Caddy)

## Rollback Plan

If something goes wrong:
1. Keep local dev environment running
2. Can revert to localhost if needed
3. VPSKit has backup/restore commands

---

## Quick Commands Reference

**VPSKit:**
```bash
vpskit  # Main menu
```

**PM2 (Process Manager):**
```bash
pm2 start npm --name "concertvibe" -- run start
pm2 status
pm2 logs concertvibe
pm2 restart concertvibe
```

**Docker:**
```bash
docker ps
docker compose logs -f
```

**Database:**
```bash
npx prisma migrate deploy
npx prisma studio  # Local only
```

---

## DNS Configuration

**Add A Record:**
- Name: `concertvibe`
- Type: `A`
- Value: `<your-vps-ip>`
- TTL: `3600` (or auto)

**Wait for propagation:** 5-30 minutes typically

---

## Troubleshooting

**Can't access HTTPS:**
- Check DNS propagation: `nslookup concertvibe.pektech.dev`
- Check Caddy is running: `sudo systemctl status caddy`
- Check Caddy logs: `sudo journalctl -u caddy -f`

**Login not working:**
- Verify `NEXTAUTH_URL` matches domain exactly
- Check `NEXTAUTH_SECRET` is set
- Check database connection

**Database errors:**
- Verify `DATABASE_URL` is correct
- Check Docker container is running
- Run migrations: `npx prisma migrate deploy`

---

## Success Criteria

✅ Can access `https://concertvibe.pektech.dev`
✅ SSL certificate is valid (green lock)
✅ Can create account / login
✅ Can create a review
✅ Can like/follow
✅ Feed shows followed users' reviews

---

*Ready to deploy? Run through this checklist step by step tomorrow!*
