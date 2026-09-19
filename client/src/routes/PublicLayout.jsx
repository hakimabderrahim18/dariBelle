import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { CartDrawer } from "../components/layout/CartDrawer";
import { MobileNav } from "../components/layout/MobileNav";
import { QuickOrderModal } from "../components/layout/QuickOrderModal";

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <QuickOrderModal />
    </div>
  );
};
