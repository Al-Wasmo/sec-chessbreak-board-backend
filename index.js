const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

// Route to get players by tournament ID
app.get('/tournament/:id/:round', async (req, res) => {
    const { id , round } = req.params;
    console.log(id)
    const url = `https://swissonlinetournament.com/Tournament/Details/${id}?round=${round}`;

    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    };

    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        const players = [];
        $('tr.result-row').each((i, row) => {
            const tds = $(row).find('td').map((i, el) => $(el).text().trim()).get();
            const player1 = tds[1];
            const player2 = tds[tds.length - 2];
            players.push({ player1, player2 });
        });

        res.json(players);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tournament data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
