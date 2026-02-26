"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  IconDatabase,
  IconMessageChatbot,
  IconMicrophone,
  IconLogout,
  IconSpeakerphone,
} from "@tabler/icons-react";
import type React from "react";
import { SidebarLogo } from "@/components/layout/sidebar-logo";
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "datasets",
    label: "Datasets",
    icon: IconDatabase,
    route: "/dataset",
  },
  {
    id: "speech-to-text",
    label: "Speech To Text",
    icon: IconMicrophone,
    route: "/speech-to-text",
  },
  {
    id: "text-to-speech",
    label: "Text To Speech",
    icon: IconSpeakerphone,
    route: "/text-to-speech",
  },
  {
    id: "conversation",
    label: "Conversation",
    icon: IconMessageChatbot,
    route: "/conversation",
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <Sidebar side="left" variant="sidebar" collapsible="none" className="border-r">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={pathname === item.route}
                      className="h-10 w-full px-3"
                      onClick={() => navigate({ to: item.route })}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-12 w-full px-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src="/avatar-01.png" alt="ephraim" />
                  <AvatarFallback className="rounded-full">E</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-sm font-medium">ephraim</div>
                  <div className="truncate text-xs text-muted-foreground">
                    ephraim@blocks.so
                  </div>
                </div>
              </div>
              <IconLogout className="h-4 w-4 shrink-0" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}