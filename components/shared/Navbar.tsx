"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoPersonSharp } from "react-icons/io5";
import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { Button } from "../ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import AuthForm from "./../forms/auth/AuthForm";
import { useAppSelector } from "@/lib/store";
import { PopoverTrigger } from "@radix-ui/react-popover";
import CartPopover from "./CartPopover";
import NavItems from "./NavItems";
import MobileNavbar from "./MobileNavbar";
import useMediaQuery from "@/utils/useMediaQuery";

const Navbar = () => {
  const [openAuth, setOpenAuth] = useState(false);
  const [cartTrigger, setCartTrigger] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const cart = useAppSelector((state) => state.cart);

  const isProductsPage = useMemo(() => pathname === "/products", [pathname]);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const profileHandler = () => {
    setOpenAuth(true);
  };

  return (
    <header className="mx-auto px-4 sm:px-10 lg:px-12 mt-4 flex items-center justify-between flex-nowrap mb-8">
      <Link href="/" className="w-1/3 text-3xl font-bold">
        {/* LOGO */}
        <h2 className="">LOGO</h2>
        {/* <Image
          src="/assets/images/outlined_logo.png"
          alt="marin"
          width={435}
          priority
          height={142}
          className="w-24 h-8"
        /> */}
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
              <FiSearch />
            </Button>
          )}

          <Popover onOpenChange={setCartTrigger} open={cartTrigger}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer">
                <span className="absolute -top-2 -right-2 w-5 h-5 flex_center rounded-full z-10 bg-purple_700 text-xs text-white">
                  {cart.totalQuantity > 99 ? "😊" : cart.totalQuantity}
                </span>
                <Button
                  className="bg-yellow_600 text-black hover:bg-yellow_700 px-3 py-2 rounded duration-500 h-10 w-10 flex_center btn"
                  size="icon"
                  type="button"
                  aria-label="shopping_bag"
                  onClick={() => setCartTrigger(true)}
                >
                  <FiShoppingBag className="w-12 h-12" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="bg-[#fff] mt-1 p-2 rounded-xl outline-none border-light_muted">
              <CartPopover />
            </PopoverContent>
          </Popover>

          {!session ? (
            <Button
              className="flex_center border-2 border-black btn text-black bg-transparent hover:text-white hover:bg-black"
              type="button"
              aria-label="authentication"
              onClick={profileHandler}
            >
              <span className="font-bold">ورود به حساب</span>
              <IoPersonSharp className="w-12 h-12" />
            </Button>
          ) : (
            <Link
              href="dashboard"
              className="flex_center gap-1 font-bold border-2 border-black btn text-black text-sm rounded-md px-4 py-2 bg-transparent hover:text-white hover:bg-black"
            >
              {session.user?.name}
              <IoPersonSharp className="w-5 h-5" />
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
