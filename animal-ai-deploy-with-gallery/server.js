const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(uploadDir));
app.use(express.static(__dirname));

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ message: 'アップロード完了', path: '/uploads/' + req.file.filename });
});

app.get('/list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: '画像一覧の取得に失敗しました' });
    }
    res.json(files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f)));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
