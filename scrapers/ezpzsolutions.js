const axios = require('axios');
const cheerio = require('cheerio');

async function search(query) {
    let searchQuery = query.split(' ').map(term => encodeURIComponent(term)).join('+');
    return searchAllPages(searchQuery);
}

async function searchAllPages(searchQuery) {
    let formattedItems = [];
    let response = await axios.get(`https://ezpzsolutions.in/?count=1000&paged=&s=${searchQuery}&post_type=product&product_cat=0`);
    const $ = cheerio.load(response.data);
    let items = $('.product-inner');
    items.each((index, val) => {
        let img = $('.inner.img-effect', val).find('img').attr('data-src');
        formattedItems.push({
            name: $('.woocommerce-loop-product__title', val).text(),
            price: $('.woocommerce-Price-amount', val).text().trim().replace('₹', '').split(',').join(''),
            url: $('.product-image', val).find('a').attr('href'),
            img,
        });
    });

    return formattedItems;
}

module.exports = search;