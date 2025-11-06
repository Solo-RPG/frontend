"use client"

import { Plus, Users, FileText } from "lucide-react";
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function QuickActionsCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="">Ações Rápidas</CardTitle>
        <CardDescription className="">
          Acesse rapidamente as funcionalidades principais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <QuickActionButton 
          href="/dashboard/characters/create"
          icon={<Plus className="mr-2 h-4 w-4" />}
          text="Criar Nova Ficha"
          variant="default"
        />
        <QuickActionButton 
          href="/dashboard/characters"
          icon={<Users className="mr-2 h-4 w-4" />}
          text="Ver Todos os Personagens"
          variant="outline"
        />
        <QuickActionButton 
          href="/dashboard/templates"
          icon={<FileText className="mr-2 h-4 w-4" />}
          text="Gerenciar Templates"
          variant="outline"
        />
      </CardContent>
    </Card>
  )
}

function QuickActionButton({ href, icon, text, variant = 'default' }: {
  href: string
  icon: React.ReactNode
  text: string
  variant?: 'default' | 'outline'
}) {
  return (
    <Button
      asChild
      variant={variant}
      className={`w-full justify-start ${variant === 'outline' ? 'border-gray-200 hover:bg-gray-50 bg-transparent' : ''}`}
    >
      <Link href={href} className={`${variant === 'outline' ? 'dark:hover:text-black' : ''}`}>
        {icon}
        {text}
      </Link>
    </Button>
  )
}