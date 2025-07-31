import {api} from '../axios';
import { 
  SheetForm, 
  SheetCreateRequest, 
  SheetUpdateRequest,
  TemplateBasicInfo,
  ApiResponse
} from './types';

class SheetService {
  /**
   * Cria uma nova ficha
   */
  async createSheet(request: SheetCreateRequest): Promise<ApiResponse<SheetForm>> {
    try {
      const response = await api.sheets.post<SheetForm>('/sheets', request);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Busca uma ficha pelo ID
   */
  async getSheet(sheetId: string): Promise<ApiResponse<SheetForm>> {
    try {
      const response = await api.sheets.get<SheetForm>(`/sheets/${sheetId}`);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Lista todas as fichas
   */
  async getAllSheets(): Promise<ApiResponse<SheetForm[]>> {
    try {
      const response = await api.sheets.get<SheetForm[]>('/sheets');
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Lista fichas por dono
   */
  async getSheetsByOwner(ownerId: string): Promise<ApiResponse<SheetForm[]>> {
    try {
      const response = await api.sheets.get<SheetForm[]>(`/sheets/by-user_id/${ownerId}`);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Busca templates disponíveis
   */
  async getTemplates(): Promise<ApiResponse<TemplateBasicInfo[]>> {
    try {
      const response = await api.sheets.get<TemplateBasicInfo[]>('/sheets/template/');
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Atualiza uma ficha
   */
  async updateSheet(
    sheetId: string, 
    updateData: SheetUpdateRequest
  ): Promise<ApiResponse<SheetForm>> {
    try {
      const response = await api.sheets.put<SheetForm>(`/sheets/${sheetId}`, updateData);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Vincula um personagem a uma ficha
   */
  async assignCharacter(
    sheetId: string, 
    characterId: string
  ): Promise<ApiResponse<SheetForm>> {
    try {
      const response = await api.sheets.patch<SheetForm>(`/sheets/${sheetId}/assign-character`, {
        character_id: characterId
      });
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Deleta uma ficha
   */
  async deleteSheet(sheetId: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.sheets.delete(`/sheets/${sheetId}`);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500
      };
    }
  }
}

export default new SheetService();