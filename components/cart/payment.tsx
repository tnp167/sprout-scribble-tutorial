"use client";

import { useCartStore } from "@/lib/client-store";
import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import PaymentForm from "./payment-form";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

const stripe = getStripe();

export default function Payment() {
  const { cart } = useCartStore();
  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.variant.quantity;
  }, 0);

  return (
    <motion.div>
      <Elements
        stripe={stripe}
        options={{ mode: "payment", currency: "gbp", amount: totalPrice * 100 }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
}
