"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  fallback?: string
  className?: string
}

export function ImageUpload({ value, onChange, fallback = "PJ", className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, WebP).",
        variant: "destructive",
      })
      return
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Converter para base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setIsUploading(false)

        toast({
          title: "Imagem carregada",
          description: "A foto do personagem foi atualizada com sucesso.",
        })
      }

      reader.onerror = () => {
        toast({
          title: "Erro ao carregar imagem",
          description: "Não foi possível processar a imagem. Tente novamente.",
          variant: "destructive",
        })
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Erro ao processar imagem",
        description: "Ocorreu um erro ao processar a imagem.",
        variant: "destructive",
      })
      setIsUploading(false)
    }

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = () => {
    onChange("")
    toast({
      title: "Imagem removida",
      description: "A foto do personagem foi removida.",
    })
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="relative">
        <Avatar className="w-20 h-20">
          <AvatarImage src={value || "/placeholder.svg"} />
          <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">{fallback}</AvatarFallback>
        </Avatar>

        {value && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="border-gray-200 hover:bg-gray-50 bg-transparent"
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Carregando...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                {value ? "Alterar Foto" : "Carregar Foto"}
              </>
            )}
          </Button>

          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <X className="mr-2 h-4 w-4" />
              Remover
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          <p>Formatos aceitos: JPG, PNG, GIF, WebP</p>
          <p>Tamanho máximo: 5MB</p>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
