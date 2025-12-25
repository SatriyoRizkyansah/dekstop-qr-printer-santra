import { TicketData, ApiQueueData, mapApiToTicket } from "../types/ticket";

// API Base URL - Ganti dengan URL API yang sebenarnya
const API_BASE_URL = "https://api.wisuda.unpam.ac.id";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Service untuk fetch data antrian dari API
 * Nanti tinggal uncomment dan sesuaikan dengan struktur API yang sebenarnya
 */
export class QueueApiService {
  /**
   * Get next queue number from API
   */
  static async getNextQueue(serviceType: string): Promise<ApiResponse<ApiQueueData>> {
    try {
      // TODO: Uncomment ketika API sudah ready
      /*
      const response = await fetch(`${API_BASE_URL}/api/queue/next`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ service_type: serviceType })
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: data
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to get queue'
        };
      }
      */

      // Mock data untuk development
      return {
        success: true,
        data: {
          queue_number: `A${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
          department: "RS Wisuda UNPAM",
          service_type: serviceType,
          created_at: new Date()
            .toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(",", ""),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get queue details by ID
   */
  static async getQueueById(queueId: string): Promise<ApiResponse<ApiQueueData>> {
    try {
      // TODO: Uncomment ketika API sudah ready
      /*
      const response = await fetch(`${API_BASE_URL}/api/queue/${queueId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: data
        };
      } else {
        return {
          success: false,
          error: data.message || 'Queue not found'
        };
      }
      */

      // Mock data
      return {
        success: true,
        data: {
          queue_number: queueId,
          department: "RS UNPAM",
          service_type: "Pemeriksaan Umum",
          created_at: new Date().toLocaleString("id-ID"),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get all queues (for dashboard/monitoring)
   */
  static async getAllQueues(filters?: { date?: string; status?: string; serviceType?: string }): Promise<ApiResponse<ApiQueueData[]>> {
    try {
      // TODO: Uncomment ketika API sudah ready
      /*
      const params = new URLSearchParams();
      if (filters?.date) params.append('date', filters.date);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.serviceType) params.append('service_type', filters.serviceType);

      const response = await fetch(`${API_BASE_URL}/api/queue?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: data.queues
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to fetch queues'
        };
      }
      */

      // Mock data
      const mockQueues: ApiQueueData[] = Array.from({ length: 10 }, (_, i) => ({
        queue_number: `A${String(i + 1).padStart(3, "0")}`,
        department: "RS Wisuda UNPAM",
        service_type: i % 2 === 0 ? "Pemeriksaan Umum" : "Pemeriksaan Khusus",
        created_at: new Date().toLocaleString("id-ID"),
      }));

      return {
        success: true,
        data: mockQueues,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Update queue status
   */
  static async updateQueueStatus(queueId: string, status: "waiting" | "called" | "serving" | "completed" | "cancelled"): Promise<ApiResponse<void>> {
    try {
      // TODO: Uncomment ketika API sudah ready
      /*
      const response = await fetch(`${API_BASE_URL}/api/queue/${queueId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: 'Status updated successfully'
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to update status'
        };
      }
      */

      // Mock success
      return {
        success: true,
        message: "Status updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Authenticate user
   */
  static async login(username: string, password: string): Promise<ApiResponse<{ token: string }>> {
    try {
      // TODO: Uncomment ketika API sudah ready
      /*
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        return {
          success: true,
          data: { token: data.token }
        };
      } else {
        return {
          success: false,
          error: data.message || 'Login failed'
        };
      }
      */

      // Mock login - accept any username/password for development
      const mockToken = `mock_token_${username}_${Date.now()}`;
      localStorage.setItem("auth_token", mockToken);

      return {
        success: true,
        data: { token: mockToken },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

/**
 * Helper function untuk convert API data ke TicketData
 */
export function prepareTicketForPrint(apiData: ApiQueueData): TicketData {
  return mapApiToTicket(apiData);
}
