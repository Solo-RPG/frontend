"use client"

import { Home, Users, FileText, Plus, LogOut, Dice6 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Meus Personagens",
    url: "/dashboard/characters",
    icon: Users,
  },
  {
    title: "Templates",
    url: "/dashboard/templates",
    icon: FileText,
  },
]

export function MinimalSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
    router.push("/")
  }

  const isActive = (url: string) => pathname === url

  return (
    <TooltipProvider delayDuration={0}>
      <div className="fixed left-0 top-0 z-50 h-full w-16 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo/Header */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-purple-600">
          <Dice6 className="h-8 w-8 text-white" />
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`w-12 h-12 mx-2 rounded-lg transition-colors ${
                      isActive(item.url)
                        ? "bg-purple-100 text-purple-600 hover:bg-purple-100"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => router.push(item.url)}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Separador */}
            <div className="mx-4 my-4 border-t border-gray-200" />

            {/* Nova Ficha */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 mx-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  onClick={() => router.push("/dashboard/characters/create")}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Nova Ficha</p>
              </TooltipContent>
            </Tooltip>
          </nav>
        </div>

        {/* Logout */}
        <div className="pb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 mx-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>Sair</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
