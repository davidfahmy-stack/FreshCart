export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
}

export interface DecodedToken {
  id?: string;
  userId?: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
  name?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: Category;
  subcategories?: SubCategory[];
  brand?: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
  sold?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  totalPriceAfterDiscount?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CartResponse {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId?: string;
  data: CartData;
}

export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
  message?: string;
}

export interface WishlistActionResponse {
  status: string;
  message: string;
  data: string[];
}

export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressesResponse {
  status: string;
  message?: string;
  results?: number;
  data: Address[];
}

export interface ShippingAddressInput {
  details: string;
  phone: string;
  city: string;
}

export interface OrderItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Order {
  _id: string;
  id?: number | string;
  user: User | string;
  cartItems: OrderItem[];
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  shippingAddress?: ShippingAddressInput;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface PaginatedResponse<T> {
  results: number;
  metadata: PaginationMetadata;
  data: T[];
}

export interface SingleResponse<T> {
  data: T;
  message?: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: User;
  token: string;
}

export interface VerifyTokenResponse {
  message: string;
  decoded: DecodedToken;
}

export interface CheckoutSessionResponse {
  status: string;
  session: {
    url: string;
    id: string;
    success_url?: string;
    cancel_url?: string;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  'price[gte]'?: number;
  'price[lte]'?: number;
  'category[in]'?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  keyword?: string;
}
