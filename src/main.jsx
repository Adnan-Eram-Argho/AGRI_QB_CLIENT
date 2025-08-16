/**
 * Client entry point
 * 
 * Environment Variables:
 * - VITE_FIREBASE_API_KEY: Firebase API key
 * - VITE_FIREBASE_AUTH_DOMAIN: Firebase auth domain
 * - VITE_FIREBASE_PROJECT_ID: Firebase project ID
 * - VITE_IMAGEKIT_PUBLIC_KEY: ImageKit public key
 * - VITE_IMAGEKIT_URL_ENDPOINT: ImageKit URL endpoint
 * 
 * Run commands:
 * - Development: npm run dev
 * - Production: npm run build && npm run preview
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)