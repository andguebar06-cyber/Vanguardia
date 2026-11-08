export type Category =
  | 'todos'
  | 'oversize'
  | 'mujer'
  | 'hombre'
  | 'infantil'
  | 'vestidos-faldas'
  | 'jeans-blusas'
  | 'ropa-interior'
  | 'calzado'
  | 'accesorios'
  | 'belleza-barberia'
  | 'hogar'
  | 'juguetes'
  | 'deportes'
  | 'ofertas';

export type OversizeSubtheme = 'todos' | 'anime' | 'lugares' | 'famosos';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  department?: string; // e.g., 'Cocina', 'Baño', 'Sala & Dormitorio', 'Maquillaje', 'Barbería', 'Lencería', etc.
  subtheme?: 'anime' | 'lugares' | 'famosos';
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isSale?: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string; // Unique combination of product id + size + color
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export type SortOption = 'destacados' | 'precio-bajo' | 'precio-alto' | 'mejor-calificados';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google' | 'facebook' | 'apple';
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  createdAt?: string;
}
