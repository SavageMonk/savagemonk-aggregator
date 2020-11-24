//Since vedant computers didnt use page numbers in a typical sense and rather used no. of items displayed
//I implemented only the search all pages shit

const axios = require('axios');
const cheerio = require('cheerio');

async function search(query) {
    searchQuery = query.split(" ").map(term => encodeURIComponent(term)).join('+');
    return searchAllPages(searchQuery);
}

async function searchAllPages(searchQuery) {
    let formattedItems = [];
    response = await axios.get(`https://www.vedantcomputers.com/index.php?route=product/search&search=${searchQuery}&limit=100`);
    const $ = cheerio.load(response.data);
    items = $('.product-thumb')
    items.each((index, val) => {
        formattedItems.push({
            name: $('.name', val).text().trim(),
            price: $('.price-normal', val).text().trim(),
            url: $('.name', val).find('a').attr('href'),
            img: $('.image', val).find('img').attr('data-src')
        })
    });

    return formattedItems
}

module.exports = search;