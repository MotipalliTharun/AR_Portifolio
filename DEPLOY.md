# Deploying to Vercel

Your AR Portfolio is ready to deploy! Follow these steps:

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your changes to GitHub** (if not already done):
   ```bash
   git push origin main
   ```
   If you get authentication errors, use GitHub Desktop or push via the GitHub website.

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

3. **Import Your Project**:
   - Click "Add New..." → "Project"
   - Find your repository: `MotipalliTharun/AR_Portifolio`
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `dist` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (should take 1-2 minutes)

6. **Get Your URL**:
   - Once deployed, you'll get a URL like: `https://ar-portifolio-xxx.vercel.app`
   - This is your AR portfolio URL!

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose your scope (personal or team)
   - Link to existing project or create new
   - Confirm settings

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## After Deployment

1. **Test Your AR Portfolio**:
   - Visit your Vercel URL
   - On mobile: Test the AR experience
   - On desktop: You should see the fallback 3D scene

2. **Generate QR Code**:
   - Use a QR code generator (e.g., [qr-code-generator.com](https://www.qr-code-generator.com/))
   - Enter your Vercel URL
   - Download and add to your resume/business card

3. **Custom Domain (Optional)**:
   - In Vercel dashboard, go to your project
   - Settings → Domains
   - Add your custom domain (e.g., `ar.motipallitharun.com`)

## Important Notes

- ✅ **HTTPS is Required**: Vercel provides HTTPS automatically (required for WebXR/AR)
- ✅ **Mobile Testing**: Best AR experience on iOS 15+ or Android with ARCore
- ✅ **Automatic Deployments**: Every push to `main` branch will auto-deploy

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify `npm run build` works locally
4. Check that TypeScript compiles without errors

## Your Current Status

✅ Code is fixed and builds successfully
✅ Ready to deploy
📝 Just need to push to GitHub and import to Vercel

---

**Next Step**: Push your code to GitHub, then import the project in Vercel dashboard!

