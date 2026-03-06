import { NavLink } from "react-router";
import { Bell, Mail, Search, User, Settings, LogOut, Menu } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { notificationData } from "../data/mockData";
import { useCategory } from "../context/CategoryContext";
import { useAuth } from "../context/AuthContext";
import vstLogo from "figma:asset/84550712db20093bb22b1a7d935d642e734b68db.png";

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const unreadNotifications = notificationData.filter(n => !n.read).length;
    const [searchQuery, setSearchQuery] = useState("");
    const { logout } = useAuth();
    const { selectedCategory, setSelectedCategory } = useCategory();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            toast.success(`Searching for: ${searchQuery}`);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 h-[72px] shrink-0 flex items-center sticky top-0 z-50">
            {/* Logo Section */}
            <div className="w-auto lg:w-64 h-full flex items-center px-4 lg:px-8 bg-white shrink-0 gap-2 lg:gap-0">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <img
                    src={vstLogo}
                    alt="VST Tractors"
                    className="h-10 lg:h-12 w-auto object-contain hidden lg:block"
                />
                {/* Mobile/Tablet Logo */}
                <img
                    src={vstLogo}
                    alt="VST Tractors"
                    className="h-7 w-auto object-contain lg:hidden"
                />
            </div>

            <div className="flex-1 flex items-center justify-between px-4 lg:px-8 gap-4">
                {/* Category Dropdown and Search Bar */}
                <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 max-w-4xl">
                    {/* Category Dropdown - Rounded Look */}
                    <Select
                        value={selectedCategory}
                        onValueChange={(value: string) => {
                            setSelectedCategory(value);
                            toast.success(`Switched to ${value.replace('-', ' ').toUpperCase()}`);
                        }}
                    >
                        <SelectTrigger className="w-[160px] lg:w-[260px] h-11 border border-[#006847]/30 bg-[#F3F4F6] hover:bg-gray-200 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors font-semibold text-gray-700 rounded-lg px-3 lg:px-4">
                            <SelectValue>
                                {(() => {
                                    switch (selectedCategory) {
                                        case 'axel-gear': return "Category - AXEL GEAR CT85";
                                        case 'fly-wheel': return "Category - FLY WHEEL";
                                        case 'final-drive': return "Category - Final Drive Gear";
                                        case 'gear-case': return "Category - GEAR CASE";
                                        case 'shaft-final': return "Category - Shaft Final";
                                        default: return "Select Category";
                                    }
                                })()}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="axel-gear">AXEL GEAR CT85</SelectItem>
                            <SelectItem value="fly-wheel">FLY WHEEL</SelectItem>
                            <SelectItem value="final-drive">Final Drive Gear</SelectItem>
                            <SelectItem value="gear-case">GEAR CASE</SelectItem>
                            <SelectItem value="shaft-final">Shaft Final</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Search Bar - Rounded Look */}
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search dashboard..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 h-11 w-full border border-[#006847]/30 bg-[#F3F4F6] focus:bg-white focus:ring-0 focus:border-[#006847]/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-all rounded-lg placeholder:text-gray-400"
                        />
                    </form>
                </div>

                {/* Mobile Search Icon (Only on mobile) */}
                <div className="md:hidden flex-1 flex justify-end">
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Right Section Icons */}
                <div className="flex items-center gap-2 lg:gap-6">
                    {/* Notification Icon */}
                    <NavLink to="/notification">
                        <button className="p-2 lg:p-2.5 rounded-full hover:bg-gray-50 transition-colors relative group">
                            <Bell className="w-5 lg:w-6 h-5 lg:h-6 text-gray-500 group-hover:text-gray-700" />
                            {unreadNotifications > 0 && (
                                <Badge className="absolute top-1 lg:top-1.5 right-1 lg:right-1.5 bg-[#f59e0b] text-white border-2 border-white h-4 lg:h-5 w-4 lg:w-5 flex items-center justify-center p-0 text-[8px] lg:text-[10px] font-bold rounded-full shadow-sm">
                                    {unreadNotifications}
                                </Badge>
                            )}
                        </button>
                    </NavLink>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 lg:p-2.5 rounded-full hover:bg-gray-50 transition-colors group">
                                <User className="w-5 lg:w-6 h-5 lg:h-6 text-gray-500 group-hover:text-gray-700" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mt-2" align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.info("Opening profile settings...")} className="cursor-pointer py-2.5">
                                <User className="mr-3 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Opening settings...")} className="cursor-pointer py-2.5">
                                <Settings className="mr-3 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="py-2.5">
                                <NavLink to="/email" className="cursor-pointer flex items-center">
                                    <Mail className="mr-3 h-4 w-4" />
                                    <span>Email</span>
                                </NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2.5 text-red-600 focus:text-red-600">
                                <LogOut className="mr-3 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
