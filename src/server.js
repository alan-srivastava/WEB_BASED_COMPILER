const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure the compiler is found
console.log('Checking compiler path...');
require('child_process').exec('E:\\mingw64\\bin\\g++.exe --version', (err) => {
    if (err) {
        console.error('Compiler not found at E:\\mingw64\\bin\\g++.exe');
        console.error('Please verify your MinGW installation path');
    } else {
        console.log('Compiler verified at E:\\mingw64\\bin\\g++.exe');
    }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Handle Windows line endings
app.use((req, res, next) => {
    if (req.body.code) {
        req.body.code = req.body.code.replace(/\r\n/g, '\n');
    }
    next();
});

// Compiler endpoint
app.post('/compile', async (req, res) => {
    try {
        const { code } = req.body;
        const result = await require('./compiler').compileAndRun(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Using g++ from E:\\mingw64\\bin`);
});