import axios from 'axios';
import 'dotenv/config';

// Interfaces for Facebook API responses
interface FacebookAPIResponse {
  id: string;
  name: string;
  last_name: string;
}

// Interface for Facebook API error responses
interface FacebookErrorResponse {
  error: {
    message: string; 
    type: string; 
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

// Custom error class for handling Facebook API errors
class FacebookAPIError extends Error {
  errorCode: number;
  errorSubcode?: number;
  fbtraceId: string;

  constructor({ message, code, error_subcode, fbtrace_id }: FacebookErrorResponse['error']) {
    super(message);
    this.name = "FacebookAPIError";
    this.errorCode = code;
    this.errorSubcode = error_subcode;
    this.fbtraceId = fbtrace_id;
  }
}

// Function to fetch user info from Facebook API
export const getUserInfo = async (accessToken: string): Promise<FacebookAPIResponse | null> => {
  try {
    const url = `https://graph.facebook.com/v19.0/me?fields=id,name,last_name&access_token=${accessToken}`;
    const response = await axios.get<FacebookAPIResponse | FacebookErrorResponse>(url);
    
    if ('error' in response.data) {
      throw new FacebookAPIError(response.data.error);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as FacebookErrorResponse;
      throw new FacebookAPIError(errorData.error);
    }

    console.error('Error:', error);
    return null;
  }
};

// Main function to fetch user info at regular intervals
let requestInterval = 2000; // Initial request interval

const main = async () => {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('Facebook access token is missing.');
    return;
  }

  // Function to fetch user info at regular intervals
  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfo(accessToken);
      console.log('User Info:', userInfo);
      requestInterval = 2000; // Reset request interval on success
    } catch (error) {
      if (error instanceof FacebookAPIError && [4, 17].includes(error.errorCode)) {
        requestInterval = Math.min(requestInterval * 1.5, 60000); // Exponential backoff with cap of 60 seconds
        console.log(`Rate limit exceeded, retrying in ${requestInterval / 1000} seconds.`);
      } else {
        console.error('Error fetching user info:', error instanceof Error ? error.message : String(error));
      }
    } finally {
      setTimeout(fetchUserInfo, requestInterval); // Schedule next request
    }
  };

  fetchUserInfo();
};

main();
