import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Character } from "@/lib/service/types"
import CharacterAvatar from "./characteravatar"

export default function CharacterInfoCard({
  character,
  editableCharacter,
  setEditableCharacter,
  isSavingCharacter,
  isDeleting,
  onSave,
  onDelete,
}: {
  character: Character
  editableCharacter: Partial<Character>
  setEditableCharacter: (value: Partial<Character>) => void
  isSavingCharacter: boolean
  isDeleting: boolean
  onSave: () => void
  onDelete: () => void
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">
            Informações do Personagem
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={onSave}
              disabled={isSavingCharacter}
              className="flex items-center justify-center"
            >
              {isSavingCharacter ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="ml-2 text-sm sm:text-base">Salvar</span>
            </Button>

            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center justify-center"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="ml-2 text-sm sm:text-base">Excluir</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar e nome */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="flex-shrink-0">
            <CharacterAvatar
              imagem={editableCharacter.imagem}
              onChange={(e) =>
                setEditableCharacter({ ...editableCharacter, imagem: e })
              }
              onSave={onSave}
              isSaving={isSavingCharacter}
            />
          </div>

          <div className="w-full sm:flex-1 space-y-2">
            <Label className="text-sm sm:text-base">Nome do Personagem</Label>
            <Input
              value={
                editableCharacter.nome_personagem || character.nome_personagem
              }
              onChange={(e) =>
                setEditableCharacter({
                  ...editableCharacter,
                  nome_personagem: e.target.value,
                })
              }
              placeholder="Digite o nome do personagem"
              className="w-full"
            />
          </div>
        </div>

        {/* História */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base">História</Label>
          <Textarea
            value={editableCharacter.historia || character.historia || ""}
            onChange={(e) =>
              setEditableCharacter({
                ...editableCharacter,
                historia: e.target.value,
              })
            }
            rows={5}
            placeholder="Escreva a história do personagem..."
            className="resize-none w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
