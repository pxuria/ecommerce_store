"use client";

import { Dispatch, SetStateAction, useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Login from "./Login";
import Signup from "./Signup";
import { FcGoogle } from "react-icons/fc";

interface Props {
  open: boolean;
  onOpen: Dispatch<SetStateAction<boolean>>;
}

const AuthForm = ({ onOpen, open }: Props) => {
  const [form, setForm] = useState<"login" | "signup">("login");

  const handleTabChange = useCallback((tab: "login" | "signup") => {
    setForm(tab);
  }, []);

  return (
    <Dialog onOpenChange={onOpen} open={open}>
      <DialogContent className="bg-white min-h-[450px] overflow-hidden !rounded-2xl auth_dialog w-[90%] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-nowrap w-fit text-[32px] font-bold mx-auto mb-4">
            Marin
          </DialogTitle>

          {/* Login/Signup Tabs */}
          <div className="flex items-center gap-4 justify-around mb-4">
            {["login", "signup"].map((tab) => (
              <button
                key={tab}
                className={`cursor-pointer font-semibold text-lg w-full text-center rounded-lg py-2 transition-all text-black bg-white duration-200 ${
                  form === tab && "!bg-yellow"
                } shadow-lg`}
                onClick={() => handleTabChange(tab as "login" | "signup")}
              >
                {tab === "login" ? "ورود" : "ثبت نام"}
              </button>
            ))}
          </div>
        </DialogHeader>

        {form === "login" ? (
          <Login setOpen={onOpen} />
        ) : (
          <Signup setOpen={onOpen} />
        )}

        <DialogFooter className="!flex-col !gap-4">
          <div className="flex_center gap-4 w-full mt-5">
            <Button className="btn submit_btn w-1/2" type="submit" form={form}>
              {form === "login" ? "ورود" : "ثبت نام"}
            </Button>

            <Button
              className="btn close_btn w-1/2"
              type="button"
              onClick={() => onOpen(false)}
            >
              انصراف
            </Button>
          </div>

          <button
            className="cursor-pointer text-black flex! gap-3 items-center bg-white px-4 py-2 rounded-lg font-medium text-base hover:bg-zinc-300 btn duration-200 border border-black hidden"
            type="button"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="w-5 h-5" />
            ورود به حساب کاربری با گوگل
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthForm;
