import { Router } from "express";
import { telegramWebhook } from "../controllers/telegram.controller.js";

const routerTelegram = Router()

routerTelegram.post('/webhook', telegramWebhook)

export default routerTelegram