#!/bin/bash

# Vercel build script to ensure clean builds
echo "Running Vercel build script..."

# Show node and npm versions
echo "Node.js version:"
node -v
echo "NPM version:"
npm -v

# Clean install with the updated package.json where tailwindcss is a direct dependency
echo "Installing dependencies..."
npm ci || npm install

# Ensure that tailwindcss is available
echo "Manually installing critical dependencies..."
npm install tailwindcss postcss autoprefixer

# Create a minimal next.config.js if needed
echo "Setting up next.config.js..."
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  webpack: (config) => {
    // Fix module resolution issues
    config.optimization.moduleIds = 'deterministic';
    return config;
  },
  // Add environment variables from Vercel
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://my-ride-backend.vercel.app',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://my-ride-frontend.vercel.app',
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
  }
}

module.exports = nextConfig
EOL

# Create or ensure proper tailwind.config.js
echo "Setting up tailwind.config.js..."
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
EOL

# Create or ensure proper postcss.config.js
echo "Setting up postcss.config.js..."
cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# Create simple .env.production file
echo "Creating simplified .env.production file..."
cat > .env.production << 'EOL'
# Production environment variables
NEXT_PUBLIC_API_URL=https://my-ride-backend.vercel.app
NEXT_PUBLIC_SITE_URL=https://my-ride-git-main-rashid8740s-projects.vercel.app
NEXT_PUBLIC_ENABLE_CLIENT_ROUTING=true
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dghr3juaj
NEXT_PUBLIC_CLOUDINARY_API_KEY=284321333125128
CLOUDINARY_API_SECRET=3Qf7H4XpOKxwRtD2pmGw7dCKzoc
EOL

# Run the build
echo "Running build with environment variables:"
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "Build completed!" 