import axios from 'axios';

const api_templates = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    'Content-Type': 'application/json',
  },
});

const api_sheets = axios.create({
  baseURL: "http://localhost:8001",
  headers: {
    'Content-Type': 'application/json',
  },
});

const api_characters = axios.create({
  baseURL: "http://localhost:8002/api/characters",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exporta todas as APIs em um objeto
export const api = {
  templates: api_templates,
  sheets: api_sheets,
  characters: api_characters,
};