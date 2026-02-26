import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import LogoIcon from '@/components/logo'

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-transparent cursor-default "
        >
          <LogoIcon className="size-8 scale-[2]" />

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Shona Studio</span>
            <span className="truncate text-xs text-muted-foreground">
              Shona S2S
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
