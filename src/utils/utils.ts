import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
// ====== CONFIG ======
const BOT_TOKEN = process.env.BOT_TOKEN || "PASTE_BOT_TOKEN_HERE";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;


// ====== SEND MESSAGE ======
export async function sendMessage(chatId: number, text: string): Promise<void> {
    console.log('API: ', TELEGRAM_API)
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
    });
  }
  