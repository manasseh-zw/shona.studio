import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Shona Studio',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground h-dvh overflow-hidden">
        <TooltipProvider>
          <SidebarProvider>
            <div className="flex h-dvh overflow-hidden">
              <AppSidebar />
              <main className="min-w-0 flex-1 overflow-hidden p-6">{children}</main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  )
}
