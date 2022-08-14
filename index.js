// Instantiate package requirements
const PORT = 3001 || process.env.PORT;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

// Call express function for usage
const app = express();

const sources = [

    {
        name: "detroitlions.com",
        address: "https://www.detroitlions.com/news",
        filter: '',
        link: ''
    },
    {
        name: "detroitfreepress",
        address: "https://www.freep.com/sports/lions",
        filter: 'a[href*=/story/]',
        link: 'https://www.freep.com/sports/lions'
    },
    {
        name: "sportsillustrated",
        address: "https://www.si.com/nfl/team/detroit-lions",
        filter: 'phoenix-super-link',
        link: ''
    },
    {
        name: "espn",
        address: "https://www.espn.com/nfl/team/_/name/det/detroit-lions",
        filter: 'a[href*=/story/]',
        link: "https://www.espn.com"
    },
    {
        name: "foxsports",
        address: "https://www.foxsports.com/nfl/detroit-lions-team",
        filter: 'a[href*=article]',
        link: ""
    }
];
const articles = []

function sourceFilters() {
    let filters = []
    sources.forEach(s => {
        if (s.filter) {
            filters.push(s.filter)
        }
    })
    filters = filters.join(", ")
    return filters;
}


//console.log(filters());

sources.forEach(s => {

    axios.get(s.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $(`${sourceFilters()}`, html).each(function () {

                const title = $(this).text();
                const url = $(this).attr('href');


                if (url.startsWith('/')) {

                    articles.push({
                        title,
                        url: s.link + url,
                        source: s.name

                    })
                } else {
                    articles.push({
                        title,
                        url: url,
                        source: s.name

                    })

                }
            })

        })
})


app.get('/', function (req, res) {
    res.send("All about the Lions")

})


app.get('/news', (req, res) => {
    res.json(articles);
})

app.get('/news/:sourceId', async (req, res) => {
    const sourceId = req.params.sourceId

    const sorAddress = sources.filter(sor => sor.name == sourceId)[0].address
    const sorlink = sources.filter(sor => sor.name == sourceId)[0].link
    const sorFilter = sources.filter(sor => sor.name == sourceId)[0].filter

    axios.get(sorAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            const specificSources = []

            $(`${sorFilter}`, html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                if (url.startsWith('/')) {
                    specificSources.push({
                        title,
                        url: sorlink + url,
                        source: sourceId
                    })
                } else {
                    specificSources.push({
                        title,
                        url: url,
                        source: sourceId
                    }
                    )
                }
                res.json(specificSources)
            }).catch(err => console.log(err))
        })
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));