-- AlterTable
ALTER TABLE "public"."orders" ALTER COLUMN "paymentRefId" DROP NOT NULL,
ALTER COLUMN "paymentRefId" SET DATA TYPE TEXT;
