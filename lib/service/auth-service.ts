// lib/service/auth-service.ts
import {api} from '../axios';
import { ApiResponse } from './types'

interface AuthTokens {
  token: string;
  refreshToken: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos conforme necessário
}

interface AuthResponse {
  token: string;
  refreshToken?: string;
  user?: UserInfo; // Adicione se o backend retornar
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos que o backend retornar
}

class AuthService {
  private readonly AUTH_TOKENS_KEY = '@solo-rpg:tokens';
  private readonly USER_INFO_KEY = '@solo-rpg:user';

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.characters.post('/api/auth/register', {
        name, email, password
      });
      
      const login = await api.characters.post('/api/auth/login', { email, password });

      if (login.data.tokens) {
        this.setAuthTokens(login.data.tokens);
        await this.fetchAndSaveUserInfo();
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.characters.post('/api/auth/login', { email, password });
      
      // Verificação robusta da resposta
      if (!response.data?.token) {
        throw new Error('Resposta de login inválida - token não encontrado');
      }

      // Armazena o token corretamente
      this.setAuthTokens({
        token: response.data.token,
        refreshToken: response.data.refreshToken || '' // Se não tiver refresh token
      });

      await this.fetchAndSaveUserInfo();
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  private setAuthTokens(tokens: AuthTokens): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.AUTH_TOKENS_KEY, JSON.stringify(tokens));
    }
  }

  async getCurrentUser(): Promise<UserInfo> {
    try {
      const tokens = this.getAuthTokens();
      if (!tokens?.token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.characters.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${tokens.token}`
        }
      });

      if (!response.data) {
        throw new Error("Dados do usuário não encontrados");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      this.logout(); // Limpa os tokens em caso de erro
      throw error;
    }
  }

  private async fetchAndSaveUserInfo(): Promise<void> {
    const userInfo = await this.getCurrentUser();
    this.setUserInfo(userInfo);
  }

  private setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  getAuthTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null; // ← Adicione esta verificação
    const tokens = localStorage.getItem(this.AUTH_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  getUserInfo(): UserInfo | null {
    if (typeof window === 'undefined') return null; // ← Adicione esta verificação
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKENS_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
  }
}

export const authService = new AuthService();