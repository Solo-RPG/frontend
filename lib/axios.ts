import axios, { AxiosHeaders } from 'axios';
import { authService } from './service/auth-service';

const BASE_URL = 'http://54.232.64.32';

const api_templates = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    'Content-Type': 'application/json',
  },
});

const api_sheets = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    'Content-Type': 'application/json',
  },
});

const api_characters = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição
api_characters.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const tokens = localStorage.getItem('@solo-rpg:tokens');
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        if (parsedTokens?.token) {
          // Cria novos headers se necessário
          if (!(config.headers instanceof AxiosHeaders)) {
            config.headers = new AxiosHeaders(config.headers);
          }
          config.headers.set('Authorization', `Bearer ${parsedTokens.token}`);
        }
      } catch (e) {
        console.error('Error parsing tokens:', e);
      }
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor de resposta
api_characters.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  templates: api_templates,
  sheets: api_sheets,
  characters: api_characters,
};
