export interface IColor {
    id: string;
    name: string;
    hex?: string;
    products?: Product[];
}

export interface IBrand {
    id: string;
    name: string;
    slug: string;
    products?: Product[];
}

export interface ICountry {
    id: string;
    name: string;
    slug: string;
    products?: Product[];
}

export interface ICategory {
    id: string;
    name: string;
    slug: string;
    products?: Product[];
}

export interface IProductImage {
    id: number;
    url: string;
    alt?: string;
    productId: number;
    product?: Product;
}

export interface IProductAttribute {
    id: number;
    key: string;
    value: string;
    productId: number;
    product?: Product;
}

export interface IProduct {
    id: number;
    name: string;
    slug: string;
    description?: string;
    pricePerMeter: string;
    discountPercent?: string;
    stockMeters: string;
    countryOfOrigin?: string;
    categoryId: number;
    category?: ProductCategory;
    countryId?: number;
    country?: ProductCountry;
    brandId?: number;
    brand?: ProductBrand;
    images?: ProductImage[];
    attributes?: ProductAttribute[];
    colors?: ProductColor[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: "USER" | "ADMIN";
    // bookmarks: Schema.Types.ObjectId[];
    address?: string;
    city?: string;
    postalCode?: string;
}

export interface FileWithPreview extends File {
    preview: string;
}
