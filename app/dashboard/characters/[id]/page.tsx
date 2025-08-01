"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Trash2, Plus } from "lucide-react"
import CharacterService from "@/lib/service/characters-service"
import SheetService from "@/lib/service/sheets-service"
import { getTemplateById } from "@/lib/service/templates-service"
import { DynamicFormRenderer, FieldDefinition } from "@/components/forms/dynamic-form-renderer"
import { Character, SheetForm, Template } from "@/lib/service/types"
import { flattenSheetData, unflattenSheetData} from "@/lib/service/sheet-helpers"
import sheetsService from "@/lib/service/sheets-service"

export default function CharacterDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // Estados principais
  const [character, setCharacter] = useState<Character | null>(null)
  const [sheet, setSheet] = useState<SheetForm | null>(null)
  const [template, setTemplate] = useState<Template | null>(null);
  
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
      
      const characterData = await CharacterService.getCharacterById(id as string)
      setCharacter(characterData)
      setEditableCharacter({...characterData})

      if (characterData.fichaId) {
        const sheetResponse = await SheetService.getSheet(characterData.fichaId)
        console.log(sheetResponse.data.id)
        setSheet(sheetResponse.data)
        const flattenedData = flattenSheetData(sheetResponse.data.data);
        setEditableSheetData(flattenedData);
        
        const templateResponse = await getTemplateById(sheetResponse.data.template_id);
        
        // Converter array de campos para objeto com verificação segura
        const fieldsArray = templateResponse.fields;
        const fieldsObject: Record<string, FieldDefinition> = {};
        
        fieldsArray.forEach((field: any) => {
          // Verificação robusta para garantir que o campo tem uma propriedade 'name'
          if (field && field.name && typeof field.name === 'string') {
            fieldsObject[field.name] = {
              name: field.name,
              type: field.type || 'string', // valor padrão
              required: field.required,
              min: field.min,
              max: field.max,
              options: field.options,
              fields: field.fields,
              itemType: field.itemType
            };
          } else {
            console.warn("Campo inválido ignorado:", field);
          }
        });

        // Criar novo objeto de template com campos convertidos
        const convertedTemplate = {
            ...templateResponse,  // Usar templateResponse diretamente
            fields: fieldsObject
          };

          setTemplate(convertedTemplate);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
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


  useEffect(() => {
  if (sheet) {
    console.log("Dados originais da ficha:", sheet.data);
    const flattened = flattenSheetData(sheet.data);
    console.log("Dados aplainados:", flattened);
  }
}, [sheet]);

useEffect(() => {
  if (editableSheetData && Object.keys(editableSheetData).length > 0) {
    console.log("Dados editáveis (aplainados):", editableSheetData);
    const unflattened = unflattenSheetData(editableSheetData);
    console.log("Dados reconstruídos:", unflattened);
  }
}, [editableSheetData]);

  const handleSaveCharacter = async () => {
    if (!editableCharacter || !character) return

    setIsSavingCharacter(true)
    try {
      const updatedCharacter = await CharacterService.updateCharacter(
        character.id,
        {
          nomePersonagem: editableCharacter.nomePersonagem || character.nomePersonagem,
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
    if (!sheet || !template || !character?.fichaId) {
      toast({
        title: "Erro",
        description: "Dados incompletos para salvar a ficha",
        variant: "destructive",
      });
      return;
    }

    console.log("Character FichaId:", character.fichaId);
    console.log("Sheet ID:", sheet?.id);

    setIsSavingSheet(true);
    try {
      const dataToSend = {
        fields: unflattenSheetData(editableSheetData)
      };

      console.log("Atualizando ficha com ID:", character.fichaId);
      
      const response = await SheetService.updateSheet(character.fichaId, dataToSend);
      
      setSheet(response.data);
      toast({
        title: "Sucesso",
        description: "Ficha atualizada com sucesso",
      });
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      toast({
        title: "Erro",
        description: error.data?.message || "Falha ao atualizar ficha",
        variant: "destructive",
      });
    } finally {
      setIsSavingSheet(false);
    }
  };

  const handleDelete = async () => {
    if (!character) return

    setIsDeleting(true)
    try {
      await CharacterService.deleteCharacter(character.id)
      if (character.fichaId) {
        await SheetService.deleteSheet(character.fichaId)
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

  const handleDeleteSheet = async () => {
  if (!character?.fichaId) return;

  setIsDeleting(true);
  try {
    await SheetService.deleteSheet(character.fichaId);
    
    // Atualiza o estado removendo a referência da ficha
    setSheet(null);
    setEditableSheetData({});
    setTemplate(null);
    
    // Atualiza o personagem para remover a fichaId
    const updatedCharacter = await CharacterService.updateCharacter(character.id, {
      ...character,
      fichaId: null
    });
    setCharacter(updatedCharacter);
    setEditableCharacter(updatedCharacter);

    toast({
      title: "Sucesso",
      description: "Ficha excluída com sucesso",
    });
  } catch (error) {
    toast({
      title: "Erro",
      description: "Falha ao excluir ficha",
      variant: "destructive",
    });
  } finally {
    setIsDeleting(false);
  }
};

    const isTemplateReady = template && Object.keys(template.fields).length > 0;

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
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={character.imagem || undefined} />
              <AvatarFallback>
                {character.nomePersonagem.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label>Nome do Personagem</Label>
              <Input
                value={editableCharacter.nomePersonagem || character.nomePersonagem}
                onChange={(e) => setEditableCharacter({
                  ...editableCharacter,
                  nomePersonagem: e.target.value
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>História</Label>
            <Textarea
              value={editableCharacter.historia || character.historia || ""}
              onChange={(e) => setEditableCharacter({
                ...editableCharacter,
                historia: e.target.value
              })}
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Seção da Ficha */}
      {sheet && isTemplateReady ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Ficha de Personagem</CardTitle>
                <CardDescription>
                  {template.system_name} (v{template.version})
                </CardDescription>
              </div>
              <div className="flex gap-2">
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
                <Button 
                  variant="destructive"
                  onClick={handleDeleteSheet}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="ml-2">Excluir Ficha</span>
                </Button>
              </div>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ficha de Personagem</CardTitle>
            <CardDescription>Este personagem ainda não possui uma ficha</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push(`/dashboard/characters/${id}/create-sheet`)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Ficha para este Personagem
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}