/**
 * Image uploader component using ImageKit
 * 
 * Environment Variables:
 * - VITE_IMAGEKIT_PUBLIC_KEY: ImageKit public key
 * - VITE_IMAGEKIT_URL_ENDPOINT: ImageKit URL endpoint
 */

import { useState, useEffect } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const ImageUploader = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authParams, setAuthParams] = useState({});

  useEffect(() => {
    fetchAuthParams();
  }, []);

  const fetchAuthParams = async () => {
    try {
      const response = await api.get('/auth/imagekit-auth');
      setAuthParams(response.data);
    } catch (error) {
      toast.error('Failed to get upload authorization');
      console.error(error);
    }
  };

  const onError = (err) => {
    console.log(err);
    toast.error('Image upload failed');
    setUploading(false);
  };

  const onSuccess = (res) => {
    const newImage = res.url;
    setImages([...images, newImage]);
    onImagesChange([...images, newImage]);
    setUploading(false);
  };

  const onUploadStart = () => {
    setUploading(true);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div>
      <IKContext
        publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
        authenticationEndpoint={authParams.authenticationEndpoint}
      >
        <div className="flex flex-wrap gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Uploaded ${index}`}
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <IKUpload
          fileName="question-image"
          onError={onError}
          onSuccess={onSuccess}
          onUploadStart={onUploadStart}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700
          "
          disabled={uploading}
        />
        
        {uploading && <p className="mt-2 text-gray-400">Uploading image...</p>}
      </IKContext>
    </div>
  );
};

export default ImageUploader;