// ====== TYPES ======
export interface User {
    lmsUrl: string;
  }
  
export interface TelegramMessage {
    chat: {
      id: number;
    };
    text?: string;
  }
  
export interface TelegramUpdate {
    message?: TelegramMessage;
  }