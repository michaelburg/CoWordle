# Deployment Guide

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository.

2. **Enable GitHub Pages**:

   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"

3. **Automatic Deployment**:

   - The GitHub Action will automatically deploy when you push to the `master` branch
   - You can monitor the deployment in the "Actions" tab of your repository

4. **Manual Deployment** (if needed):
   ```bash
   npm run deploy
   ```

### Important Notes

- **Solo Mode Only**: GitHub Pages only serves static files, so only the solo game mode will work
- **Multiplayer Mode**: For full multiplayer functionality, you'll need to deploy the server component separately (see Server Deployment section below)
- **URL**: Your game will be available at `https://yourusername.github.io/CoWordle/`

### Server Deployment (for Multiplayer)

To enable multiplayer functionality, deploy the server to a platform that supports Node.js:

#### Option 1: Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

#### Option 2: Heroku

1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Deploy: `git push heroku master`

#### Option 3: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel --prod`

#### Option 4: DigitalOcean App Platform

1. Connect your GitHub repository
2. Select the server directory
3. Configure environment variables

### Environment Variables (for server deployment)

If deploying the server separately, you may need to set:

- `PORT`: Server port (usually set automatically)
- `NODE_ENV=production`

### Local Development

- **Full app**: `npm run dev` (runs both client and server)
- **Client only**: `npm run client`
- **Server only**: `npm run server`
- **Build**: `npm run build`
- **Preview build**: `npm run preview`

### Troubleshooting

1. **Build fails**: Check that all dependencies are installed with `npm install`
2. **404 on GitHub Pages**: Make sure the repository name matches the base path in `vite.config.ts`
3. **Styles not loading**: Verify the base path configuration is correct
4. **Multiplayer not working**: This is expected on GitHub Pages - deploy the server separately

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` directory with your domain
2. Configure DNS records to point to GitHub Pages
3. Update the `base` path in `vite.config.ts` if needed
