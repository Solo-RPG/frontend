"use client"

import { useState } from "react";
import { TemplateEditor, TemplateData } from "@/components/forms/dynamic-form-renderer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const initialTemplateData: TemplateData = {
  system_name: "",
  version: "",
  description: "",
  fields: [],
  template_json: {
    blocos: [],
  },
};

export default function CreateTemplatePage() {
  const router = useRouter();
  const [templateData, setTemplateData] = useState<TemplateData>(initialTemplateData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateChange = (data: TemplateData) => {
    setTemplateData(data);
  };

  const handleSaveTemplate = async () => {
    if (!templateData.system_name || !templateData.version) {
      toast.error("Preencha o nome do sistema e a versão");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar template");
      }

      const result = await response.json();
      toast.success("Template salvo com sucesso!");
      router.push(`/templates/${result.id}`);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Erro ao salvar template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Criar Novo Template</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push("/templates")}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveTemplate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Template"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <TemplateEditor 
          data={templateData} 
          onChange={handleTemplateChange} 
        />
      </div>
    </div>
  );
}