/**
 * Data Service
 * Abstracts API calls and mock data logic
 * Routes requests to either mock data or real API based on configuration
 */

import { apiConfig } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { mockDataExamples, simulateApiDelay } from '../data/mockData';
import type { BaseEntity } from '../types';

class DataService {
  /**
   * Fetch data with automatic mock/real API switching
   */
  async fetchData<T extends BaseEntity>(endpoint: string): Promise<T[]> {
    if (apiConfig.useMockData) {
      // Simulate API call with mock data
      await simulateApiDelay(500);
      console.log(`[MOCK] Fetching from ${endpoint}`);
      return mockDataExamples as any;
    }

    try {
      console.log(`[API] Fetching from ${endpoint}`);
      return await apiClient.get<T[]>(endpoint);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Fetch single item
   */
  async fetchItem<T extends BaseEntity>(endpoint: string, id: string): Promise<T> {
    if (apiConfig.useMockData) {
      await simulateApiDelay(300);
      const item = mockDataExamples.find((item) => item.id === id);
      if (!item) throw new Error('Item not found');
      return item as any;
    }

    return apiClient.get<T>(`${endpoint}/${id}`);
  }

  /**
   * Create item
   */
  async createItem<T extends BaseEntity>(endpoint: string, data: any): Promise<T> {
    if (apiConfig.useMockData) {
      await simulateApiDelay(500);
      const newItem = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      console.log(`[MOCK] Created item:`, newItem);
      return newItem as any;
    }

    return apiClient.post<T>(endpoint, data);
  }

  /**
   * Update item
   */
  async updateItem<T extends BaseEntity>(
    endpoint: string,
    id: string,
    data: any
  ): Promise<T> {
    if (apiConfig.useMockData) {
      await simulateApiDelay(500);
      const updatedItem = {
        ...data,
        id,
        updatedAt: new Date().toISOString(),
      };
      console.log(`[MOCK] Updated item:`, updatedItem);
      return updatedItem as any;
    }

    return apiClient.put<T>(`${endpoint}/${id}`, data);
  }

  /**
   * Delete item
   */
  async deleteItem(endpoint: string, id: string): Promise<void> {
    if (apiConfig.useMockData) {
      await simulateApiDelay(300);
      console.log(`[MOCK] Deleted item with id: ${id}`);
      return;
    }

    await apiClient.delete(`${endpoint}/${id}`);
  }
}

export const dataService = new DataService();
export default dataService;
