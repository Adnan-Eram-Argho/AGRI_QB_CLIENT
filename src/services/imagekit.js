/**
 * ImageKit client initialization
 * 
 * Environment Variables:
 * - VITE_IMAGEKIT_PUBLIC_KEY: ImageKit public key
 * - VITE_IMAGEKIT_URL_ENDPOINT: ImageKit URL endpoint
 */

import { ImageKit } from 'imagekitio-react';

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
  authenticationEndpoint: '/api/auth/imagekit-auth',
});

export default imagekit;