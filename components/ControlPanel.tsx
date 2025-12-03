import React from 'react';
import { ImageSize, ProductType } from '../types';
import { Shirt, Check, Layers, Type } from 'lucide-react';

interface ControlPanelProps {
  selectedProducts: ProductType[];
  onToggleProduct: (product: ProductType) => void;
  selectedSize: ImageSize;
  onSizeChange: (size: ImageSize) => void;
  customPrompt: string;
  onPromptChange: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  hasApiKey: boolean;
  onConnect: () => void;
  hasLogo: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedProducts,
  onToggleProduct,
  selectedSize,
  onSizeChange,
  customPrompt,
  onPromptChange,
  isGenerating,
  onGenerate,
  hasApiKey,
  onConnect,
  hasLogo
}) => {
  return (
    <div className="space-y-6">
      {/* Product Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Shirt className="w-5 h-5 text-orange-500" />
          Merchandise Type
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(ProductType).map((type) => {
            const isSelected = selectedProducts.includes(type);
            return (
              <button
                key={type}
                onClick={() => onToggleProduct(type)}
                className={`
                  relative px-3 py-3 rounded-lg text-sm font-medium transition-all
                  border
                  ${isSelected 
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20' 
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-750'
                  }
                `}
              >
                {type}
                {isSelected && <Check className="absolute top-1 right-1 w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-orange-500" />
          Resolution
        </h3>
        <div className="flex bg-neutral-800 p-1 rounded-lg border border-neutral-700">
          {Object.values(ImageSize).map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`
                flex-1 py-1.5 text-sm font-medium rounded-md transition-all
                ${selectedSize === size 
                  ? 'bg-neutral-600 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-neutral-200'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div>
         <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Type className="w-5 h-5 text-orange-500" />
          Custom Instructions
        </h3>
        <textarea
          value={customPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="E.g., Make the hoodie navy blue, ensure the logo is large on the back..."
          className="w-full h-24 bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
        />
      </div>

      {/* Action Button */}
      <div className="pt-2">
        {!hasApiKey ? (
          <button
            onClick={onConnect}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Connect API Key
          </button>
        ) : (
          <button
            onClick={onGenerate}
            disabled={isGenerating || !hasLogo || selectedProducts.length === 0}
            className={`
              w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
              ${(isGenerating || !hasLogo || selectedProducts.length === 0)
                ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-500 text-white transform hover:scale-[1.02] active:scale-[0.98] shadow-orange-900/30'
              }
            `}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              'Generate Merchandise'
            )}
          </button>
        )}
        {hasApiKey && !hasLogo && (
          <p className="text-center text-red-400 text-xs mt-2">Please upload a logo first</p>
        )}
        {hasApiKey && hasLogo && selectedProducts.length === 0 && (
          <p className="text-center text-orange-400 text-xs mt-2">Select at least one product</p>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
