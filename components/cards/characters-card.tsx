import { Character } from "@/lib/service/types";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Plus, Search, Loader2, Trash2, Clipboard } from "lucide-react";
import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function CharactersHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Meus Personagens</h1>
        <p className="text-gray-600 dark:text-gray-400">Gerencie seus personagens de RPG</p>
      </div>
      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <Link href="/dashboard/characters/create">
          <Plus className="mr-2 h-4 w-4" />
          Novo Personagem
        </Link>
      </Button>
    </div>
  );
}

export function SearchInput({ searchTerm, onChange }: { searchTerm: string; onChange: (value: string) => void }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar personagens..."
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
      />
    </div>
  );
}

export function CharacterCard({ character, onDelete, onClone, isDeleting, isCloning }: {
  character: Character;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClone: (character: Character, e: React.MouseEvent) => void;
  isDeleting: boolean;
  isCloning: boolean;
}) {
  return (
    <Link 
      key={character.id} 
      href={`/dashboard/characters/${character.id}`}
      className="hover:shadow-md transition-shadow"
    >
      <Card className="border-0 shadow-sm hover:border-purple-200 transition-colors">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={character.imagem || "/placeholder.svg"} />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {character.nome_personagem
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{character.nome_personagem}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-zinc-900 text-red-600 border-zinc-900 hover:bg-red-600 hover:text-white"
              onClick={(e) => onDelete(character.id, e)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-zinc-900 text-gray-600 border-zinc-900 hover:bg-gray-600 hover:text-white"
              onClick={(e) => onClone(character, e)}
              disabled={isCloning}
            >
              {isCloning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Clipboard className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm ? "Nenhum personagem encontrado" : "Você ainda não criou nenhum personagem"}
      </h3>
      <p className="text-gray-500 mb-4">
        {searchTerm ? "Tente ajustar sua busca" : "Comece criando seu primeiro personagem"}
      </p>
      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <Link href="/dashboard/characters/create">
          <Plus className="mr-2 h-4 w-4" />
          Criar Primeira Ficha
        </Link>
      </Button>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Meus Personagens</h1>
        <Button disabled className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Personagem
        </Button>
      </div>
      
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar personagens..."
          value=""
          onChange={() => {}}
          className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <div className="h-9 bg-gray-200 rounded flex-1"></div>
                <div className="h-9 bg-gray-200 rounded flex-1"></div>
                <div className="h-9 bg-gray-200 rounded w-9"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
