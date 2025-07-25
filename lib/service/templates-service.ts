import api from '../axios';
import {Template} from './types';

export const getTemplates = async (): Promise<Template[]> => {
  try {
    const response = await api.get('/api/templates');
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
    const response = await api.post('/api/templates', templateJson);
    return response.data;
  } catch (error) {
    console.error('Error uploading template:', error);
    throw error;
  }
};

export const getTemplateById = async (id: string) => {
  console.log(`Buscando template com ID: ${id}`) // Debug
  try {
    const response = await api.get(`/api/templates/by-id/${id}`)
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
    const response = await api.delete(`/api/templates/by-id/${id}`)
    console.log('Resposta da API:', response.data) // Debug
    return response.data
  } catch (error) {
    console.error('Erro ao buscar template:', error)
    return null
  }
}