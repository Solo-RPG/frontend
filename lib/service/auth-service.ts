// lib/service/auth-service.ts
import {api} from '../axios';
import { ApiResponse } from './types';

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

class AuthService {
  private readonly AUTH_TOKENS_KEY = '@solo-rpg:tokens';
  private readonly USER_INFO_KEY = '@solo-rpg:user';

  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await api.characters.post('/auth/login', { email, password });
    this.setAuthTokens(response.data.tokens);
    await this.fetchAndSaveUserInfo();
    return response.data;
  }

  async getCurrentUser(): Promise<UserInfo> {
    const response = await api.characters.get('/users/me');
    return response.data;
  }

  private async fetchAndSaveUserInfo(): Promise<void> {
    const userInfo = await this.getCurrentUser();
    this.setUserInfo(userInfo);
  }

  private setAuthTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.AUTH_TOKENS_KEY, JSON.stringify(tokens));
  }

  private setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  getAuthTokens(): AuthTokens | null {
    const tokens = localStorage.getItem(this.AUTH_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  getUserInfo(): UserInfo | null {
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKENS_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
  }
}

export const authService = new AuthService();