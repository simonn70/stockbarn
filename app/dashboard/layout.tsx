"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  UserIcon,
  Megaphone,
  Lightbulb,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jwtDecode } from "jwt-decode";

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const router = useRouter();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
console.log(isSessionExpired);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeout =
          decodedToken.exp - currentTime > 0
            ? (decodedToken.exp - currentTime) * 1000
            : 0;
        const timer = setTimeout(() => setIsSessionExpired(true), timeout);
        return () => clearTimeout(timer);
      } catch {
        localStorage.removeItem("token");
        setIsSessionExpired(true);
      }
    } else {
      setIsSessionExpired(true);
    }
  }, []);

  // const handleSessionExpiredLogout = () => {
  //   setIsSessionExpired(false);
  //   router.push("/");
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const navigation = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Products", path: "/dashboard/products", icon: UserIcon },
    // { name: "Add Products", path: "/dashboard/products/create", icon: UserIcon },
    { name: "Orders", path: "/dashboard/orders", icon: Megaphone },
    { name: "customers", path: "/dashboard/customers", icon: Lightbulb },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-blue-600">
      <div className="flex items-center justify-between p-4 border-b border-blue-500">
        <h1 className="text-2xl font-bold text-white">StockBarns</h1>
      </div>
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link key={item.name} href={item.path} passHref>
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition duration-150 ease-in-out  `}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </div>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-blue-500">
        <Button
          variant="outline"
          className="w-full justify-start text-blue-100 hover:text-blue-600 hover:bg-white"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-blue-600 shadow-lg">
          <SidebarContent />
        </aside>

        {/* Sidebar for mobile screens */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden absolute top-4 left-4 z-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-12 py-3">
              <h2 className="text-lg font-semibold text-blue-600">
                Dashboard
              </h2>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white rounded-lg shadow-lg p-6">{children}</div>
            </div>
          </main>
        </div>
      </div>

      {/* Session Expired Modal */}
     
    </>
  );
};

export default Dashboard;
