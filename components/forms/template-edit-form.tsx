// components/templates/TemplateEditModal.tsx
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { updateTemplate } from "@/lib/service/templates-service"
import { Template } from "@/lib/service/types"

interface TemplateEditModalProps {
  template: Template
  onSuccess?: () => void
  children: React.ReactNode
}

export function TemplateEditModal({ template, onSuccess, children }: TemplateEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [jsonValue, setJsonValue] = useState(JSON.stringify(template, null, 2))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ validationError, setValidationError] = useState(null)
  const { toast } = useToast()

  const handleSubmit = async () => {
  try {
    setIsSubmitting(true)
    setValidationError(null)
    
    const parsedData = JSON.parse(jsonValue)
    
    // Agora usando o ID do template
    await updateTemplate(template.id, parsedData)
    
    toast({
      title: "Template atualizado!",
      description: "As alterações foram salvas com sucesso.",
    })
    
    setIsOpen(false)
    onSuccess?.()
  } catch (error) {
      toast({
        title: "Erro ao atualizar template",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>JSON do Template</Label>
            <Textarea
              value={jsonValue}
              onChange={(e) => setJsonValue(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}