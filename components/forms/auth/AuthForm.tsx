"use client";

import { Dispatch, SetStateAction, useState } from "react";
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

interface Props {
  open: boolean;
  onOpen: Dispatch<SetStateAction<boolean>>;
}

const AuthForm = ({ onOpen, open }: Props) => {
  const [form, setForm] = useState<"login" | "signup">("login");

  return (
    <Dialog onOpenChange={onOpen} open={open}>
      <DialogContent className="bg-white min-h-[450px] overflow-hidden !rounded-2xl auth_dialog w-[90%] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-nowrap w-fit text-[32px] font-bold mx-auto mb-4">
            Arshian Baft
          </DialogTitle>
        </DialogHeader>

        {form === "login" ? (
          <Login setOpen={onOpen} setForm={setForm} />
        ) : (
          <Signup setOpen={onOpen} setForm={setForm} />
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
            {/* <FcGoogle className="w-5 h-5" /> */}
            ورود به حساب کاربری با گوگل
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthForm;
