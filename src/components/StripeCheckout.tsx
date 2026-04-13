"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paymentApi } from "@/lib/api";
import { Button } from "@/components/ui";
import { Loader2, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/use-store";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51Sh4eGCM2zsGi72txKML17VT1mnuFT1XafUMhKpFAfFrK79CjC8JWFFaIFBq9cS6yDWKzyrcU6Ap7I1R5CMPFWqu00jWmmZKct");

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  address: string;
}

function CheckoutForm({ amount, onSuccess, isProcessing, setIsProcessing, address }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;
    
    if (!token) {
      toast.error("Please login to proceed with payment.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a delivery address first.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create PaymentIntent on the backend
      const { data } = await paymentApi.createPaymentIntent(amount);
      const clientSecret = data.clientSecret;

      // 2. Confirm payment on the frontend
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
      } else {
        if (result.paymentIntent.status === "succeeded") {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error("Stripe error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Payment initialization failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Card Details</label>
        <div className="px-4 py-4 rounded-xl bg-black/20 border border-white/5">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  "::placeholder": {
                    color: "#475569",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-16 rounded-[28px] bg-orange-600 hover:bg-orange-500 text-white text-base font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(234,88,12,0.6)] group relative overflow-hidden"
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <span className="flex items-center justify-center gap-4">
            Pay & Confirm <CreditCard className="w-5 h-5" />
          </span>
        )}
      </Button>
    </form>
  );
}

export default function StripeCheckout({ amount, onSuccess, address }: { amount: number; onSuccess: () => void; address: string }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={amount}
          onSuccess={onSuccess}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          address={address}
        />
      </Elements>
    </div>
  );
}
