import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Trash2, Plus } from "lucide-react"
import { DynamicFormRenderer } from "@/components/forms/dynamic-form-renderer"
import { SheetForm, Template } from "@/lib/service/types"

export default function SheetCard({
  sheet,
  template,
  editableSheetData,
  setEditableSheetData,
  isSavingSheet,
  isDeleting,
  onSave,
  onDelete,
  onCreateSheet,
}: {
  sheet: SheetForm | null
  template: Template | null
  editableSheetData: Record<string, any>
  setEditableSheetData: (value: Record<string, any>) => void
  isSavingSheet: boolean
  isDeleting: boolean
  onSave: () => void
  onDelete: () => void
  onCreateSheet: () => void
}) {
  const isTemplateReady = template && Object.keys(template.fields || {}).length > 0

  if (sheet && isTemplateReady) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title + Description */}
            <div>
              <CardTitle className="text-lg sm:text-xl">Ficha de Personagem</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {template.system_name} (v{template.version})
              </CardDescription>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={onSave}
                disabled={isSavingSheet}
                className="flex items-center justify-center"
              >
                {isSavingSheet ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="ml-2 text-sm sm:text-base">Salvar Ficha</span>
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
                <span className="ml-2 text-sm sm:text-base">Excluir Ficha</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <DynamicFormRenderer
            fields={template.fields}
            values={editableSheetData}
            cols={template.cols || "2"}
            onChange={setEditableSheetData}
            status={template.status}
          />
        </CardContent>
      </Card>
    )
  }

  // Estado quando ainda não há ficha
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Ficha de Personagem</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Este personagem ainda não possui uma ficha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onCreateSheet}
          className="w-full flex items-center justify-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Criar Ficha para este Personagem
        </Button>
      </CardContent>
    </Card>
  )
}
