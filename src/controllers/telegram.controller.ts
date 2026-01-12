import express, { type Request, type Response } from "express";
import type { TelegramUpdate, User } from "../types.js";
import { sendMessage } from "../utils/utils.js";
import UserModel from "../models/telegram.model.js";

export const telegramWebhook = async (req: Request<{}, {}, TelegramUpdate>, res: Response) => {


    const update = req.body;

    if (!update.message || !update.message.text) {
        return res.sendStatus(200);
    }

    const chatId = update.message.chat.id;
    const text = update.message.text;

    console.log("📩 Message:", chatId, text);

    // 1️⃣ /start
    if (text === "/start") {
        await sendMessage(
            chatId,
            "👋 Chào bạn!\n\n👉 Hãy gửi link LMS của bạn để đăng ký nhận thông báo deadline."
        );
        return res.sendStatus(200);
    }

    // 2️⃣ User gửi link LMS
    if (text.startsWith("https://lms.")) {
        await UserModel.findOneAndUpdate(
            { chatId },                 // điều kiện tìm
            { lmsUrl: text },           // dữ liệu cập nhật
            {
                upsert: true,             // chưa có thì tạo mới
                new: true,                // trả về doc sau khi update
                setDefaultsOnInsert: true
            }
        );

        await sendMessage(
            chatId,
            "✅ Đăng ký thành công!\n\n⏰ Bạn sẽ nhận thông báo deadline mỗi 24h."
        );

        console.log("✅ LMS registered for:", chatId);
        return res.sendStatus(200);
    }

    if (text === '/me'){
        const user = await UserModel.findOne({ chatId });
        if (!user) {
            return res.sendStatus(200);
        }
        await sendMessage(
            chatId,
            `👤 Thông tin của bạn:\n\n ID: ${user._id} - ${chatId} \n\n 🔗 LMS: ${user.lmsUrl}`
        );
        return res.sendStatus(200);
    }
    // 3️⃣ Trường hợp khác
    await sendMessage(
        chatId,
        "❓ Mình không hiểu.\nGõ /start để bắt đầu."
    );

    return res.sendStatus(200);
}