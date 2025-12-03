import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface LogoUploadProps {
  onLogoSelected: (file: File | null) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ onLogoSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onLogoSelected(file);
    }
  }, [onLogoSelected]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearLogo = () => {
    setPreview(null);
    onLogoSelected(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-orange-500" />
          Brand Logo
        </h3>
        {preview && (
          <button 
            onClick={clearLogo} 
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {preview ? (
        <div className="relative w-full aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 shadow-sm group">
          <img 
            src={preview} 
            alt="Logo Preview" 
            className="w-full h-full object-contain p-4"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={clearLogo}
              className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`
            relative w-full aspect-video rounded-lg border-2 border-dashed 
            flex flex-col items-center justify-center transition-all cursor-pointer
            ${isDragging 
              ? 'border-orange-500 bg-orange-500/10' 
              : 'border-neutral-600 hover:border-orange-400 hover:bg-neutral-800'
            }
          `}
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleInputChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="p-4 rounded-full bg-neutral-700 mb-3">
            <Upload className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-300 font-medium">Click or drag logo here</p>
          <p className="text-xs text-neutral-500 mt-1">PNG, JPG, SVG supported</p>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;
