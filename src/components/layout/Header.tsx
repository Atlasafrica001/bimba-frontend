"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
// Add to existing Header component
import { MobileMenu } from "./MobileMenu";

type UserRole = "USER" | "SUPER_ADMIN" | "SUB_ADMIN" | "SUPPORT_AGENT";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  roles?: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: UserCircleIcon,
    requiresAuth: true,
  },
  {
    name: "Sell Gift Cards",
    path: "/giftcards/sell",
    icon: ArrowRightOnRectangleIcon,
    requiresAuth: true,
  },
  {
    name: "Wallet",
    path: "/wallet",
    icon: UserCircleIcon,
    requiresAuth: true,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserCircleIcon,
    requiresAuth: true,
  },
  {
    name: "Admin Dashboard",
    path: "/admin",
    icon: UserCircleIcon,
    requiresAuth: true,
    roles: ["SUPER_ADMIN", "SUB_ADMIN", "SUPPORT_AGENT"],
  },
];

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.requiresAuth && !user) return false;

    if (item.roles) {
      if (!user?.role) return false;
      return item.roles.includes(user.role);
    }

    return true;
  });

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Bimba
            </h1>
          </div>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary-gray-50 transition-colors"
              >
                <UserCircleIcon className="w-6 h-6 text-secondary-gray-600" />
                <span className="text-sm font-medium text-secondary-gray-700">
                  {user.email}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-secondary-gray-400" />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-secondary-gray-700 hover:bg-secondary-gray-50 flex items-center gap-2"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 flex items-center gap-2"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <MobileMenu items={filteredMenuItems} />
      </div>
    </header>
  );
};
