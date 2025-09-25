const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface Story {
  id?: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  share_id?: string;
  user_id?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name?: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return this.handleResponse<{ token: string; user: User }>(response);
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse<{ token: string; user: User }>(response);
  }

  async requestPasswordReset(email: string) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_URL}/auth/reset-password/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async verifyEmail(token: string) {
    const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
      method: 'GET'
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async verifyToken() {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ user: User }>(response);
  }

  // Story endpoints
  async getStories() {
    const response = await fetch(`${API_URL}/api/stories`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Story[]>(response);
  }

  async getStory(id: string) {
    const response = await fetch(`${API_URL}/api/stories/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Story>(response);
  }

  async saveStory(story: Story) {
    const response = await fetch(`${API_URL}/api/stories`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(story)
    });
    return this.handleResponse<Story>(response);
  }

  async deleteStory(id: string) {
    const response = await fetch(`${API_URL}/api/stories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async shareStory(id: string) {
    const response = await fetch(`${API_URL}/api/stories/${id}/share`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Story & { shareUrl: string }>(response);
  }

  async getSharedStory(shareId: string) {
    const response = await fetch(`${API_URL}/api/stories/shared/${shareId}`);
    return this.handleResponse<Story>(response);
  }
}

export const api = new ApiService();

// Story service that matches the Supabase interface but uses our backend
export const storyService = {
  async saveStory(story: Story) {
    return api.saveStory(story);
  },

  async getStories() {
    return api.getStories();
  },

  async getStory(id: string) {
    return api.getStory(id);
  },

  async getSharedStory(shareId: string) {
    return api.getSharedStory(shareId);
  },

  async deleteStory(id: string) {
    await api.deleteStory(id);
  },

  async shareStory(id: string) {
    const result = await api.shareStory(id);
    return result;
  }
};