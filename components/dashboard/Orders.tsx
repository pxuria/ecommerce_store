"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CartState, IOrder } from "@/types";
import axiosInstance from "@/lib/axiosInstance";
import OrderCard from "../cards/OrderCard";
import OrderSubmit from "./../shared/OrderSubmit";
import { useAppSelector } from "@/lib/store";
import { Session } from "next-auth";

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const cart = useAppSelector((state) => state.cart) as CartState;
  console.log(orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, status } = await axiosInstance.get(
          `orders/user/${session?.user.id}`,
          {
            validateStatus: (status) => {
              return (status >= 200 && status < 300) || status === 404;
            },
          }
        );
        console.log(data, status);

        if (status === 404) setOrders([]);
        else setOrders(data);
      } catch (err) {
        console.log("ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.id) fetchOrders();
  }, [session?.user]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {cart.items.length > 0 && (
        <OrderSubmit cart={cart} session={session as Session} />
      )}

      <div className="flex items-start justify-start gap-4 flex-wrap mt-8">
        {orders.length > 0 ? (
          orders.map((order, index) => <OrderCard key={index} order={order} />)
        ) : (
          <>
            {cart.items.length === 0 && (
              <div className="flex-column items-center">
                <Image
                  src="/assets/images/no_orders.svg"
                  alt="no orders"
                  width={360}
                  height={300}
                  className=""
                />
                <h2 className="font-semibold text-2xl text-black flex_center">
                  سفارشی وجود ندارد.✨🛍️
                </h2>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Orders;
