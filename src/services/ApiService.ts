import { toast } from "@/components/ui/use-toast";

const BASE_URL = "https://sasyak-backend.onrender.com";

// Types for API responses
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
  managerId?: number;
  phone_number?: string;
}

export interface PaginatedResponse {
  employees: User[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface GetAllUsersResponse {
  employees: User[];
}

// API Error handling
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "An error occurred";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      // If the error response is not JSON, use the text directly
      errorMessage = errorText || errorMessage;
    }
    
    // Show error toast
    toast({
      variant: "destructive",
      title: `Error ${response.status}`,
      description: errorMessage,
    });
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// Get authentication token from localStorage
const getAuthToken = () => {
  const authUser = localStorage.getItem("authUser");
  if (!authUser) return null;
  
  try {
    const parsedAuth = JSON.parse(authUser);
    return parsedAuth.token;
  } catch (e) {
    console.error("Error parsing auth token", e);
    return null;
  }
};

// Headers with authentication
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// API Functions
export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  const response = await fetch(`${BASE_URL}/api/admin/users`, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/admin/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  
  return handleResponse(response);
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  
  return handleResponse(response);
};

export const deleteUser = async (id: number): Promise<string> => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    return handleResponse(response);
  }
  
  return "User deleted successfully";
};

export const getUsersByRole = async (role: string): Promise<GetAllUsersResponse> => {
  const response = await fetch(`${BASE_URL}/api/admin/users/by-role/${role}`, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};

export const getPaginatedUsersByRole = async (
  role: string,
  page = 0,
  size = 10
): Promise<PaginatedResponse> => {
  const response = await fetch(
    `${BASE_URL}/api/admin/users/by-role/${role}/paged?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  
  return handleResponse(response);
};

export const assignManagerToUser = async (userId: number, managerId: number): Promise<User> => {
  const response = await fetch(
    `${BASE_URL}/api/admin/users/${userId}/assign-manager/${managerId}`,
    {
      method: "PUT",
      headers: getHeaders(),
    }
  );
  
  return handleResponse(response);
};

export const removeManagerFromUser = async (userId: number): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/remove-manager`, {
    method: "PUT",
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};

export const getUsersByManager = async (managerId: number): Promise<GetAllUsersResponse> => {
  const response = await fetch(`${BASE_URL}/api/admin/users/manager/${managerId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};

// Login function
export const login = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await handleResponse(response);
  
  // Store auth data in localStorage
  localStorage.setItem(
    "authUser",
    JSON.stringify({
      username: data.name || email,
      email: data.email,
      token: data.token,
      role: data.role,
    })
  );
  
  return data;
};

// Logout function
export const logout = () => {
  localStorage.removeItem("authUser");
  window.location.href = "/login";
};