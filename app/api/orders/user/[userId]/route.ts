import { asyncHandler, HttpError } from "@/utils/helpers";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export const GET = async () => asyncHandler(async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) throw new HttpError('Invalid User ID', 400);

  // const orders = await Order.find({ userId });

  // if (!orders.length) {
  //   return NextResponse.json(
  //     { message: "No orders found for this user" },
  //     { status: 404 }
  //   );
  // }

  return { data: '' };
});