"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import AuthForm from "./../forms/auth/AuthForm";
import CartPopover from "./CartPopover";
import NavItems from "./NavItems";
import MobileNavbar from "./MobileNavbar";
import useMediaQuery from "@/utils/useMediaQuery";
import { Search, User } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const [openAuth, setOpenAuth] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isProductsPage = useMemo(() => pathname === "/products", [pathname]);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const profileHandler = () => {
    setOpenAuth(true);
  };

  return (
    <header className="mx-auto px-4 sm:px-10 lg:px-12 mt-4 flex items-center justify-between flex-nowrap mb-8">
      <Link href="/" className="w-1/3 text-2xl font-bold">
        {/* LOGO */}
        <Image
          src="/assets/images/logo.webp"
          alt="arshian baft logo"
          width={550}
          height={450}
          priority
          className="w-24 h-20"
        />
      </Link>

      {/* navigation */}
      {!isMobile ? <NavItems /> : <MobileNavbar />}

      {/* buttons */}
      {!isMobile && (
        <div className="flex flex-nowrap items-center justify-end gap-2 w-1/3">
          {isProductsPage && (
            <Button
              className="bg-light_muted px-3 py-2 rounded duration-500 h-10 w-10 hover:bg-muted flex_center btn"
              size="icon"
              type="button"
              aria-label="search"
            >
              <Search />
            </Button>
          )}

          <CartPopover />

          {!session ? (
            <Button
              className="flex_center border-2 border-black btn text-black bg-transparent hover:text-white hover:bg-black"
              type="button"
              aria-label="authentication"
              onClick={profileHandler}
            >
              <span className="font-bold">ورود به حساب</span>
              <User className="w-12 h-12" />
            </Button>
          ) : (
            <Link
              href="/dashboard"
              className="flex_center gap-1 font-bold border-2 border-black btn text-black text-sm rounded-md px-4 py-2 bg-transparent hover:text-white hover:bg-black"
            >
              {session.user.firstName} {session.user.lastName}
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      )}

      {/* authentication form */}
      {!session && <AuthForm open={openAuth} onOpen={setOpenAuth} />}
    </header>
  );
};

export default Navbar;
