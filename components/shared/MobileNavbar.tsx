"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AuthForm from "../forms/auth/AuthForm";
import { mobileNavbarLinks } from "@/constants";
import { FaBars } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { Button } from "../ui/button";

const MobileNavbar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const handleAuthButton = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
      setIsSheetOpen(false);
    } else setIsAuthOpen(true);
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger aria-label="باز کردن منو موبایل">
          <FaBars className="w-7 h-7 text-black" />
        </SheetTrigger>

        <SheetContent className="bg-white" side="right">
          <SheetTitle className="hidden">منو موبایل</SheetTitle>
          <div className="flex-column gap-2">
            {mobileNavbarLinks.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="py-3 rounded-md bg-white hover:bg-light_muted px-4 transition-all ease-in font-medium"
                onClick={() => setIsSheetOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Button
              className="flex items-center justify-between border-2 border-black text-black bg-transparent hover:text-white hover:bg-black"
              type="button"
              aria-label="Authentication"
              onClick={handleAuthButton}
            >
              <span className="font-bold">
                {isAuthenticated ? `${session.user.firstName} ${session.user.lastName}` : "ورود به حساب"}
              </span>
              <IoPersonSharp className="w-6 h-6" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {!isAuthenticated && (
        <AuthForm open={isAuthOpen} onOpen={setIsAuthOpen} />
      )}
    </>
  );
};

export default MobileNavbar;
