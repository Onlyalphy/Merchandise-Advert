import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-neutral-800/30 border-2 border-dashed border-neutral-700 rounded-2xl p-8">
        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <Maximize2 className="w-8 h-8 text-neutral-600" />
        </div>
        <h3 className="text-xl font-bold text-neutral-300 mb-2">No Designs Yet</h3>
        <p className="text-neutral-500 text-center max-w-sm">
          Upload your logo and select products to start generating high-quality mockups.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
      {images.map((image) => (
        <div 
          key={image.id} 
          className="group relative bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 shadow-md transition-all hover:shadow-xl hover:border-orange-500/30"
        >
          <div className="aspect-square w-full overflow-hidden">
            <img 
              src={image.url} 
              alt={image.prompt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-md backdrop-blur-md border border-white/10">
              {image.size}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{image.type}</p>
                <p className="text-xs text-neutral-300 truncate max-w-[150px]">
                  {new Date(image.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <a 
                href={image.url} 
                download={`wildsync-${image.type.toLowerCase()}-${image.id}.png`}
                className="p-2 bg-white text-black rounded-full hover:bg-orange-500 hover:text-white transition-colors"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
