import { Router } from "express";
import { telegramWebhook } from "../controllers/telegram.controller.js";

const routerTelegram = Router()

routerTelegram.post('/webhook', telegramWebhook)
routerTelegram.get('/test', (req, res) => {res.send('Hello World')})

export default routerTelegram