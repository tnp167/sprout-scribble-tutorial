"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/client-store";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import orderConfirmed from "@/public/order-confirmed.json";

export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore();
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Lottie className="max-h-80 my-2" animationData={orderConfirmed} />
      </motion.div>
      <h2 className="test-2xl font-medium">Thank you for your purchase</h2>
      <Link href={"/dashboard/orders"}>
        <Button
          variant={"secondary"}
          onClick={() => {
            setCheckoutProgress("cart-page");
            setCartOpen(false);
          }}
        >
          View your order
        </Button>
      </Link>
    </div>
  );
}
