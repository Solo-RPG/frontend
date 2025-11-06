"use client"

import { authService } from "@/lib/service/auth-service"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/ui/image-upload"
import CharacterService from "@/lib/service/characters-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CreateCharacterPage() {
  const [userInfo, setUserInfo] = useState(authService.getUserInfo())
  const [characterData, setCharacterData] = useState({
    name: "",
    photo: "",
    history: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdCharacterId, setCreatedCharacterId] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateCharacter = async () => {
    if (!userInfo?.id) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, faça login.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    if (!characterData.name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o personagem",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await CharacterService.createCharacter({
        nome_personagem: characterData.name,
        historia: characterData.history,
        imagem: characterData.photo,
      })
      
      setCreatedCharacterId(response.id)
      setShowSuccessDialog(true)
      
    } catch (error: any) {
      toast({
        title: "Erro ao criar personagem",
        description: error.message || "Ocorreu um erro ao criar o personagem.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSheet = () => {
    router.push(`/dashboard/characters/${createdCharacterId}/create-sheet`)
  }

  const handleGoToCharacters = () => {
    router.push("/dashboard/characters")
  }

  const getAvatarFallback = () => {
    if (!characterData.name) return "PJ"
    return characterData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/characters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Personagem</h1>
          <p className="text-muted-foreground">
            Crie seu personagem primeiro. Você pode adicionar uma ficha depois.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>
            Defina as informações básicas do seu personagem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            value={characterData.photo}
            onChange={(photo) => setCharacterData((prev) => ({ ...prev, photo }))}
            fallback={getAvatarFallback()}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Personagem *</Label>
              <Input
                id="name"
                value={characterData.name}
                onChange={(e) => setCharacterData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do personagem"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="history">História do Personagem</Label>
            <Textarea
              id="history"
              value={characterData.history}
              onChange={(e) => setCharacterData((prev) => ({ ...prev, history: e.target.value }))}
              placeholder="Conte a história do seu personagem..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleCreateCharacter} disabled={!characterData.name || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar Personagem"
          )}
        </Button>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Personagem criado com sucesso!</DialogTitle>
            <DialogDescription>
              O que você gostaria de fazer agora?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Button onClick={handleCreateSheet} className="w-full">
              Criar Ficha para este Personagem
            </Button>
            <Button 
              onClick={handleGoToCharacters} 
              variant="outline" 
              className="w-full"
            >
              Ver Todos os Personagens
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}