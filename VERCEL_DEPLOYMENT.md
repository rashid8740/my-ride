# Vercel Deployment Guide

## Deployment Configuration

This project is configured to deploy on Vercel with a custom build process to ensure all dependencies are properly installed and the build completes successfully.

## Key Files

1. `vercel.json` - Contains the Vercel-specific configuration
2. `Frontend/vercel-build.sh` - Custom build script that runs during deployment

## Troubleshooting Common Issues

### Metadata in Client Components

In Next.js, you cannot have metadata exports in components with the "use client" directive:

```js
// INCORRECT ❌
"use client";
export const metadata = { ... };

// CORRECT ✅ - Put metadata in a layout.js file
// layout.js
export const metadata = { ... };
export default function Layout({ children }) { return children; }

// page.js
"use client";
// Client component code
```

### Missing Dependencies

If you encounter errors about missing dependencies (like @emotion/react), check:

1. That they're included in package.json
2. That the vercel-build.sh script is properly installing them

### Build Cache Issues

If you're experiencing inconsistent builds, the vercel-build.sh script helps by:

1. Clearing the Next.js cache
2. Reinstalling dependencies
3. Running a fresh build

## Deployment Steps

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Use the following build settings:
   - Framework Preset: Next.js
   - Build Command: ./vercel-build.sh
   - Output Directory: .next

## After Deployment

After a successful deployment, verify that:

1. All pages load correctly
2. No console errors related to missing modules
3. Styling and components render as expected 