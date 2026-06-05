export interface LeadPayload {
  email: string;
}

export interface LeadResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}
