import {api} from '../axios';
import {authService} from './auth-service'
import {
  Character,
  CharacterCreateRequest,
  CharacterUpdateRequest
} from './types';

const CharacterService = {
  /**
   * Cria um novo personagem
   * @param characterData Dados para criação do personagem
   * @returns Personagem criado
   */
  async createCharacter(characterData: CharacterCreateRequest): Promise<Character> {
    console.log(characterData)
    const tokens = authService.getAuthTokens()
    const response = await api.characters.post<Character>('/api/characters', characterData, {
      headers: {
        Authorization: `Bearer ${tokens?.token}`
      }
    })
    return response.data
  },

  /**
   * Busca um personagem por ID
   * @param id ID do personagem
   * @returns Personagem encontrado
   */
  async getCharacterById(id: string): Promise<Character> {
    try {
      const response = await api.characters.get<Character>(`/api/characters/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lista todos os personagens
   * @returns Lista de personagens
   */
  async getAllCharacters(): Promise<Character[]> {
    try {
      const response = await api.characters.get<Character[]>('/api/characters/');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lista personagens por proprietário
   * @param ownerId ID do proprietário
   * @returns Lista de personagens do proprietário
   */
  async getCharactersByOwner(ownerId: string): Promise<Character[]> {
    try {
      const response = await api.characters.get(`/api/characters/by-owner/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching characters:", error);
      throw error;
    }
  },

  /**
   * Atualiza um personagem
   * @param id ID do personagem
   * @param updateData Dados para atualização
   * @returns Personagem atualizado
   */
  async updateCharacter(
    id: string,
    updateData: CharacterUpdateRequest
  ): Promise<Character> {
    try {
      const response = await api.characters.put<Character>(`/api/characters/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Vincula uma ficha ao personagem
   * @param characterId ID do personagem
   * @param sheetId ID da ficha
   * @returns Personagem atualizado
   */
  async assignSheetToCharacter(
    characterId: string,
    sheetId: string
  ): Promise<Character> {
    try {
      const response = await api.characters.put<Character>(
        `/api/characters/${characterId}/assign-ficha/${sheetId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Remove um personagem
   * @param id ID do personagem
   * @returns Confirmação de sucesso
   */
  async deleteCharacter(id: string): Promise<boolean> {
    try {
      await api.characters.delete(`/api/characters/${id}`);
      return true;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
};

export default CharacterService;