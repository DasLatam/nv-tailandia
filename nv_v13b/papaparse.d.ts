// Fix for Next/Vercel TS build: papaparse has no bundled typings in this project.
// This ambient module declaration prevents TS from failing the build.
declare module 'papaparse';
