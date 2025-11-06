import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Trash2, Plus } from "lucide-react"
import { DynamicFormRenderer } from "@/components/forms/dynamic-form-renderer"
import { SheetForm, Template } from "@/lib/service/types"

export default function SheetCard({ sheet, template, editableSheetData, setEditableSheetData, isSavingSheet, isDeleting, onSave, onDelete, onCreateSheet }: {
  sheet: SheetForm | null;
  template: Template | null;
  editableSheetData: Record<string, any>;
  setEditableSheetData: (value: Record<string, any>) => void;
  isSavingSheet: boolean;
  isDeleting: boolean;
  onSave: () => void;
  onDelete: () => void;
  onCreateSheet: () => void;
}) {
  const isTemplateReady = template && Object.keys(template.fields).length > 0;

  if (sheet && isTemplateReady) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ficha de Personagem</CardTitle>
              <CardDescription>{template.system_name} (v{template.version})</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={isSavingSheet}>
                {isSavingSheet ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="ml-2">Salvar Ficha</span>
              </Button>
              <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span className="ml-2">Excluir Ficha</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DynamicFormRenderer
            fields={template.fields}
            values={editableSheetData}
            cols={template.cols || "2"}
            onChange={setEditableSheetData}
            status={template.status}
          />
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ficha de Personagem</CardTitle>
          <CardDescription>Este personagem ainda não possui uma ficha</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onCreateSheet} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Criar Ficha para este Personagem
          </Button>
        </CardContent>
      </Card>
    );
  }
}
