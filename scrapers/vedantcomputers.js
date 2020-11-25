const axios = require('axios');
const cheerio = require('cheerio');

async function search(query) {
    let searchQuery = query.split(' ').map(term => encodeURIComponent(term)).join('+');
    return searchAllPages(searchQuery);
}

async function searchAllPages(searchQuery) {
    let formattedItems = [];
    let response = await axios.get(`https://www.vedantcomputers.com/index.php?route=product/search&search=${searchQuery}&limit=1000`);
    const $ = cheerio.load(response.data);
    let items = $('.product-thumb');
    items.each((index, val) => {
        let img = $('.image', val).find('img').attr('data-src');
        let imgHighRes = img.replace('250x250', '500x500');
        formattedItems.push({
            name: $('.name', val).text().trim(),
            price: $('.price-normal', val).text().trim().replace('₹', '').split(',').join(''),
            url: $('.name', val).find('a').attr('href'),
            img,
            imgHighRes
        });
    });

    return formattedItems;
}

module.exports = search;