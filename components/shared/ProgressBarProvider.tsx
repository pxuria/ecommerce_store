"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { childrenProp } from "@/types";

const ProgressBarProvider = ({ children }: childrenProp) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#9EA3FA"
        options={{ showSpinner: false }}
        shallowRouting={true}
      />
    </>
  );
};

export default ProgressBarProvider;
