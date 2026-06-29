import express from 'express';
import cors from 'cors';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

import fs from 'fs';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase Client SDK instead of Admin
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

export const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---

// Public endpoint to validate a license
app.options('/api/master-license/validate', cors()); // Preflight request handling
app.all('/api/master-license/validate', async (req, res) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    try {
      let license_key = req.body?.license_key || req.query?.license_key || req.body?.key || req.query?.key || '';
      let domain = req.body?.domain || req.query?.domain || '';

      if (typeof license_key !== 'string') license_key = String(license_key);
      if (typeof domain !== 'string') domain = String(domain);
      
      license_key = license_key.trim();
      domain = domain.trim();

      console.log(`[Validation Request] Key: "${license_key}", Domain: "${domain}"`);

      if (!license_key || !domain) {
        console.log(`[Validation Failed] Missing key or domain`);
        res.status(400).json({ valid: false, error: 'Missing license_key or domain' });
        return;
      }

      // Get Firestore document by license_key
      const licensesRef = collection(db, 'licenses');
      const q = query(licensesRef, where('key', '==', license_key));
      console.log('Fetching docs from Firestore...');
      const snapshot = await getDocs(q);
      console.log('Snapshot received, empty:', snapshot.empty);

      if (snapshot.empty) {
        console.log(`[Validation Failed] License key not found in DB`);
        res.status(200).json({ 
          valid: false, 
          status: 'invalid',
          message: 'La clave de licencia no existe o es inválida.' 
        });
        return;
      }

      const licenseData = snapshot.docs[0].data();

      const normalizeDomain = (d: any) => {
        if (typeof d !== 'string') return '';
        return d.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
      };

      const normLicense = normalizeDomain(licenseData.domain);
      const normRequest = normalizeDomain(domain);
      
      // Permitir entornos de desarrollo y preview de AI Studio
      const isDevEnvironment = normRequest.includes('localhost') || 
                               normRequest.includes('127.0.0.1') || 
                               normRequest.endsWith('.run.app');

      console.log(`[Validation Domain Check] DB Domain: "${normLicense}", Request Domain: "${normRequest}", isDev: ${isDevEnvironment}`);

      if (normLicense !== normRequest && !isDevEnvironment && normLicense !== '*') {
        console.log(`[Validation Failed] Domain mismatch`);
        res.status(200).json({ 
          valid: false, 
          status: 'invalid',
          message: 'La licencia no es válida para este dominio.' 
        });
        return;
      }

      if (licenseData.status === 'revoked') {
        console.log(`[Validation Failed] License status is revoked`);
        res.status(200).json({ 
          valid: false, 
          status: 'revoked',
          message: 'La licencia ha sido revocada por un administrador.' 
        });
        return;
      } else if (licenseData.status !== 'active') {
        console.log(`[Validation Failed] License status is ${licenseData.status}`);
        res.status(200).json({ 
          valid: false, 
          status: licenseData.status,
          message: `La licencia no está activa. Estado actual: ${licenseData.status}` 
        });
        return;
      }

      console.log(`[Validation Success] License valid`);
      res.status(200).json({ valid: true, message: 'License is valid', type: licenseData.type || 'standard' });
    } catch (error: any) {
      console.error('Error validating license:', error);
      res.status(200).json({ 
        valid: false, 
        status: 'invalid',
        message: 'La clave de licencia no existe o es inválida.',
        error: error.message,
        stack: error.stack
      });
    }
  });

// Wrap Vite setup in a function to avoid top-level await issues
async function setupVite() {
  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== 'production') {
      const viteModule = 'vite';
      const { createServer: createViteServer } = await import(/* @vite-ignore */ viteModule);
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      // Support Express v4 syntax
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

setupVite();
