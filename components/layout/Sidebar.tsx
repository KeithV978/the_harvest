// components/layout/Sidebar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  LogOut,
  ChevronRight,
  Menu,
  X,
  CircleX,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const evangelistNav: NavItem[] = [
  { href: "/dashboard/evangelist", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/evangelist/leads", label: "My Leads", icon: FileText },
];

const followupNav: NavItem[] = [
  { href: "/dashboard/followup", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/dashboard/followup/leads",
    label: "Assigned Leads",
    icon: FileText,
  },
];

const adminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/leads", label: "All Leads", icon: FileText },
  { href: "/dashboard/admin/evangelists", label: "Evangelists", icon: Users },
  {
    href: "/dashboard/admin/followups",
    label: "Follow-Up Team",
    icon: UserCheck,
  },
];

const ROLE_NAV: Record<string, NavItem[]> = {
  ADMIN: adminNav,
  EVANGELIST: evangelistNav,
  FOLLOWUP: followupNav,
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  EVANGELIST: "bg-harvest-100 text-harvest-700",
  FOLLOWUP: "bg-blue-100 text-blue-700",
};

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role ?? "EVANGELIST";
  const navItems = ROLE_NAV[role] ?? evangelistNav;

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  const sidebarContent = ( 
      <div className="flex justify-between h-full flex-col items-center border-b border-harvest-100">
        <div className="w-full">
          <div className="flex justify-between items-center">
            {/* Close Btn */}
            <div className="p-4 md:hidden">
              <button onClick={() => handleNavClick()} className="bg-harvest-400 hover:bg-harvest-500 text-white p-2 rounded-xl">
                <CircleX className="" />
              </button>
            </div>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-harvest-100">
              <img
                src="/applogo.jpg"
                alt="The Harvest Logo"
                className="w-auto h-20"
              />
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-earth-900 text-lg leading-tight">
                  The Harvest
                </h1>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard/admin" &&
                  item.href !== "/dashboard/evangelist" &&
                  item.href !== "/dashboard/followup" &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "sidebar-link",
                    active ? "sidebar-link-active" : "sidebar-link-inactive",
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="sm:text-left sm:inline">{item.label}</span>
                  {active && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70 hidden sm:block" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User */}
        <div className="p-4 border-t border-harvest-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-harvest-50 group">
            <div className="w-8 h-8 rounded-full bg-harvest-200 flex items-center justify-center text-harvest-700 font-bold text-sm flex-shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0 sm:block">
              <p className="text-sm font-semibold text-earth-900 truncate">
                {session?.user?.name}
              </p>
              <span
                className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded-md",
                  ROLE_COLORS[role],
                )}
              >
                {role.charAt(0) + role.slice(1).toLowerCase().replace("_", "-")}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="p-1.5 rounded-lg text-earth-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div> 
  );

  return (
    <>
      {/* Mobile Menu Button */} 
        <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-harvest-400 rounded-xl hover:bg-harvest-50 text-earth-700"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button> 

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-harvest-100 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-harvest-100 flex flex-col transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-screen">{sidebarContent}</div>
      </aside>
    </>
  );
}
