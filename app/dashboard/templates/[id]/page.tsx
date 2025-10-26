"use client"

import TemplateEditorModal from "@/components/forms/template-edit-modal";
import { getTemplateById } from "@/lib/service/templates-service";
import { id } from "date-fns/locale";
import { useEffect, useState, use } from "react";

export default function page({params}: {params: Promise<{id: string}>}) {
  const [templateJson, setTemplateJson] = useState<any>(null);
  const id = use(params).id;


  useEffect(() => {

    async function fetchTemplate() {

      try {
        const template = await getTemplateById(id);
        setTemplateJson(template); // se template já for JSON, não precisa .json()
        console.log("Template JSON:", template);
      } catch (error) {
        console.error("Erro ao buscar template:", error);
      }
    }

    fetchTemplate();
  }, [params]);

    return (
       <TemplateEditorModal templateJson={templateJson} />
    );

}