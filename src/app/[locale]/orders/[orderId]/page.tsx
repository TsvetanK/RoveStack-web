import { OrderClient } from "@/components/checkout/OrderClient";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { orderId } = await params;
  const { payment } = await searchParams;

  return <OrderClient orderId={String(orderId)} paymentStatus={payment} />;
}
