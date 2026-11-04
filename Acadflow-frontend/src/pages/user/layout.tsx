import { Outlet } from "react-router";
import { Navbar } from "@/components/common/navbar";

export default function UserLayout() {
  return (
    <div className="min-h-svh bg-[#e7eee2] text-emerald-950">
      <Navbar />
      <Outlet />
    </div>
  );
}
