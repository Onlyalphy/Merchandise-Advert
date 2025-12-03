import React, { useState, useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';
import LogoUpload from './components/LogoUpload';
import ControlPanel from './components/ControlPanel';
import ImageGallery from './components/ImageGallery';
import { GeneratedImage, ImageSize, ProductType } from './types';
import { fileToGenerativePart, generateMerchImage } from './services/gemini';

const App: React.FC = () => {
  // --- State ---
  const [hasApiKey, setHasApiKey] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([ProductType.Hoodie]);
  const [selectedSize, setSelectedSize] = useState<ImageSize>(ImageSize.Resolution1K);
  const [customPrompt, setCustomPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Effects ---

  // Check API key on mount
  useEffect(() => {
    const checkKey = async () => {
      // Access via any to avoid conflicting with global type definitions
      const win = window as any;
      if (win.aistudio && win.aistudio.hasSelectedApiKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // Fallback for dev environments where window.aistudio might not be mocked
        console.warn("window.aistudio not found. Assuming false.");
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  // --- Handlers ---

  const handleConnect = async () => {
    const win = window as any;
    if (win.aistudio && win.aistudio.openSelectKey) {
      try {
        await win.aistudio.openSelectKey();
        // Assume success if no error thrown, as per instructions
        setHasApiKey(true);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to connect API key. Please try again.");
      }
    }
  };

  const handleToggleProduct = (product: ProductType) => {
    setSelectedProducts(prev => {
      if (prev.includes(product)) {
        return prev.filter(p => p !== product);
      }
      return [...prev, product];
    });
  };

  const handleGenerate = async () => {
    if (!logoFile) {
      setError("Please upload a logo first.");
      return;
    }
    if (selectedProducts.length === 0) {
      setError("Please select at least one product type.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const logoBase64 = await fileToGenerativePart(logoFile);
      const newImages: GeneratedImage[] = [];

      // Generate images sequentially for selected products
      // In a real app we might do this in parallel, but with rate limits sequentially is safer for now
      for (const type of selectedProducts) {
        const resultBase64 = await generateMerchImage({
          logoBase64,
          productType: type,
          size: selectedSize,
          customPrompt
        });

        newImages.push({
          id: crypto.randomUUID(),
          url: resultBase64,
          prompt: customPrompt || `Standard ${type} mockup`,
          type: type,
          size: selectedSize,
          createdAt: Date.now()
        });
      }

      setImages(prev => [...newImages, ...prev]);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setError("API Key invalid or expired. Please connect again.");
      } else {
        setError("Failed to generate images. Please try again. " + (err.message || ""));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-900/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">WILDSYNC <span className="text-orange-500">ADVENTURES</span></h1>
              <p className="text-xs text-neutral-400 font-medium tracking-wider uppercase">Merch Generator</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${hasApiKey ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {hasApiKey ? 'System Online' : 'Key Required'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Controls */}
          <aside className="lg:w-[400px] shrink-0 space-y-8">
            <div className="bg-neutral-850 rounded-2xl p-6 border border-neutral-800 shadow-xl bg-neutral-900/50">
              <LogoUpload onLogoSelected={setLogoFile} />
            </div>

            <div className="bg-neutral-850 rounded-2xl p-6 border border-neutral-800 shadow-xl bg-neutral-900/50">
              <ControlPanel 
                selectedProducts={selectedProducts}
                onToggleProduct={handleToggleProduct}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                customPrompt={customPrompt}
                onPromptChange={setCustomPrompt}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
                hasApiKey={hasApiKey}
                onConnect={handleConnect}
                hasLogo={!!logoFile}
              />
            </div>

            {error && (
               <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-200 text-sm">
                 {error}
                 {error.includes("API Key") && (
                   <button onClick={handleConnect} className="block mt-2 text-red-400 underline hover:text-red-300">Reconnect</button>
                 )}
               </div>
            )}
            
            <div className="text-xs text-neutral-500 px-4">
              <p>Powered by Gemini 3 Pro Image Preview</p>
              <p className="mt-1">
                Note: Generating 4K images may take longer. Please be patient.
                Uses <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">Paid Tier</a> compute.
              </p>
            </div>
          </aside>

          {/* Results Gallery */}
          <section className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Generated Merch</h2>
              {images.length > 0 && (
                <span className="text-sm text-neutral-400">{images.length} designs</span>
              )}
            </div>
            <ImageGallery images={images} />
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;