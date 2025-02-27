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
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar p-4 text-sidebar-foreground">
      <div className="mb-8 text-2xl font-bold text-sidebar-primary">
        Finance Tracker
      </div>
      <nav className="space-y-2">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <Link key={path} href={path}>
            <a
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                location === path && "bg-sidebar-accent text-sidebar-accent-foreground"
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
