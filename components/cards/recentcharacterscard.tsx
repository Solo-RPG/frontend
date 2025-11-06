import { Character } from "@/lib/service/types";
import { Plus, Users } from "lucide-react";
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export function RecentCharactersCard({ characters }: { characters: Character[] }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="">Personagens Recentes</CardTitle>
        <CardDescription className="">Seus personagens criados recentemente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {characters.length > 0 ? (
            characters.map((character) => (
              <Link 
                key={character.id} 
                href={`/dashboard/characters/${character.id}`}
                className="block hover:bg-gray-50 dark:hover:text-black rounded-lg p-2 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium ">{character.nome_personagem}</p>
                    <p className="text-sm text-muted-foreground ">
                      {character.ficha_id ? "Ficha criada" : "Sem ficha vinculada"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState 
              message="Nenhum personagem criado ainda"
              actionText="Criar Primeiro Personagem"
              actionHref="/dashboard/characters/create"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ message, actionText, actionHref }: {
  message: string
  actionText: string
  actionHref: string
}) {
  return (
    <div className="text-center py-4">
      <p className="text-gray-500 text-sm">{message}</p>
      <Button asChild size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
        <Link href={actionHref}>
          <Plus className="mr-2 h-4 w-4" />
          {actionText}
        </Link>
      </Button>
    </div>
  )
}