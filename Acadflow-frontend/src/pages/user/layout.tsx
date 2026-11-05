import { Outlet } from "react-router";
import { Sidebar } from "@/components/common/sidebar";
import { Topbar } from "@/components/common/topbar";

export default function UserLayout() {
  return (
    <div className="flex min-h-svh bg-canvas text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
