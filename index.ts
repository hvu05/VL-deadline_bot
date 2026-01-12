import express from "express";
import axios from "axios";
import routesTelegram from "./src/routes/telegram.route.js";
import dotenv from "dotenv";
import { connectMongo } from "./src/configs/mongodb.js";
dotenv.config();

const app = express();
app.use(express.json());

// ======================= Set webhook =======================
const WEBHOOK_URL = `${process.env.RENDER_EXTERNAL_URL}/telegram/webhook`;

await axios.get(
  `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook`,
  { params: { url: WEBHOOK_URL } }
);

console.log("✅ Webhook set to:", WEBHOOK_URL);
//================================ end ==============================

app.use('/telegram', routesTelegram)

await connectMongo();
// ====== START SERVER ======
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
