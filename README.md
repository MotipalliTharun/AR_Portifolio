# AR Portfolio - WebXR/WebAR Experience

An interactive Augmented Reality portfolio experience built with React, TypeScript, Three.js, and WebXR. When someone scans a QR code on your resume or business card, they'll see your portfolio floating in AR space.

## 🎯 Features

- **WebXR AR Support** - Native AR experience on supported devices (iOS 15+, Android with ARCore)
- **Fallback 3D Scene** - Beautiful 3D preview for devices without AR support
- **Interactive Portfolio Cards** - Name card with title, plus info tiles for Skills, Projects, and Contact
- **Tap to Place** - Simple tap/click to place your portfolio in AR space
- **Floating Animations** - Subtle idle animations for a modern, techy aesthetic
- **Responsive Design** - Works on mobile and desktop

## 🧱 Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/xr** - WebXR integration
- **Tailwind CSS** - Styling

## 📦 Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at `http://localhost:3000`
   - For AR testing, use a mobile device on the same network or deploy to HTTPS

## 🚀 Building for Production

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

3. **The `dist` folder contains your production-ready files**

## 🌐 Deployment

### Option 1: Vercel (Recommended - Free HTTPS)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Your site will be live at `https://your-project.vercel.app`**

### Option 2: Netlify (Free HTTPS)

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

3. **Or connect your GitHub repo to Netlify for automatic deployments**

### Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to `package.json`:**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 4: Any Static Host

Upload the contents of the `dist` folder to any static hosting service:
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- Your own server

## 📱 QR Code Setup

1. **Get your deployed URL** (e.g., `https://your-name-ar.vercel.app`)

2. **Generate a QR code:**
   - Use a free service like [QR Code Generator](https://www.qr-code-generator.com/)
   - Or use a library like `qrcode` in Node.js
   - Enter your AR portfolio URL

3. **Add QR code to your resume/business card:**
   - Print the QR code
   - Place it prominently on your resume or business card
   - Add a note like: "Scan to view my AR portfolio"

## ✏️ Customization

### Update Your Information

1. **Name and Title** - Edit `src/components/NameCard.tsx`:
   ```tsx
   <Text>Tharun Motipalli</Text>
   <Text>Software Engineer • Full-Stack & AI</Text>
   ```

2. **Skills** - Edit `src/ar/ARScene.tsx` and `src/components/Fallback3DScene.tsx`:
   ```tsx
   details={[
     'Java',
     'Spring Boot',
     'React',
     // Add your skills here
   ]}
   ```

3. **Projects** - Edit the Projects InfoTile:
   ```tsx
   details={[
     'Your Project 1',
     'Your Project 2',
     // Add your projects here
   ]}
   ```

4. **Contact Info** - Edit the Contact InfoTile:
   ```tsx
   details={[
     'Email: your.email@example.com',
     'Portfolio: yourwebsite.com'
   ]}
   ```

5. **Portfolio URL** - Update the link in `InfoTile.tsx` and `ARScene.tsx`:
   ```tsx
   window.open('https://your-portfolio-url.com', '_blank')
   ```

### Customize Colors

Edit `tailwind.config.js`:
```js
colors: {
  'ar-primary': '#6366f1',    // Main color
  'ar-secondary': '#8b5cf6',  // Secondary color
  'ar-accent': '#ec4899',     // Accent color
}
```

### Adjust 3D Models

- **Position**: Change `position` props in `ARScene.tsx`
- **Size**: Modify geometry args in `NameCard.tsx` and `InfoTile.tsx`
- **Animation**: Adjust `Float` component props or `useFrame` animations

## 🎮 How It Works

1. **User scans QR code** → Opens your AR portfolio URL
2. **App checks for WebXR support**:
   - If supported → Shows AR entry button
   - If not supported → Shows 3D fallback scene
3. **User taps "Enter AR Experience"** → Requests WebXR session
4. **User grants camera permission** → AR session starts
5. **User taps screen** → Portfolio is placed in AR space
6. **User can interact** → Hover over tiles to see details, tap Contact to open portfolio

## 🔧 Troubleshooting

### AR Not Working?

- **HTTPS Required**: WebXR requires HTTPS (or localhost). Make sure your deployed site uses HTTPS.
- **Device Support**: 
  - iOS 15+ with Safari
  - Android with Chrome and ARCore support
  - Desktop browsers don't support AR (will show fallback)
- **Camera Permission**: Ensure you grant camera access when prompted

### Build Errors?

- **Clear node_modules**: `rm -rf node_modules && npm install`
- **Check Node version**: Requires Node 16+ (check with `node -v`)
- **TypeScript errors**: Run `npm run build` to see detailed errors

### Performance Issues?

- **Reduce model complexity**: Simplify geometries in components
- **Lower quality**: Adjust `dpr` in Canvas component
- **Disable shadows**: Remove shadow casting if needed

## 📝 File Structure

```
ar-portfolio/
├── src/
│   ├── ar/
│   │   ├── ARExperience.tsx    # Main AR container
│   │   └── ARScene.tsx          # 3D scene with portfolio objects
│   ├── components/
│   │   ├── NameCard.tsx         # Main name/title card
│   │   ├── InfoTile.tsx         # Skills/Projects/Contact tiles
│   │   └── Fallback3DScene.tsx  # 3D preview for non-AR devices
│   ├── App.tsx                  # Main app (AR support check)
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind imports
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎨 Design Notes

- **Dark Theme**: Modern dark background (#0a0a0a)
- **Glow Effects**: Subtle emissive materials on 3D objects
- **Smooth Animations**: Floating and rotation for visual interest
- **Tech Aesthetic**: Clean, modern, professional look

## 📄 License

This project is open source and available for personal and commercial use.

## 🙏 Credits

Built with:
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Ready to impress with your AR portfolio! 🚀**

For questions or issues, check the code comments - they're designed to help you customize everything easily.
# AR_Portifolio
