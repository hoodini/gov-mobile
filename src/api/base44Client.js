import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "686e6b689d0f3f44656f376f", 
  requiresAuth: true // Ensure authentication is required for all operations
});
