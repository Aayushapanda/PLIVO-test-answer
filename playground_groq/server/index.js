const express = require('express');
const multer = require('multer');
const { execSync } = require('child_process');
const path = require('path');
const upload = multer({ dest: '../uploads/' });
const app = express();
app.use(express.json());

app.post('/api/audio', upload.single('file'), (req, res) => {
    const filepath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const output = execSync(`python3 /app/worker/audio_task.py ${filepath}`);
    res.send(output.toString());
});

app.listen(4000, () => console.log('Server on 4000'));
