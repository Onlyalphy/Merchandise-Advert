import { GoogleGenAI } from "@google/genai";
import { ImageSize, ProductType } from "../types";

// Helper to convert File/Blob to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface GenerateParams {
  logoBase64: string;
  productType: ProductType;
  size: ImageSize;
  customPrompt?: string;
}

export const generateMerchImage = async (params: GenerateParams): Promise<string> => {
  const { logoBase64, productType, size, customPrompt } = params;

  // We must create a new instance each time to ensure we catch the latest API Key if it changed
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = "gemini-3-pro-image-preview";

  const systemPrompt = `
    You are an expert product photographer and merchandise designer for 'WildSync Adventures', an outdoor adventure brand.
    Your task is to take the provided logo and place it naturally and realistically onto high-quality merchandise.
    
    The logo might need to be reshaped or placed on a clean background (white or brand appropriate) to look best.
    Ensure the lighting, texture, and fabric folds are realistic. The logo should follow the curvature of the product.
    
    Product: ${productType}
    Desired Output: A professional product shot on a clean, white background suitable for an e-commerce store.
    ${customPrompt ? `Additional Instructions: ${customPrompt}` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png", // Assuming input is png/jpeg, genai handles standard image types well
              data: logoBase64,
            },
          },
          {
            text: systemPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1",
        },
      },
    });

    // Extract image from response
    // For gemini-3-pro-image-preview, images come in parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
