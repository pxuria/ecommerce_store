import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const notFound = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex_center flex-col gap-6 mb-10">
        <Image
          src="/assets/images/notFound9.svg"
          alt="not found"
          width={500}
          height={500}
          className="w-[480px] h-auto"
          priority
        />
        <div className="flex-column items-center gap-4">
          <p className="text-3xl text-black font-medium">
            صفحه مورد نظر یافت نشد.
          </p>
          <Link
            className="btn text-base font-medium bg-pink px-4 py-2 rounded-md text-white hover:scale-105"
            href="/"
          >
            صفحه اصلی
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default notFound;
