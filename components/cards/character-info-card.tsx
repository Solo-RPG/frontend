import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Character } from "@/lib/service/types"
import CharacterAvatar from "./characteravatar"

export default function CharacterInfoCard({ character, editableCharacter, setEditableCharacter, isSavingCharacter, isDeleting, onSave, onDelete }: {
  character: Character;
  editableCharacter: Partial<Character>;
  setEditableCharacter: (value: Partial<Character>) => void;
  isSavingCharacter: boolean;
  isDeleting: boolean;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Informações do Personagem</CardTitle>
          <div className="flex gap-2">
            <Button onClick={onSave} disabled={isSavingCharacter}>
              {isSavingCharacter ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="ml-2">Salvar</span>
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              <span className="ml-2">Excluir</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <CharacterAvatar
            imagem={editableCharacter.imagem}
            onChange={(e) => setEditableCharacter({ ...editableCharacter, imagem: e })}
            onSave={onSave}
            isSaving={isSavingCharacter}
          />
          <div className="flex-1 space-y-2">
            <Label>Nome do Personagem</Label>
            <Input
              value={editableCharacter.nome_personagem || character.nome_personagem}
              onChange={(e) => setEditableCharacter({ ...editableCharacter, nome_personagem: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>História</Label>
          <Textarea
            value={editableCharacter.historia || character.historia || ""}
            onChange={(e) => setEditableCharacter({ ...editableCharacter, historia: e.target.value })}
            rows={5}
          />
        </div>
      </CardContent>
    </Card>
  );
}