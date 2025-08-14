import { Menu, LogOut, User, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function TopBar() {
  const { user, logout } = useAuthStore();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button type="button" className="p-2.5 text-slate-700 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Left side - Brand for mobile */}
        <div className="flex items-center lg:hidden">
          <Calendar className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-lg font-semibold text-slate-900">
            SportsFacility
          </span>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
          {/* User menu */}
          <div className="flex items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm font-medium text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {user?.role?.replace("_", " ")}
              </p>
            </div>

            <div className="flex items-center gap-x-2">
              {/* Avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <User className="h-4 w-4" />
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-600 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
