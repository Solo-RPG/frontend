interface Character {
  id: string
  name: string
  system: string
  level: string
  owner: string
  image?: string
  history: string
  lastModified: string
  fields: Record<string, any>
}

const STORAGE_KEY = "rpg-characters"

// Dados iniciais de exemplo
const initialCharacters: Character[] = [
  {
    id: "1",
    name: "Aragorn",
    system: "D&D 5e",
    level: "Nível 5 Ranger",
    owner: "João Silva",
    history: "Aragorn é um Dúnadan do Norte, herdeiro de Isildur e legítimo rei de Gondor.",
    lastModified: "2024-01-15",
    fields: {
      atributos: {
        força: 16,
        destreza: 14,
        constituição: 15,
        inteligência: 12,
        sabedoria: 15,
        carisma: 14,
      },
      classe: "Ranger",
      raça: "Humano",
      nível: 5,
      pontosDeVida: 58,
      classeDeArmadura: 16,
      habilidades: ["Sobrevivência", "Rastreamento", "Furtividade", "Percepção"],
    },
  },
  {
    id: "2",
    name: "Elara Moonwhisper",
    system: "Tormenta 20",
    level: "Nível 3 Elfa Druida",
    owner: "Maria Santos",
    history: "Elara é uma elfa druida que protege as florestas antigas.",
    lastModified: "2024-01-14",
    fields: {
      atributos: {
        força: 2,
        agilidade: 4,
        intelecto: 3,
        presença: 3,
      },
      origem: "Batedor",
      classe: "Arcanista",
      nível: 3,
      pontosDeVida: 45,
      mana: 25,
      equipamento: ["Cajado Élfico", "Armadura de Couro"],
    },
  },
  {
    id: "3",
    name: "Marcus Blackwood",
    system: "Call of Cthulhu",
    level: "Investigador Veterano",
    owner: "Pedro Costa",
    history: "Marcus é um investigador experiente que já enfrentou horrores indescritíveis.",
    lastModified: "2024-01-13",
    fields: {
      ocupação: "Detetive Particular",
      idade: 45,
      sanidade: 65,
      pontosDeMagia: 12,
      habilidades: ["Investigação", "Psicologia", "Uso de Armas"],
    },
  },
]

export const CharactersStorage = {
  // Inicializar dados se não existirem
  init(): void {
    if (typeof window === "undefined") return

    const existing = localStorage.getItem(STORAGE_KEY)
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCharacters))
    }
  },

  // Obter todos os personagens
  getAll(): Character[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Erro ao carregar personagens:", error)
      return []
    }
  },

  // Obter personagem por ID
  getById(id: string): Character | null {
    const characters = this.getAll()
    return characters.find((char) => char.id === id) || null
  },

  // Adicionar novo personagem
  add(character: Omit<Character, "id" | "lastModified">): Character {
    const characters = this.getAll()
    const newCharacter: Character = {
      ...character,
      id: Date.now().toString(),
      lastModified: new Date().toISOString().split("T")[0],
    }

    characters.push(newCharacter)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
    return newCharacter
  },

  // Atualizar personagem
  update(id: string, updates: Partial<Character>): Character | null {
    const characters = this.getAll()
    const index = characters.findIndex((char) => char.id === id)

    if (index === -1) return null

    characters[index] = {
      ...characters[index],
      ...updates,
      lastModified: new Date().toISOString().split("T")[0],
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
    return characters[index]
  },

  // Remover personagem
  remove(id: string): boolean {
    const characters = this.getAll()
    const filteredCharacters = characters.filter((char) => char.id !== id)

    if (filteredCharacters.length === characters.length) return false

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCharacters))
    return true
  },

  // Obter estatísticas
  getStats() {
    const characters = this.getAll()
    const systems = new Set(characters.map((char) => char.system))

    return {
      characters: characters.length,
      templates: systems.size,
      campaigns: 2, // Valor fixo por enquanto
    }
  },
}
