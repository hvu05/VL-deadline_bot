import express, { type Request, type Response } from "express";
import type { TelegramUpdate, User } from "../types.js";
import { sendMessage } from "../utils/utils.js";
import UserModel from "../models/telegram.model.js";

export const telegramWebhook = async (
  req: Request<{}, {}, TelegramUpdate>,
  res: Response
) => {
  const update = req.body;

  if (!update.message || !update.message.text) {
    return res.sendStatus(200);
  }

  const chatId = update.message.chat.id;
  const text = update.message.text;

  console.log("📩 Message:", chatId, text);

  const textTrim = text.trim();

  switch (true) {
    // 1️⃣ /start
    case textTrim === "/start": {
      await sendMessage(
        chatId,
        "👋 Chào bạn!\n\n👉 Hãy gửi link LMS của bạn để đăng ký nhận thông báo deadline."
      );
      return res.sendStatus(200);
    }

    // 2️⃣ User gửi link LMS
    case textTrim.startsWith("https://lms."): {
      await UserModel.findOneAndUpdate(
        { chatId },
        { $set: { lmsUrl: textTrim } },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      await sendMessage(
        chatId,
        "✅ Đăng ký thành công!\n\n⏰ Bạn sẽ nhận thông báo deadline mỗi 24h."
      );

      console.log("✅ LMS registered for:", chatId);
      return res.sendStatus(200);
    }

    // 3️⃣ /me
    case textTrim === "/me": {
      const user = await UserModel.findOne({ chatId });
      if (!user) return res.sendStatus(200);

      await sendMessage(
        chatId,
        `👤 Thông tin của bạn:\n
        🆔 ID: ${user._id}
        💬 ChatId: ${chatId}
        👤 Tên: ${user.userName ?? "Chưa đặt"}
        🔗 LMS: ${user.lmsUrl ?? "Chưa có"}
        📢 Nhận thông báo: ${user.isActive ? "Bật" : "Tắt"}`
      );
      return res.sendStatus(200);
    }

    // 4️⃣ /off
    case textTrim === "/off": {
      const user = await UserModel.findOneAndUpdate(
        { chatId },
        { $set: { isActive: false } },
        { new: true }
      );
      if (!user) return res.sendStatus(200);

      await sendMessage(
        chatId,
        "🔕 Bạn đã tắt thông báo deadline.\n\n👉 Gõ **/on** để bật lại."
      );
      return res.sendStatus(200);
    }

    // 5️⃣ /on
    case textTrim === "/on": {
      const user = await UserModel.findOneAndUpdate(
        { chatId },
        { $set: { isActive: true } },
        { new: true }
      );
      if (!user) return res.sendStatus(200);

      await sendMessage(chatId, "🔔 Bạn đã bật lại thông báo deadline.");
      return res.sendStatus(200);
    }

    // 6️⃣ /name <username>
    case textTrim.startsWith("/name "): {
      const username = textTrim.replace("/name", "").trim();

      if (!username) {
        await sendMessage(chatId, "❌ Vui lòng nhập tên.\nVí dụ: `/name Vũ`");
        return res.sendStatus(200);
      }

      await UserModel.findOneAndUpdate(
        { chatId },
        { $set: { username } },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      await sendMessage(
        chatId,
        `✅ Đã cập nhật tên của bạn thành: **${username}**`
      );
      return res.sendStatus(200);
    }

    // 7️⃣ Default
    default: {
      await sendMessage(
        chatId,
        "❓ Mình không hiểu.\n👉 Gõ /start để bắt đầu."
      );
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(200);
};
