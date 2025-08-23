"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

import Orders from "@/components/dashboard/Orders";
import Profile from "@/components/dashboard/Profile";
import Bookmarks from "@/components/dashboard/Bookmarks";
import AddProduct from "@/components/dashboard/AddProduct";
import AddCategory from "@/components/dashboard/AddCategory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardAdminTabs, dashboardTabs } from "@/constants";
import Colors from "@/components/dashboard/colors/Colors";
import Brands from "@/components/dashboard/brand/Brands";
import Countries from "@/components/dashboard/country/Countries";
import { toast } from "react-toastify";

const tabsTriggerClass = "w-full flex items-center justify-start gap-2 py-3 px-5 hover:bg-muted data-[state=active]:bg-pink_500 data-[state=active]:text-white rounded-lg shadow-sm bg-light_muted";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/")
    }
  }, [status, router])

  useEffect(
    () => router.replace(`?tab=${activeTab}`, { scroll: false }),
    [activeTab, router]
  );

  console.log(session)
  return (
    <section className="px-10 mt-12">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        dir="rtl"
        className="w-full flex items-start jusrify-start flex-col md:flex-row gap-8 my-10"
      >
        <TabsList className="flex flex-row md:flex-column justify-start items-start gap-2 w-full md:w-1/4 bg-white overflow-y-hidden overflow-x-auto h-fit">
          {dashboardTabs.map((item) => (
            <TabsTrigger
              key={item.dashName}
              value={item.dashName}
              className={tabsTriggerClass}
            >
              {item.icon}
              {item.name}
            </TabsTrigger>
          ))}

          {session?.user.role === "ADMIN" && (
            dashboardAdminTabs.map(item => (
              <TabsTrigger
                key={item.dashName}
                value={item.dashName}
                className={tabsTriggerClass}
              >
                {item.icon}
                {item.name}
              </TabsTrigger>
            ))
          )}

          <button
            className="text-sm font-medium flex_center gap-2 bg-[#EF4156] primary_transition w-full py-3 px-4 md:px-0 text-white rounded-lg text-nowrap"
            type="button"
            onClick={() => signOut({ callbackUrl: "/" }).then(() => {
              toast.success("خروج از حساب با موفقیت انجام شد.")
            })}
          >
            خروج از حساب کاربری
            <FaSignOutAlt className="w-5 h-5" />
          </button>
        </TabsList>

        <TabsContent value="profile" className="w-full md:w-3/4 !mt-0">
          <Profile />
        </TabsContent>
        <TabsContent value="orders" className="w-full md:w-3/4 !mt-0">
          <Orders />
        </TabsContent>
        <TabsContent value="bookmarks" className="w-full md:w-3/4 !mt-0">
          <Bookmarks />
        </TabsContent>
        <TabsContent value="add_product" className="w-full md:w-3/4 !mt-0">
          <AddProduct />
        </TabsContent>
        <TabsContent value="product_category" className="w-full md:w-3/4 !mt-0">
          <AddCategory />
        </TabsContent>
        <TabsContent value="colors" className="w-full md:w-3/4 !mt-0">
          <Colors />
        </TabsContent>
        <TabsContent value="countries" className="w-full md:w-3/4 !mt-0">
          <Countries />
        </TabsContent>
        <TabsContent value="brands" className="w-full md:w-3/4 !mt-0">
          <Brands />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Page;
