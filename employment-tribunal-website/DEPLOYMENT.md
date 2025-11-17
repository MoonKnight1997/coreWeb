# Deployment Guide - Employment Tribunal Documents

This guide provides step-by-step instructions for deploying the Employment Tribunal Documents website to production.

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Anthropic API key with sufficient credits
- [ ] Domain name (optional but recommended)
- [ ] Deployment platform account (Vercel, Netlify, etc.)
- [ ] All environment variables prepared
- [ ] Legal review of all disclaimer content completed
- [ ] Privacy policy reviewed by legal counsel
- [ ] Terms of service finalized

## Environment Variables

The following environment variables must be set:

### Required

```env
ANTHROPIC_API_KEY=sk-ant-...          # Your Anthropic API key
NODE_ENV=production                    # Production environment
NEXT_PUBLIC_APP_URL=https://your-domain.com  # Your app URL
```

### Optional

```env
MAX_FILE_SIZE=10485760                 # 10MB in bytes
ALLOWED_FILE_TYPES=.pdf,.docx,.txt,.doc
UPLOAD_SECRET=your-secret-key          # For additional upload security
```

## Deployment to Vercel (Recommended)

### Step 1: Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Employment Tribunal website"

# Push to GitHub
git remote add origin https://github.com/your-username/employment-tribunal.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `employment-tribunal-website`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each environment variable:
   - Variable name: `ANTHROPIC_API_KEY`
   - Value: Your API key
   - Environments: Production, Preview, Development

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployment URL
4. Test all functionality

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS according to Vercel instructions
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Deployment to Other Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Self-Hosted (Node.js)

```bash
# On your server
git clone https://github.com/your-username/employment-tribunal.git
cd employment-tribunal/employment-tribunal-website

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOL
ANTHROPIC_API_KEY=your_api_key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
EOL

# Build
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start npm --name "employment-tribunal" -- start
pm2 save
pm2 startup
```

### Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://your-domain.com
    restart: unless-stopped
```

## Post-Deployment Configuration

### 1. SSL/HTTPS Setup

Ensure HTTPS is enabled:

- **Vercel/Netlify:** Automatic HTTPS
- **Self-hosted:** Use Let's Encrypt with Nginx/Caddy

**Nginx configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Rate Limiting

Implement rate limiting to prevent abuse:

**Nginx rate limiting**:
```nginx
limit_req_zone $binary_remote_addr zone=upload:10m rate=10r/m;

location /api/upload {
    limit_req zone=upload burst=5;
    proxy_pass http://localhost:3000;
}
```

### 3. File Upload Security

- Ensure temp upload directory has proper permissions
- Set up automatic cleanup of old files
- Implement malware scanning if handling user uploads at scale

**Cleanup cron job**:
```bash
# Add to crontab -e
0 * * * * find /path/to/temp-uploads -type f -mmin +60 -delete
```

### 4. Monitoring Setup

Set up monitoring for:

- Application errors
- API usage and costs
- Server resources
- Uptime

**Recommended tools**:
- Sentry for error tracking
- Vercel Analytics / Google Analytics
- UptimeRobot for uptime monitoring
- Anthropic Dashboard for API usage

### 5. Backup Strategy

- Database: N/A (no persistent storage)
- Code: GitHub repository
- Logs: Configure log retention
- Configuration: Environment variables documented

## Security Hardening

### Security Headers

Verify these headers are set (Next.js config already includes them):

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### API Key Protection

- Never commit API keys to git
- Rotate API keys periodically
- Use environment-specific keys
- Monitor API usage for anomalies

### GDPR Compliance

- Ensure file deletion is working
- Verify no PII is logged
- Cookie consent is implemented
- Privacy policy is accessible

## Performance Optimization

### CDN Configuration

- Use Vercel Edge Network (automatic) or
- Configure CloudFlare for self-hosted deployments

### Caching Strategy

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### Image Optimization

- Use Next.js Image component
- Configure image domains in next.config.js
- Enable AVIF/WebP formats

## Troubleshooting

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Runtime Errors

Check logs:
```bash
# Vercel
vercel logs [deployment-url]

# PM2
pm2 logs employment-tribunal

# Docker
docker logs [container-id]
```

### API Issues

- Verify ANTHROPIC_API_KEY is set correctly
- Check API credit balance
- Review API rate limits
- Check error logs for specific error messages

## Rollback Procedure

### Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Self-Hosted

```bash
# With PM2
pm2 stop employment-tribunal
git checkout [previous-commit]
npm install
npm run build
pm2 restart employment-tribunal
```

## Maintenance

### Regular Tasks

- **Weekly:** Check error logs
- **Monthly:** Review API usage and costs
- **Quarterly:** Security audit
- **Annually:** Legal content review

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Support Contacts

- **Technical Issues:** [your-email]
- **Legal Questions:** [legal-contact]
- **API Support:** Anthropic support

## Deployment Checklist

Before going live:

- [ ] All environment variables set
- [ ] Build completes successfully
- [ ] All pages load correctly
- [ ] File upload works
- [ ] Document processing works
- [ ] All legal pages are accessible
- [ ] Disclaimers appear correctly
- [ ] HTTPS is enabled
- [ ] Custom domain configured
- [ ] Monitoring is set up
- [ ] Error tracking is configured
- [ ] Legal review completed
- [ ] Privacy policy approved
- [ ] Terms of service finalized
- [ ] Backup strategy in place
- [ ] Team has access to deployment
- [ ] Documentation is complete

## Emergency Contacts

In case of critical issues:

- **Platform:** Vercel Support (for Vercel deployments)
- **API:** Anthropic Support
- **Security:** [security-contact]
- **Legal:** [legal-contact]

---

**Last Updated:** [DATE]
**Version:** 1.0.0
