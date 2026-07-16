import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Snavbar from "../Seller/Snavbar";
import Anavbar from "../Admin/Anavbar";

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function SellerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Snavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Anavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
