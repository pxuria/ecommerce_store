import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-[100vw] container mx-auto">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default layout;
