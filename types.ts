export enum ImageSize {
  Resolution1K = '1K',
  Resolution2K = '2K',
  Resolution4K = '4K',
}

export enum ProductType {
  Hoodie = 'Hoodie',
  Shirt = 'T-Shirt',
  Hat = 'Hat',
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  type: ProductType;
  size: ImageSize;
  createdAt: number;
}

export interface GenerationConfig {
  productTypes: ProductType[];
  size: ImageSize;
  customPrompt: string;
}
