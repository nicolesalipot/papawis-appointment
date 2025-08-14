import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Facilities",
    href: "/admin/facilities",
    icon: Building2,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background/80 backdrop-blur-sm border-r border-border px-6 shadow-sm">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-foreground" />
            <span className="text-xl font-bold text-foreground">Papawis</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-y-7">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.name} to={item.href}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-x-3 h-11 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-muted text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Button>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
