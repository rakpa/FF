import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { WalletCards, Receipt, LayoutDashboard } from "lucide-react";

const menuItems = [
  { icon: WalletCards, label: "Salary", path: "/salary" },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-purple-700 p-4">
      <div className="mb-8 text-2xl font-bold text-white">
        Finance Tracker
      </div>
      <nav className="space-y-2">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <Link key={path} href={path}>
            <a
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-white/90 transition-colors hover:bg-purple-600",
                location === path && "bg-purple-800 text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}