"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import {
  CurrencyDollarIcon,
  GiftIcon,
  ShieldCheckIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <GiftIcon className="w-12 h-12 text-primary" />,
      title: "Sell Gift Cards",
      description:
        "Convert your unused gift cards to cash instantly with competitive rates.",
    },
    {
      icon: <CurrencyDollarIcon className="w-12 h-12 text-primary" />,
      title: "Fast Withdrawals",
      description:
        "Withdraw your funds to your Nigerian bank account quickly and securely.",
    },
    {
      icon: <ChartBarIcon className="w-12 h-12 text-primary" />,
      title: "Referral Rewards",
      description:
        "Earn ₦5,000 for every friend who trades $300 worth of gift cards.",
    },
    {
      icon: <ShieldCheckIcon className="w-12 h-12 text-primary" />,
      title: "Secure & Safe",
      description:
        "Your funds and data are protected with bank-level security.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Bimba</h1>
            <div className="space-x-4 flex">
              <Button variant="secondary" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button variant="primary" onClick={() => router.push("/signup")}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative ">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] bg-primary/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-[10rem] right-[-10rem] w-[25rem] h-[25rem] bg-purple-400/20 rounded-full blur-3xl animate-floatSlow" />
          <div className="absolute bottom-[-8rem] left-[20%] w-[20rem] h-[20rem] bg-primary/20 rounded-full blur-3xl animate-float" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-secondary-gray-900 mb-6 leading-tight">
              Convert Gift Cards to Cash
              <span className="block text-primary">Instantly</span>
            </h1>

            <p className="text-xl text-secondary-gray-600 mb-10 max-w-2xl mx-auto">
              Bimba makes it easy to sell your gift cards and get paid in
              Nigerian Naira. Fast, secure, and reliable.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/signup")}
              >
                Get Started Free
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-secondary-gray-500">
          Why Choose Bimba?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2 text-secondary-black">
                {feature.title}
              </h3>
              <p className="text-secondary-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary-gray-500">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                desc: "Sign up for free in under 2 minutes.",
              },
              {
                step: "2",
                title: "Upload Gift Card",
                desc: "Select your card type and upload photos.",
              },
              {
                step: "3",
                title: "Get Paid",
                desc: "Funds credited after approval. Withdraw anytime.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg animate-[pulse_6s_ease-in-out_infinite]">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-secondary-black">
                  {item.title}
                </h3>
                <p className="text-secondary-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-gradient-to-r from-primary to-primary-700 rounded-3xl p-14 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent)]" />

          <h2 className="text-4xl font-extrabold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Nigerians already using Bimba.
          </p>
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="mx-auto"
              onClick={() => router.push("/signup")}
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Bimba. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
