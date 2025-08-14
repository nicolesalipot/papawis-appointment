import { Menu, LogOut, User, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";

export function TopBar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Get page title and subtitle based on current route
  const getPageInfo = () => {
    const path = location.pathname;
    switch (true) {
      case path.includes("/dashboard"):
        return {
          title: "Dashboard",
          subtitle: "Overview of your facility management system",
        };
      case path.includes("/facilities"):
        return {
          title: "Facilities",
          subtitle: "Manage your sports facilities and amenities",
        };
      case path.includes("/bookings"):
        return {
          title: "Booking Management",
          subtitle:
            "Manage facility bookings, schedules, and customer reservations.",
        };
      case path.includes("/users"):
        return {
          title: "User Management",
          subtitle: "Manage user accounts, roles, and permissions",
        };
      case path.includes("/reports"):
        return {
          title: "Reports & Analytics",
          subtitle: "View insights and performance analytics",
        };
      case path.includes("/settings"):
        return {
          title: "Settings",
          subtitle: "Configure system preferences and settings",
        };
      default:
        return { title: "Papawis", subtitle: "Management System" };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          type="button"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>

        {/* Left side - Brand for mobile */}
        <div className="flex items-center lg:hidden">
          <Calendar className="h-6 w-6 text-foreground" />
          <span className="ml-2 text-lg font-semibold text-foreground">
            Papawis
          </span>
        </div>

        {/* Page title for larger screens */}
        <div className="hidden lg:flex lg:items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          {/* User info */}
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <p className="text-sm font-medium text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role?.replace("_", " ")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Avatar */}
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            {/* Logout button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
