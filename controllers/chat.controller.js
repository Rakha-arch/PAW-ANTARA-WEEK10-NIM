const { generateResponse } = require('../services/gemini.service');
const { responseSuccess, responseError } = require('../utils/response');
const { Chat } = require('../models');

// POST /api/chat
exports.sendMessage = async (req, res) => {
  try {
    const { message, saveHistory } = req.body; // Menggunakan field 'message' sesuai README
    const userId = req.session?.user?.id || null; // Mengambil ID user dari session jika login

    if (!message) {
      return responseError(res, 400, 'Pesan tidak boleh kosong');
    }

    const aiReply = await generateResponse(message);

    // Simpan riwayat jika disetujui (saveHistory === true)
    if (saveHistory) {
      await Chat.bulkCreate([
        { user_id: userId, sender: 'user', message },
        { user_id: userId, sender: 'ai', message: aiReply },
      ]);
    }

    return responseSuccess(res, 200, 'Berhasil mendapatkan respon AI', {
      reply: aiReply,
      historySaved: Boolean(saveHistory),
    });
  } catch (error) {
    return responseError(res, 500, error.message || 'Gagal memproses pesan');
  }
};

// GET /api/chat/history
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.session?.user?.id || null;

    const history = await Chat.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'ASC']],
    });

    return responseSuccess(res, 200, 'Berhasil mengambil riwayat percakapan', history);
  } catch (error) {
    return responseError(res, 500, error.message || 'Gagal mengambil riwayat');
  }
};