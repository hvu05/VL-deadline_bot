import express from "express";
import routesTelegram from "./src/routes/telegram.route.js";
import dotenv from "dotenv";
import { connectMongo } from "./src/configs/mongodb.js";
dotenv.config();
const app = express();
app.use(express.json());


app.use('/telegram', routesTelegram)

await connectMongo();
// ====== START SERVER ======
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
