"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { CartState, OrderWithItems } from "@/types";
import { useAppSelector } from "@/lib/store";
// import axiosInstance from "@/lib/axiosInstance";
import OrderCard from "@/components/cards/OrderCard";
import OrderSubmit from "@/components/shared/OrderSubmit";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const Orders = () => {
    const [orders, setOrders] = useState<OrderWithItems[] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const cart = useAppSelector((state) => state.cart) as CartState;
    console.log(orders);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                setOrders(data.data);
            } catch (err) {
                console.log("ERROR", err);
            } finally {
                setLoading(false);
            }
        };

        if (!session?.user.id) redirect('/');

        fetchOrders();
    }, [session?.user]);

    if (loading) return (
        <div className="flex_center h-[30vh]">
            <LoadingSpinner />
        </div>
    );

    return (
        <>
            {cart.items.length > 0 && <OrderSubmit cart={cart} session={session as Session} />}

            <div className="flex items-start justify-start gap-4 flex-wrap mt-8">
                {orders.length > 0 ? (
                    orders.map((order, index) => <OrderCard key={index} order={order} />)
                ) : (
                    <>
                        {cart.items.length === 0 && (
                            <div className="flex-column items-center mx-auto">
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
