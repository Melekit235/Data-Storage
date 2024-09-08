const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

module.exports = (upload) => {
  // POST /api/upload - Загрузка файла
  router.post('/upload', upload.single('file'), fileController.uploadFile);

  // GET /api/files - Получение списка загруженных файлов
  router.get('/files', fileController.getFiles);

  // DELETE /api/files/:filename - Удаление файла
  router.delete('/files/:filename', fileController.deleteFile);

  // Маршрут для скачивания файла
  router.get('/files/download/:filename', fileController.downloadFile);

  return router;
};
