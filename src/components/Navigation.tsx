import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Users, Calendar, Home, LogOut, User as UserIcon, Settings } from "lucide-react";
import type { User } from '@supabase/supabase-js';

interface NavigationProps {
  user: User;
}

const Navigation = ({ user }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(3); // Mock data

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navigationItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/groups", icon: Users, label: "Study Groups" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <h1 
            className="text-xl font-inter font-bold text-primary cursor-pointer hover:text-primary/80 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Study Mates
          </h1>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        {/* Right Side - Notifications & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center p-0">
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
                  <AvatarFallback>{user.user_metadata?.full_name?.[0] || user.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t px-6 py-2">
        <nav className="flex justify-around">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center space-y-1 h-auto py-2"
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;