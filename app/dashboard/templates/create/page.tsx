import TemplateEditorModal from "@/components/forms/template-edit-modal";

export default function TemplateBuilderPage() {
    const onSuccess = () => {
        console.log("Template created successfully");
    };

    return (
       <TemplateEditorModal />
    );

}