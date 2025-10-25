import {api} from '../axios';
import {authService} from './auth-service'
import { 
  SheetForm, 
  SheetCreateRequest, 
  SheetUpdateRequest,
  TemplateBasicInfo,
  ApiResponse
} from './types';
import { AxiosError } from 'axios'

function normalizeId(id: string): string {
  // Remove aspas extras se existirem
  let cleanId = id.replace(/^"(.*)"$/, '$1');
  
  // Converte para string se não for
  return String(cleanId);
}

class SheetService {
  /**
   * Cria uma nova ficha
   */
  async createSheet(request: SheetCreateRequest): Promise<ApiResponse<SheetForm>> {
    try {
      const tokens = authService.getAuthTokens();
      const response = await api.sheets.post<SheetForm>('/api/sheets/', request, {
        headers: {
          Authorization: `Bearer ${tokens?.token}`
        }
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
   * Busca uma ficha pelo ID
   */
  async getSheet(sheetId: string, signal?: AbortSignal): Promise<ApiResponse<SheetForm>> {
    try {
      const tokens = authService.getAuthTokens();
      const response = await api.sheets.get<SheetForm>(`/api/sheets/${sheetId}`, {
        headers: {
          Authorization: `Bearer ${tokens?.token}`
        },
        signal, // Passa o AbortSignal para permitir cancelamento
        timeout: 10000 // 10 segundos de timeout
      });
      
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {      
      // Tratamento normal de erros
      const axiosError = error as AxiosError;
      throw {
        data: axiosError.response?.data,
        status: axiosError.response?.status || 500
      };
    }
  }

  /**
   * Lista todas as fichas
   */
  async getAllSheets(): Promise<ApiResponse<SheetForm[]>> {
    try {
      const tokens = authService.getAuthTokens();
      const response = await api.sheets.get<SheetForm[]>('/api/sheets', {
        headers: {
          Authorization: `Bearer ${tokens?.token}`
        }
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
   * Lista fichas por dono
   */
  async getSheetsByOwner(ownerId: string): Promise<ApiResponse<SheetForm[]>> {
    try {
      const tokens = authService.getAuthTokens();
      const response = await api.sheets.get<SheetForm[]>(`/api/sheets/by-user_id/${ownerId}`, {
        headers: {
          Authorization: `Bearer ${tokens?.token}`
        }
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
   * Busca templates disponíveis
   */
  async getTemplates(): Promise<ApiResponse<TemplateBasicInfo[]>> {
    try {
      const tokens = authService.getAuthTokens();
      const response = await api.sheets.get<TemplateBasicInfo[]>('/api/sheets/template/', {
        headers: {
          Authorization: `Bearer ${tokens?.token}`
        }
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
   * Atualiza uma ficha
   */
  async updateSheet(
  sheetId: string,
  updateData: { fields: Record<string, any> } // Garanta que está enviando a estrutura correta
): Promise<ApiResponse<SheetForm>> {
  try {
    const tokens = authService.getAuthTokens();
    const response = await api.sheets.put<SheetForm>(
      `/api/sheets/${sheetId}`,updateData,
      { headers: {
          Authorization: `Bearer ${tokens?.token}`
        }, }
    );
    return {
      data: response.data,
      status: response.status
    };
  } catch (error: any) {
    console.error("Erro ao atualizar ficha:", error.response?.data || error.message);
    throw {
      data: error.response?.data || { message: "Erro ao atualizar ficha" },
      status: error.response?.status || 500
    };
  }
}

  async assignCharacter(
    sheetId: string, 
    characterId: string
  ): Promise<ApiResponse<SheetForm>> {
    try {
      const tokens = authService.getAuthTokens();
      const response = await api.sheets.patch<SheetForm>(`/api/sheets/${sheetId}/assign-character`, {
        headers: {
          Authorization: `Bearer ${tokens?.token}`
        },
        data: {
          character_id: characterId
        }
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
      const tokens = authService.getAuthTokens();
      const response = await api.sheets.delete(`/api/sheets/${sheetId}`, {
        headers: {
          Authorization: `Bearer ${tokens?.token}`
        }
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
}

export default new SheetService();