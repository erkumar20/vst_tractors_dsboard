import { Outlet, NavLink } from "react-router";
import { Mail, LayoutDashboard, User, Settings, LogOut, Bot, Users, Package, Layers, DollarSign, X, HardDrive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import AIAssistantFloat from "./AIAssistant";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Navbar */}
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Navigation */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 w-64 bg-[#006847] text-white flex flex-col shadow-xl z-50 
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Mobile Header in Sidebar */}
          <div className="flex lg:hidden items-center justify-between p-4 border-b border-white/10">
            <span className="font-bold text-lg">Menu</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Primary Navigation */}
            <div className="px-3 py-6 space-y-1">
              <p className="px-4 mb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">Navigation</p>
              <nav className="space-y-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-medium text-sm">Dashboard</span>
                </NavLink>

                <NavLink
                  to="/suppliers"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">Supplier Master</span>
                </NavLink>

                <NavLink
                  to="/item-master"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Package className="w-4 h-4" />
                  <span className="font-medium text-sm">Material Master</span>
                </NavLink>

                <NavLink
                  to="/bom-master"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Layers className="w-4 h-4" />
                  <span className="font-medium text-sm">BOM Master</span>
                </NavLink>

                <NavLink
                  to="/price-master"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium text-sm">Price Master</span>
                </NavLink>

                <NavLink
                  to="/ai-assistant"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Bot className="w-4 h-4" />
                  <span className="font-medium text-sm">VarnuevedAI</span>
                </NavLink>

                <NavLink
                  to="/data-storage"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <HardDrive className="w-4 h-4" />
                  <span className="font-medium text-sm">Data Storage</span>
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-t border-white/10 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-medium text-sm truncate w-full">Admin User</span>
                    <span className="text-xs text-gray-300">View Profile</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 ml-4 lg:ml-0 mb-2" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.info("Opening profile settings...")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Opening settings...")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/email" className="cursor-pointer">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Email</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Assistant - Hidden on the AI Assistant page itself */}
      {location.pathname !== "/ai-assistant" && <AIAssistantFloat />}
    </div>
  );
}