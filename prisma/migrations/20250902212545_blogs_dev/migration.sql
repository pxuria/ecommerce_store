/*
  Warnings:

  - You are about to drop the column `countryOfOrigin` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountPercent` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerMeter` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stockMeters` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_ProductToProductColor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ProductToProductColor" DROP CONSTRAINT "_ProductToProductColor_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProductToProductColor" DROP CONSTRAINT "_ProductToProductColor_B_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "countryOfOrigin",
DROP COLUMN "discountPercent",
DROP COLUMN "pricePerMeter",
DROP COLUMN "stockMeters",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."_ProductToProductColor";

-- CreateTable
CREATE TABLE "public"."ProductColorVariant" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "pricePerMeter" DECIMAL(12,2) NOT NULL,
    "discountPercent" DECIMAL(5,2),
    "stockMeters" DECIMAL(12,3) NOT NULL DEFAULT 0,

    CONSTRAINT "ProductColorVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductColorVariant_productId_idx" ON "public"."ProductColorVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductColorVariant_colorId_idx" ON "public"."ProductColorVariant"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductColorVariant_productId_colorId_key" ON "public"."ProductColorVariant"("productId", "colorId");

-- CreateIndex
CREATE INDEX "Product_countryId_idx" ON "public"."Product"("countryId");

-- CreateIndex
CREATE INDEX "Product_deleted_at_idx" ON "public"."Product"("deleted_at");

-- AddForeignKey
ALTER TABLE "public"."ProductColorVariant" ADD CONSTRAINT "ProductColorVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductColorVariant" ADD CONSTRAINT "ProductColorVariant_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."ProductColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
