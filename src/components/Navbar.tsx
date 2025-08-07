import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  SidebarTrigger, 
  useSidebar 
} from "@/components/ui/sidebar";
import { 
  Search, 
  Moon, 
  Sun, 
  ChevronDown,
  Menu,
  PenTool,
  User,
  LogOut,
  LogIn
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { title: "Develop", href: "/develop" },
  { title: "DevOps", href: "/devops" },
  { title: "DevKit", href: "/devkit" },
];

export function Navbar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [isDark, setIsDark] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-foreground hover:bg-muted" />
          
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">I</span>
            </div>
            <span className="hidden md:block">Inpa Dev</span>
            <Badge variant="outline" className="hidden md:inline-flex border-primary/50 text-primary text-xs">
              👨‍💻
            </Badge>
          </NavLink>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <DropdownMenu key={item.title}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-foreground/80 hover:text-foreground hover:bg-muted/50 font-medium"
                >
                  {item.title}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="bg-popover/95 backdrop-blur-sm border-border/50"
              >
                <DropdownMenuItem className="hover:bg-muted/50">
                  <NavLink to={item.href} className="w-full">
                    All {item.title}
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-muted/50">
                  <NavLink to={`${item.href}/recent`} className="w-full">
                    Recent Posts
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-muted/50">
                  <NavLink to={`${item.href}/popular`} className="w-full">
                    Popular
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-foreground/80 hover:text-foreground hover:bg-muted/50"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="text-foreground/80 hover:text-foreground hover:bg-muted/50"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Write Button (Only when logged in) */}
          {user && (
            <Button 
              onClick={() => navigate('/write')}
              className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <PenTool className="mr-2 h-4 w-4" />
              글쓰기
            </Button>
          )}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-foreground/80 hover:text-foreground hover:bg-muted/50 font-medium"
                >
                  <User className="mr-1 h-4 w-4" />
                  <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-popover/95 backdrop-blur-sm border-border/50 w-48"
              >
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  내 포스트 관리
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/write')}>
                  <PenTool className="mr-2 h-4 w-4" />
                  새 글 작성
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="text-foreground hover:bg-muted"
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">로그인</span>
            </Button>
          )}

          {/* Mobile Menu */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden text-foreground/80 hover:text-foreground hover:bg-muted/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}