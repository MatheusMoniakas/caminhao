#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';

console.log('🚀 Building frontend for Netlify...');

try {
  // Executar TypeScript compiler
  console.log('📝 Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });
  
  // Executar Vite build
  console.log('⚡ Building with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ Frontend build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
