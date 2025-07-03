import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../constants/api';
import { getToken } from './authStorage';
import { Platform } from 'react-native';

/**
 * ifconfig | grep inet
 * ipconfig getifaddr en0
 * Centralized API service that handles all HTTP requests
 * Manages JWT authentication in a single place
 */
class ApiService {
  private instance: AxiosInstance;
  private token: string | null = null;
  
  constructor() {
    const baseURL = API_URL;
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds
    });
    
    this.loadToken();

    // Request interceptor for adding auth token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        console.log('Making request to:', (config.baseURL||'') + (config.url||''));
        // Add authorization header with JWT if available
        if (this.token) {
          console.log("Adding auth token", this.token);
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error: AxiosError): Promise<AxiosError> => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor for handling common errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        console.log('Response received:', response.status, response.config.url);
        return response;
      },
      (error: AxiosError): Promise<AxiosError> => {
        console.error('Response error:', error.response?.status, error.message, error.config?.url);
        // Handle 401 Unauthorized responses
        if (error.response && error.response.status === 401) {
          // Could dispatch a logout action or redirect to login
          console.error('Authentication error');
        }
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Set the JWT token for all subsequent requests
   */
  public setToken(token: string | null): void {
    this.token = token;
  }
  
  /**
   * Clear the JWT token
   */
  public clearToken(): void {
    this.token = null;
  }
  
  /**
   * GET request
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T>(url, config)
      .then(response => response.data);
  }
  
  /**
   * POST request
   */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config)
      .then(response => response.data);
  }
  
  /**
   * PUT request
   */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config)
      .then(response => response.data);
  }
  
  /**
   * DELETE request
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T>(url, config)
      .then(response => response.data);
  }

  private async loadToken() {
    try {
      this.token = await getToken();
      console.log('Loaded token from storage:', this.token);
    } catch (error) {
      console.error('Failed to load token from storage:', error);
      this.token = null;
    }
  }
  
  /**
   * Get raw Axios instance (use sparingly)
   */
  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create and export a singleton instance
const api = new ApiService();
export default api;
