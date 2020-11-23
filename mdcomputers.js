const axios = require('axios');
const cheerio = require('cheerio');

async function search(query) {
    searchQuery = query.split(" ").map(term=>encodeURIComponent(term)).join('+');
    try {
        let formattedItems = [];
        response = await axios.get(`https://mdcomputers.in/index.php?category_id=0&route=product%2Fsearch&search=${searchQuery}`);
        const $ = cheerio.load(response.data);
        items = $('.product-item-container');
        items.each((index, val)=> {
            formattedItems.push({
                name: $('h4', val).text().trim(),
                price: $('.price-new', val).text().trim(),
                discountPercentage: $('.label-sale', val).text().trim()
            })
        });
        
        return formattedItems;
    } catch (err) {
        console.error(err);
    }
}

module.exports = search;
