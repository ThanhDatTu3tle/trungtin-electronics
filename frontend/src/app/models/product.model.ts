export interface Product {
  productId: number;
  categoryId: number;
  productName: string;
  description: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  imageUrl: string;
  createdDate: string;   // ISO string (có thể parse sang Date khi dùng)
  updatedDate: string;
  code: string;
  discountPrice?: number | null;
  currency: string;
  brand: string;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  spotlight: boolean;
  category?: Category | null;
  productTags: ProductTag[];
  categoryName?: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
}

export interface ProductTag {
  tagId: number;
  tagName: string;
}
