"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Trash2 } from "lucide-react"
import CharacterService from "@/lib/service/characters-service"
import SheetService from "@/lib/service/sheets-service"
import { getTemplateById } from "@/lib/service/templates-service"
import { DynamicFormRenderer } from "@/components/forms/dynamic-form-renderer"
import { Character, SheetForm, Template } from "@/lib/service/types"

export default function CharacterDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // Estados principais
  const [character, setCharacter] = useState<Character | null>(null)
  const [sheet, setSheet] = useState<SheetForm | null>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  
  // Estados editáveis
  const [editableCharacter, setEditableCharacter] = useState<Partial<Character>>({})
  const [editableSheetData, setEditableSheetData] = useState<Record<string, any>>({})
  
  // Estados de loading
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingCharacter, setIsSavingCharacter] = useState(false)
  const [isSavingSheet, setIsSavingSheet] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Carrega personagem
        const characterData = await CharacterService.getCharacterById(id as string)
        setCharacter(characterData)
        setEditableCharacter({...characterData})

        // Se existir ficha, carrega ela e o template
        if (characterData.ficha_id) {
          const sheetResponse = await SheetService.getSheet(characterData.ficha_id)
          setSheet(sheetResponse.data)
          setEditableSheetData({...sheetResponse.data.data})
          
          // Busca o template separadamente
          const templateResponse = await getTemplateById(sheetResponse.data.template_id)
          setTemplate(templateResponse.data)
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar os dados do personagem",
          variant: "destructive",
        })
        router.push("/dashboard/characters")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id, router, toast])

  const handleSaveCharacter = async () => {
    if (!editableCharacter || !character) return

    setIsSavingCharacter(true)
    try {
      const updatedCharacter = await CharacterService.updateCharacter(
        character.id,
        {
          nome_personagem: editableCharacter.nome_personagem || character.nome_personagem,
          historia: editableCharacter.historia || character.historia,
          imagem: editableCharacter.imagem || character.imagem
        }
      )
      setCharacter(updatedCharacter)
      toast({
        title: "Sucesso",
        description: "Personagem atualizado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar personagem",
        variant: "destructive",
      })
    } finally {
      setIsSavingCharacter(false)
    }
  }

  const handleSaveSheet = async () => {
    if (!sheet) return

    setIsSavingSheet(true)
    try {
      const updatedSheet = await SheetService.updateSheet(sheet.id, {
        fields: editableSheetData
      })
      setSheet(updatedSheet.data)
      toast({
        title: "Sucesso",
        description: "Ficha atualizada com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar ficha",
        variant: "destructive",
      })
    } finally {
      setIsSavingSheet(false)
    }
  }

  const handleDelete = async () => {
    if (!character) return

    setIsDeleting(true)
    try {
      await CharacterService.deleteCharacter(character.id)
      if (character.ficha_id) {
        await SheetService.deleteSheet(character.ficha_id)
      }
      toast({
        title: "Sucesso",
        description: "Personagem excluído com sucesso",
      })
      router.push("/dashboard/characters")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir personagem",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading || !character) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Card do Personagem */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Informações do Personagem</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveCharacter}
                disabled={isSavingCharacter}
              >
                {isSavingCharacter ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="ml-2">Salvar</span>
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="ml-2">Excluir</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campos editáveis do personagem */}
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={editableCharacter.nome_personagem || character.nome_personagem}
              onChange={(e) => setEditableCharacter({
                ...editableCharacter,
                nome_personagem: e.target.value
              })}
            />
          </div>
          {/* Adicione outros campos do personagem conforme necessário */}
        </CardContent>
      </Card>

      {/* Card da Ficha (se existir) */}
      {sheet && template && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Ficha de Personagem</CardTitle>
                <CardDescription>
                  {sheet.template_system_name} (v{sheet.template_system_version})
                </CardDescription>
              </div>
              <Button 
                onClick={handleSaveSheet}
                disabled={isSavingSheet}
              >
                {isSavingSheet ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="ml-2">Salvar Ficha</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DynamicFormRenderer
              fields={template.fields}
              values={editableSheetData}
              onChange={setEditableSheetData}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}