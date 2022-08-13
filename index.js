// Instantiate package requirements
const PORT = 3001 || process.env.PORT;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

// Call express function for usage
const app = express();

const espn = []

app.get('/', function (req, res) {
    res.send("All about the Lions")

})


app.get('/bio', (req, res) => {
    axios.get('https://www.espn.com/nfl/team/_/name/det/detroit-lions')
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html)

            $(`article > div > a[class="AnchorLink"]`, html).each(function () {
                const title = $(this).attr('aria-label');
                const url = $(this).attr('href');
                characters.push({
                    title,
                    url
                })
            })
            res.json(characters);
        }).catch((err) => console.log(err))

})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));