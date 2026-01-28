/**
 * API Configuration
 * Switches between mock data and real API based on environment variables
 */

export interface ApiConfig {
  useMockData: boolean;
  baseUrl: string;
  timeout: number;
}

const getApiConfig = (): ApiConfig => {
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  
  return {
    useMockData,
    baseUrl: useMockData 
      ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      : import.meta.env.VITE_AZURE_API_URL || 'https://your-azure-function-url.azurewebsites.net/api',
    timeout: 30000, // 30 seconds
  };
};

export const apiConfig = getApiConfig();
export default apiConfig;
