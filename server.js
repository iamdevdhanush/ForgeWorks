const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to receive project submissions
app.post('/submit-project', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'submissions.json');

    fs.readFile(filePath, 'utf-8', (err, content) => {
        const existing = err ? [] : JSON.parse(content);
        existing.push({ ...data, date: new Date().toISOString() });

        fs.writeFile(filePath, JSON.stringify(existing, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to save submission' });
            }
            res.json({ message: 'Project submitted successfully' });
        });
    });
});

// Optional: Admin route to view all submissions
app.get('/projects', (req, res) => {
    const filePath = path.join(__dirname, 'submissions.json');
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) return res.status(500).json({ message: 'Error reading data' });
        res.json(JSON.parse(content));
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
