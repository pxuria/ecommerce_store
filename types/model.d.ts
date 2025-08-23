export interface IColor {
    id: string;
    name: string;
    hex?: string;
}

export interface IBrand {
    id: string;
    name: string;
    slug: string;
}

export interface ICountry {
    id: string;
    name: string;
    slug: string;
}

export interface ICategory {
    id: string;
    name: string;
    slug: string;
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: "USER" | "ADMIN";
    bookmarks: Schema.Types.ObjectId[];
    address?: string;
    city?: string;
    postalCode?: string;
}