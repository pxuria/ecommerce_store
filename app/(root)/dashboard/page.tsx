"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

import { dashboardAdminTabs, dashboardTabs } from "@/constants";
import { handleShowToast } from "@/lib/toast";
import { UserRole } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logs from "@/components/dashboard/Logs";
import Profile from "@/components/dashboard/Profile";
import Blogs from "@/components/dashboard/blog/Blogs";
import Users from "@/components/dashboard/users/Users";
import Bookmarks from "@/components/dashboard/Bookmarks";
import Brands from "@/components/dashboard/brand/Brands";
import Colors from "@/components/dashboard/colors/Colors";
import Orders from "@/components/dashboard/orders/Orders";
import Products from "@/components/dashboard/products/Products";
import Countries from "@/components/dashboard/country/Countries";
import Categories from "@/components/dashboard/category/Categories";

const tabsTriggerClass = "w-full flex items-center justify-start gap-2 py-3 px-5 rounded-lg shadow-sm bg-light_muted group hover:bg-secondary-700 hover:text-white data-[state=active]:bg-secondary-700 data-[state=active]:text-white transition-all duration-200 ease-in-out";

const tabContents = [
  { value: 'profile', component: <Profile /> },
  { value: 'orders', component: <Orders /> },
  { value: 'bookmarks', component: <Bookmarks /> },
  { value: 'logs', component: <Logs /> },
  { value: 'products', component: <Products /> },
  { value: 'product_category', component: <Categories /> },
  { value: 'blogs', component: <Blogs /> },
  { value: 'colors', component: <Colors /> },
  { value: 'countries', component: <Countries /> },
  { value: 'brands', component: <Brands /> },
  { value: 'users-list', component: <Users /> }
];

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/")
  }, [status, router])

  useEffect(() => router.replace(`?tab=${activeTab}`, { scroll: false }), [activeTab, router]);

  return (
    <section className="px-10 mt-12">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        dir="rtl"
        className="w-full flex items-start jusrify-start flex-col md:flex-row gap-4 my-10"
      >
        <TabsList className="flex flex-row md:flex-column justify-start items-start gap-2 w-full md:w-[calc(25%-8px)] bg-white overflow-y-hidden overflow-x-auto h-fit">
          {dashboardTabs.map((item) => {
            const Icon = item.icon;
            return (
              <TabsTrigger
                key={item.dashName}
                value={item.dashName}
                className={tabsTriggerClass}
              >
                <Icon
                  size={20}
                  strokeWidth={1.75}
                  className="text-black group-hover:text-white data-[state=active]:text-white transition-colors duration-200"
                />
                {item.name}
              </TabsTrigger>
            )
          })}

          {session?.user.role === UserRole.ADMIN && (
            dashboardAdminTabs.map(item => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.dashName}
                  value={item.dashName}
                  className={tabsTriggerClass}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className="text-black group-hover:text-white data-[state=active]:text-white transition-colors duration-200"
                  // fill="currentColor"
                  />
                  {item.name}
                </TabsTrigger>
              );
            })
          )}

          <button
            className="text-sm font-medium flex_center gap-2 bg-[#EF4156] primary_transition w-full py-3 px-4 md:px-0 text-white rounded-lg text-nowrap"
            type="button"
            onClick={() => signOut({ callbackUrl: "/" }).then(() => {
              handleShowToast('خروج از حساب با موفقیت انجام شد');
            })}
          >
            خروج از حساب کاربری
            <FaSignOutAlt className="w-5 h-5" />
          </button>
        </TabsList>

        {tabContents.map(item => (
          <TabsContent key={item.value} value={item.value} className="w-full md:w-[calc(75%-8px)] !mt-0">
            {activeTab === item.value && item.component}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default Page;
