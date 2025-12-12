const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors'); // import cors

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

app.get('/tournament/:id/:round', async (req, res) => {
    const { id, round } = req.params;

    try {
        const url = `https://swissonlinetournament.com/Tournament/Details/${id}?round=${round}`;
        const headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0"
        };

        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        const players = [];
        $('tr.result-row').each((i, row) => {
            const tds = $(row).find('td').map((i, el) => $(el).text().trim()).get();
            const player1 = tds[1];
            const player2 = tds[tds.length - 2];
            players.push({ player1, player2 });
        });

        // Count number of rounds
        const numberOfRounds = $('a[href*="round="]').length;

        res.json({ numberOfRounds, players });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tournament data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
