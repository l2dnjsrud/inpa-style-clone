import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCategoryCounts } from "@/hooks/useCategoryCounts";
import { SearchDialog } from "@/components/SearchDialog";
import {
  Home,
  Code,
  Server,
  Database,
  Settings,
  FileText,
  ChevronDown,
  ChevronRight,
  User,
  Search,
  Crown,
  Shield
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";



const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "All Posts", url: "/posts", icon: FileText },
  { title: "Admin", url: "/admin", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["categories"]));
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCountForCategory } = useCategoryCounts();

  // Create categories with dynamic counts
  const categoriesWithCounts = [
    { 
      title: "ComfyUI", 
      url: "/category/comfyui", 
      icon: Code, 
      count: getCountForCategory('comfyui'),
      rank: 1 
    },
    { 
      title: "AI 이미지 생성", 
      url: "/category/ai-image", 
      icon: Server, 
      count: getCountForCategory('ai-image'),
      rank: 2 
    },
    { 
      title: "프롬프트 엔지니어링", 
      url: "/category/prompt-engineering", 
      icon: Settings, 
      count: getCountForCategory('prompt-engineering'),
      rank: 3 
    },
    { 
      title: "일상 & 여행", 
      url: "/category/travel-cafe", 
      icon: FileText, 
      count: getCountForCategory('travel-cafe')
    },
    { 
      title: "Python & 바이브코딩", 
      url: "/category/python-vibe", 
      icon: Database, 
      count: getCountForCategory('python-vibe')
    },
  ];

  const isActive = (path: string) => currentPath === path;
  
  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getNavClasses = (path: string) => 
    isActive(path) 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-l-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Profile Section */}
        {!collapsed && (
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-sidebar-primary">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-hero text-primary-foreground font-bold">
                  WK
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sidebar-foreground">이원경</h3>
                <p className="text-sm text-sidebar-foreground/70">Prompt Engineer & Developer</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-sidebar-border hover:bg-sidebar-accent"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-sidebar-border hover:bg-sidebar-accent"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Mini Profile for Collapsed State */}
        {collapsed && (
          <div className="p-3 border-b border-sidebar-border">
            <Avatar className="h-10 w-10 mx-auto border-2 border-sidebar-primary">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-hero text-primary-foreground font-bold text-sm">
                WK
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavClasses(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories Section */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className="flex items-center justify-between cursor-pointer hover:text-sidebar-primary"
            onClick={() => !collapsed && toggleGroup("categories")}
          >
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              {!collapsed && "인기있는 카테고리"}
            </div>
            {!collapsed && (
              expandedGroups.has("categories") ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </SidebarGroupLabel>

          {(!collapsed && expandedGroups.has("categories")) && (
            <SidebarGroupContent>
              <SidebarMenu>
                {categoriesWithCounts.map((category) => (
                  <SidebarMenuItem key={category.title}>
                    <SidebarMenuButton asChild className={getNavClasses(category.url)}>
                      <NavLink to={category.url}>
                        <div className="flex items-center gap-3 w-full">
                          <category.icon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {category.rank && category.rank <= 3 && (
                                <span className="text-xs font-bold text-primary">
                                  #{category.rank}
                                </span>
                              )}
                              <span className="truncate">{category.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {category.count} Articles
                            </span>
                          </div>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}

          {/* Collapsed Category Icons */}
          {collapsed && (
            <SidebarGroupContent>
              <SidebarMenu>
                {categoriesWithCounts.slice(0, 6).map((category) => (
                  <SidebarMenuItem key={category.title}>
                    <SidebarMenuButton asChild className={getNavClasses(category.url)}>
                      <NavLink to={category.url} title={`${category.title} (${category.count})`}>
                        <category.icon className="h-5 w-5" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
      
      {/* Search Dialog */}
      <SearchDialog 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
      />
    </Sidebar>
  );
}