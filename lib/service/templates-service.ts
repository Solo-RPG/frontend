import {api} from '../axios';
import {Template} from './types';
import { AxiosError } from 'axios'
import { authService } from './auth-service';

export const getTemplates = async (): Promise<Template[]> => {
  try {
    const tokens = authService.getAuthTokens();
    const response = await api.templates.get('/api/templates/', {
      headers: {
        Authorization: `Bearer ${tokens?.token}`
      }
    });
    // Garante que cada template tenha pelo menos um ID
    return response.data.map((template: any) => ({
      id: template.id || template._id?.toString(),
      ...template
    }));
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const uploadTemplate = async (templateJson: Template): Promise<Template> => {
  try {
    // Envia o JSON diretamente, sem encapsular em outro objeto
    const tokens = authService.getAuthTokens();
    const response = await api.templates.post('/api/templates/', templateJson, {
        headers: {
          Authorization: `Bearer ${tokens?.token}`
        }
      });
    return response.data;
  } catch (error) {
    console.error('Error uploading template:', error);
    throw error;
  }
};

export const getTemplateById = async (id: string) => {
  console.log(`Buscando template com ID: ${id}`) // Debug
  try {
    const tokens = authService.getAuthTokens();
    const response = await api.templates.get(`/api/templates/by-id/${id}`, {
      headers: {
        Authorization: `Bearer ${tokens?.token}`
      }
    });
    console.log("getTemplateById")
    console.log('Resposta da API:', response.data) // Debug
    return response.data
  } catch (error) {
    console.error('Erro ao buscar template:', error)
    return null
  }
}

export const deleteTemplate = async (id: string) => {
  console.log(`Buscando template com ID: ${id}`) // Debug
  try {
    const tokens = authService.getAuthTokens();
    const response = await api.templates.delete(`/api/templates/by-id/${id}`, {
      headers: {
        Authorization: `Bearer ${tokens?.token}`
      }
    });
    console.log("getTemplateById")
    console.log('Resposta da API:', response.data) // Debug
    return response.data
  } catch (error) {
    console.error('Erro ao buscar template:', error)
    return null
  }
}

export const updateTemplate = async (id: string, templateData: Template) => {
  try {
    const tokens = authService.getAuthTokens();
    const response = await api.templates.put(`/api/templates/${id}`, templateData, {
      headers: {
        Authorization: `Bearer ${tokens?.token}`
      }
    });
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {}
        throw new Error(
          Object.entries(validationErrors)
            .map(([field, messages]) => 
              `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('\n')
        )
      }
      throw new Error(error.response?.data?.message || 'Erro ao atualizar template')
    }
    throw new Error('Ocorreu um erro desconhecido ao atualizar o template')
  }
}