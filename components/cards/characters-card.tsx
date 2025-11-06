import { Character } from "@/lib/service/types";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Plus, Search, Loader2, Trash2, Clipboard } from "lucide-react";
import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

/* =========================
   HEADER RESPONSIVO
========================= */
export function CharactersHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Meus Personagens
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Gerencie seus personagens de RPG
        </p>
      </div>
      <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
        <Link href="/dashboard/characters/create" className="flex justify-center items-center">
          <Plus className="mr-2 h-4 w-4" />
          Novo Personagem
        </Link>
      </Button>
    </div>
  );
}

/* =========================
   CAMPO DE BUSCA RESPONSIVO
========================= */
export function SearchInput({ searchTerm, onChange }: { searchTerm: string; onChange: (value: string) => void }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar personagens..."
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500 w-full"
      />
    </div>
  );
}

/* =========================
   CARD DE PERSONAGEM
========================= */
export function CharacterCard({
  character,
  onDelete,
  onClone,
  isDeleting,
  isCloning,
}: {
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
            <Avatar className="h-12 w-12">
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
              <CardTitle className="text-base sm:text-lg">{character.nome_personagem}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-zinc-900 text-red-600 border-zinc-900 hover:bg-red-600 hover:text-white"
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
              className="flex-1 bg-zinc-900 text-gray-600 border-zinc-900 hover:bg-gray-600 hover:text-white"
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

/* =========================
   ESTADO VAZIO RESPONSIVO
========================= */
export function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="text-center py-12 px-4 sm:px-0">
      <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
        {searchTerm ? "Nenhum personagem encontrado" : "Você ainda não criou nenhum personagem"}
      </h3>
      <p className="text-gray-500 mb-4 text-sm sm:text-base">
        {searchTerm ? "Tente ajustar sua busca" : "Comece criando seu primeiro personagem"}
      </p>
      <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
        <Link href="/dashboard/characters/create">
          <Plus className="mr-2 h-4 w-4" />
          Criar Primeira Ficha
        </Link>
      </Button>
    </div>
  );
}

/* =========================
   SKELETON RESPONSIVO
========================= */
export function LoadingSkeleton() {
  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Meus Personagens
        </h1>
        <Button disabled className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Personagem
        </Button>
      </div>
      
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar personagens..."
          value=""
          onChange={() => {}}
          className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500 w-full"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
