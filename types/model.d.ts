import { UserRole } from "@prisma/client";

export interface IColor {
    id: string;
    name: string;
    hex?: string;
    variants?: IProductColorVariant[];
}

export interface IBrand {
    id: string;
    name: string;
    slug: string;
    products?: IProduct[];
}

export interface IBanner {
    id: string;
    image: string;
    alt?: string;
    displayOrder?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICountry {
    id: string;
    name: string;
    slug: string;
    products?: IProduct[];
}

export interface ICategory {
    id: string;
    name: string;
    slug: string;
    products?: IProduct[];
}

export interface IProductImage {
    id: number;
    url: string;
    alt: string;
    productId: number;
    product?: IProduct;
}

export interface IProductAttribute {
    id: number;
    key: string;
    value: string;
    productId: number;
    product?: IProduct;
}

export interface IProductColorVariant {
    id: number;
    productId: number;
    colorId: string;
    pricePerMeter: number;
    discountPercent?: number;

    product?: IProduct;
    color?: IColor;
}

export interface IProduct {
    id: number;
    name: string;
    slug: string;
    description?: string;
    categoryId?: string;
    category?: ICategory;
    countryId?: string;
    country?: ICountry;
    brandId?: string;
    brand?: IBrand;
    images: IProductImage[];
    attributes?: IProductAttribute[];
    colorVariants?: IProductColorVariant[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null | Date;
}

export type IProductWithBasePrice = IProduct & {
    basePrice: number;
    finalPrice: number;
    discountPercent: number;
}

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    address?: string;
    city?: string;
    postalCode?: string;
}

export interface IBlog {
    id: string | number;
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    estimatedTimeToRead: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    isPublished: boolean;
    createdAt: Date;
}

export interface IOrder {
    id?: number;
    userId?: number;
    user: IUser;
    items: IOrderItem[];
    status: 'PENDING' | 'PAID' | 'CANCELED';
    totalAmount: number;
    totalQuantity?: number;
    paymentRefId?: number;
    shippingAddress?: string;
    city?: string;
    postalCode?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderItem {
    id?: number;
    orderId?: number;
    order: IOrder;
    quantity?: number;
    productColorVariantId?: number;
    productColorVariant: IProductColorVariant;
}