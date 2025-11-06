"use client"

import { Home, Users, FileText, Plus, LogOut, Moon, Sun } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const isMobile = useIsMobile()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }

  }, [])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

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
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 z-50 h-full w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col shadow-sm">
        {/* Logo/Header */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-orange-500">
          <FontAwesomeIcon icon={faDiceD20} className="h-7 w-7 text-white" />
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
                        ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
            <div className="mx-4 my-4 border-t border-gray-200 dark:border-gray-700" />

            {/* Nova Ficha */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 mx-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => router.push("/dashboard/characters/create")}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Nova Ficha</p>
              </TooltipContent>
            </Tooltip>

            {/* Toggle Dark Mode */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 mx-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={toggleTheme}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>{darkMode ? "Modo Claro" : "Modo Escuro"}</p>
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
                className="w-12 h-12 mx-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
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

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-2 shadow-lg">
        {menuItems.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            size="icon"
            className={`flex flex-col items-center justify-center rounded-lg transition-colors ${
              isActive(item.url)
                ? "text-purple-600 dark:text-purple-300"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => router.push(item.url)}
          >
            <item.icon className="h-5 w-5" />
          </Button>
        ))}

        {/* Nova Ficha */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-400"
          onClick={() => router.push("/dashboard/characters/create")}
        >
          <Plus className="h-5 w-5" />
        </Button>

        {/* Tema */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-400"
          onClick={toggleTheme}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </TooltipProvider>
  )
}
