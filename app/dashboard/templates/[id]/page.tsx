import { getTemplateById } from "@/lib/service/templates-service"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TemplateField {
  name: string
  type: string
  required?: boolean
  default?: any
  description?: string
  options?: string[]
  min?: number
  max?: number
  fields?: TemplateField[] | Record<string, TemplateField>
}

interface TemplateBloco {
  titulo: string
  campos: string[]
}

interface Template {
  id: string
  system_name: string
  version: string
  description?: string
  created_at?: string
  fields?: TemplateField[] | Record<string, TemplateField>
  template_json?: {
    blocos: TemplateBloco[]
  }
}

const renderField = (field: TemplateField, depth = 0) => {
  const paddingLeft = `${depth * 20}px`
  
  return (
    <div key={field.name} className="mb-4" style={{ paddingLeft }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium">{field.name}</span>
        <Badge variant="outline">{field.type}</Badge>
        {field.required && <Badge variant="destructive">Obrigatório</Badge>}
      </div>
      
      <div className="text-sm text-muted-foreground space-y-1">
        {field.default && <div>Padrão: {String(field.default)}</div>}
        {field.description && <div>Descrição: {field.description}</div>}
        {field.options && (
          <div>
            Opções: {field.options.join(', ')}
          </div>
        )}
        {field.min && <div>Mínimo: {field.min}</div>}
        {field.max && <div>Máximo: {field.max}</div>}
      </div>

      {field.fields && (
        <div className="mt-2 space-y-3 border-l pl-4">
          {Array.isArray(field.fields) 
            ? field.fields.map((f) => renderField(f, depth + 1))
            : Object.entries(field.fields).map(([_, value]) => renderField(value as TemplateField, depth + 1))
          }
        </div>
      )}
    </div>
  )
}

export default async function TemplateDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const template = await getTemplateById(params.id) as Template | null

  if (!template) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/templates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {template.system_name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">v{template.version}</Badge>
            {template.created_at && (
              <span className="text-sm text-muted-foreground">
                Criado em: {new Date(template.created_at).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>
      </div>

      {template.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{template.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Estrutura da Ficha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {template.fields ? (
            Array.isArray(template.fields) ? (
              template.fields.map((field) => renderField(field))
            ) : (
              Object.entries(template.fields).map(([_, value]) => renderField(value as TemplateField))
            )
          ) : (
            <p className="text-muted-foreground">Nenhum campo definido</p>
          )}
        </CardContent>
      </Card>

      {template.template_json?.blocos && (
        <Card>
          <CardHeader>
            <CardTitle>Organização dos Blocos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {template.template_json.blocos.map((bloco, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">{bloco.titulo}</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {bloco.campos.map((campo, i) => (
                    <li key={i}>• {campo}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <details className="border rounded-lg overflow-hidden">
        <summary className="bg-muted px-4 py-2 font-medium cursor-pointer">
          JSON Completo (Debug)
        </summary>
        <pre className="p-4 text-sm bg-muted/50 overflow-x-auto">
          <code>{JSON.stringify(template, null, 2)}</code>
        </pre>
      </details>
    </div>
  )
}