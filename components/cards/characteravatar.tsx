import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Save } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/ui/image-upload"
import { DialogTitle } from "@radix-ui/react-dialog"

export default function CharacterAvatar({ imagem, onChange, onSave, isSaving }: {
  imagem?: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className="h-24 w-24 hover:cursor-pointer">
          <AvatarImage src={imagem} />
          <AvatarFallback className="hover:bg-zinc-400">
            {/* Nota: nome_personagem não está disponível aqui, então passe como prop se necessário */}
            {/* Por enquanto, use um fallback genérico */}
            P
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Alterar Imagem do Personagem</DialogTitle>
        <ImageUpload value={imagem} onChange={onChange} />
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="ml-2">Salvar</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}