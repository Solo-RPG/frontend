"use client"

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/service/auth-service";
import SheetService from "@/lib/service/sheets-service";
import { getTemplates } from "@/lib/service/templates-service";
import CharacterService from "@/lib/service/characters-service";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DynamicFormRenderer, FieldDefinition } from "@/components/forms/dynamic-form-renderer";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { 
  Template, 
  Character, 
  SheetCreateRequest,
  SheetFormData,
  UserInfo
} from "@/lib/service/types";
import { Input } from "@/components/ui/input";

export default function CreateSheetPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [sheetData, setSheetData] = useState<SheetFormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [character, setCharacter] = useState<Character | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(authService.getUserInfo());
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const characterId = params.id as string;

  // Carrega os templates disponíveis
  const loadTemplates = useCallback(async () => {
    try {
      const response = await getTemplates();
      setTemplates(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao carregar templates",
        description: errorMessage || "Não foi possível carregar os templates.",
        variant: "destructive",
      });
    } finally {
      setTemplatesLoading(false);
    }
  }, [toast]);

  const filteredTemplates = templates.filter((template) =>
    template.system_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Carrega informações do personagem
  const loadCharacter = useCallback(async () => {
    try {
      const data = await CharacterService.getCharacterById(characterId);
      setCharacter(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao carregar personagem",
        description: errorMessage || "Verifique se o personagem existe.",
        variant: "destructive",
      });
    }
  }, [characterId, toast]);

  // Inicializa os campos do formulário quando um template é selecionado
useEffect(() => {
  if (!selectedTemplate) return;

  const initializeNestedFields = (fields: Record<string, FieldDefinition>): Record<string, any> => {
    const initialized: Record<string, any> = {};
    
    for (const [key, field] of Object.entries(fields)) {
      const fieldName = field.name || key;
      
      if (field.type === 'object' && field.fields) {
        initialized[fieldName] = initializeNestedFields(field.fields);
      } else {
        initialized[fieldName] = '';
      }
    }
    
    return initialized;
  };

  setSheetData(initializeNestedFields(selectedTemplate.fields));
}, [selectedTemplate]);

  // Carrega dados iniciais
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadTemplates(), loadCharacter()]);
    };
    
    loadData();
  }, [loadTemplates, loadCharacter]);

  // Normaliza os campos do formulário
  const normalizeFields = useCallback((
  values: Record<string, any>,
  fields: Record<string, FieldDefinition>
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, field] of Object.entries(fields)) {
    const fieldName = field.name || key;
    const value = values[fieldName];
    
    if (field.type === 'object' && field.fields) {
      result[fieldName] = value ? normalizeFields(value, field.fields) : {};
    } else {
      result[fieldName] = value ?? '';
    }
  }

  return result;
}, []);

  // Verifica campos obrigatórios faltando
  const findMissingFields = (
    values: Record<string, any>,
    fields: Record<string, FieldDefinition>,
    parentKey = ''
  ): string[] => {
    let missingFields: string[] = [];

    for (const [key, field] of Object.entries(fields)) {
      const fieldName = field.name || key;
      const displayName = field.name || key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      const value = values[fieldName];

      if (field.required) {
        if (value === undefined || value === null || value === '') {
          missingFields.push(displayName);
        }
      }

      // Verifica campos aninhados
      if (field.type === 'object' && field.fields && value) {
        missingFields = [
          ...missingFields,
          ...findMissingFields(value, field.fields, fieldName)
        ];
      }
    }

    return missingFields;
  };

  // Função auxiliar para acessar valores aninhados
  const getValueByPath = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  // Cria a ficha
  const handleCreateSheet = async () => {
    console.log('Dados do formulário:', JSON.stringify(sheetData, null, 2));
    console.log('Estrutura do template:', JSON.stringify(selectedTemplate?.fields, null, 2));
    
    if (!selectedTemplate || !userInfo?.id) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, faça login e selecione um template",
        variant: "destructive",
      });
      return;
    }

    // Verificação de campos obrigatórios
    const missingFields = findMissingFields(sheetData, selectedTemplate.fields);
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios faltando",
        description: `Preencha os seguintes campos: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

  // Prepara os dados para envio
  const requestData: SheetCreateRequest = {
    template_id: selectedTemplate.id,
    owner_id: userInfo.id,
    fields: sheetData, // Usa os dados diretamente como estão
  };

  setIsLoading(true);
  try {
    const sheetResponse = await SheetService.createSheet(requestData);
    await CharacterService.assignSheetToCharacter(characterId, sheetResponse.data.id);

    toast({
      title: "Ficha criada com sucesso!",
      description: "A ficha foi associada ao personagem.",
    });

    router.push(`/dashboard/characters/${characterId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro ao criar a ficha.";
    toast({
      title: "Erro ao criar ficha",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  if (templatesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/characters/${characterId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Criar Ficha</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/characters/${characterId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedTemplate ? "Preencher Ficha" : "Selecionar Template"}
          </h1>
          <p className="text-muted-foreground">
            {selectedTemplate
              ? "Preencha os dados da ficha para o personagem abaixo"
              : "Escolha um template para sua ficha"}
          </p>
        </div>
      </div>

      {!selectedTemplate ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Passo 1: Selecione um Template</h2>

          <div className="flex items-center">
            <Input
              placeholder="Buscar template por nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{template.system_name}</CardTitle>
                    <Badge variant="secondary">v{template.version}</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Selecionar Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (

        <div className="space-y-6">
          {character && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informações do Personagem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <Avatar className="w-48 h-48 rounded-xl">
                    <AvatarImage src={character?.imagem} alt={character?.nomePersonagem} />
                    <AvatarFallback>IMG</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col w-full">
                    <div className="mb-4">
                      <Label className="text-lg">Nome</Label>
                      <p className="text-xl font-semibold">{character?.nomePersonagem}</p>
                    </div>

                    <div>
                      <Label className="text-lg">História</Label>
                      <div className="mt-1 p-3 border rounded-md bg-muted max-h-48 overflow-y-auto whitespace-pre-line">
                        {character?.historia || "Sem história disponível."}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Atributos da Ficha</CardTitle>
              <CardDescription>
                Preencha os campos específicos do sistema {selectedTemplate.system_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicFormRenderer
                fields={selectedTemplate?.fields || {}}
                values={sheetData}
                onChange={(newData) => {
                    setSheetData(newData);
                  }}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Voltar
            </Button>
            <Button onClick={handleCreateSheet} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Finalizar Ficha"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}