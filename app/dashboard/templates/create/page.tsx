import { TemplateCreatorModal } from "@/components/forms/template-create-modal";
import TemplateEditorModal from "@/components/forms/template-edit-modal";

export default function TemplateBuilderPage() {
    const onSuccess = () => {
        console.log("Template created successfully");
    };

    return (
       <TemplateCreatorModal />
    );

}