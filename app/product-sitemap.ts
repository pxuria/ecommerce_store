import axiosInstance from "@/lib/axiosInstance";
import { MetadataRoute } from "next";

export async function GET(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data } = await axiosInstance.get(
      "https://marincollection.com/api/products"
    );
    const products = data.data;
    if (!Array.isArray(products)) {
      console.error("Invalid products format:", products);
      return [];
    }
    console.log(data);

    // Map products to sitemap format
    return products.map((product: { id: string; updatedAt: string }) => ({
      url: `https://marincollection.com/product/${product.id}`,
      lastModified: new Date(product.updatedAt).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
