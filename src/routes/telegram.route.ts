import { Router } from "express";
import { telegramWebhook } from "../controllers/telegram.controller.js";

const routerTelegram = Router()

routerTelegram.post('/webhook', telegramWebhook)
routerTelegram.get('/check', (req, res) => res.status(200).send("OK"))

export default routerTelegram