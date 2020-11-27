const axios = require('axios');
const cheerio = require('cheerio');
const { PROXY_URL } = require('../config');

async function search(query) {
    let searchQuery = query.split(' ').map(term => encodeURIComponent(term)).join('+');
    return searchAllPages(searchQuery);
}

async function searchAllPages(query) {
    let { formattedItems, noOfPages } = await searchSinglePage(query, 1);

    if (noOfPages > 1) {
        let promisesList = [];

        for (let i = 2; i <= noOfPages; i++) {
            promisesList.push(searchSinglePage(query, i));
        }

        return Promise.all(promisesList)
            .then(itemsArray => {
                itemsArray.forEach(items => {
                    formattedItems.push(...items);
                });
                return formattedItems;
            });

    } else {
        return formattedItems;
    }


}

async function searchSinglePage(searchQuery, page) {
    let formattedItems = [];
    let response;
    try {
        response = await axios.get(`${PROXY_URL}https://mdcomputers.in/index.php?category_id=0&route=product%2Fsearch&search=${searchQuery}&page=${page}`);
    } catch (err) {
        console.error(err);
    }
    const $ = cheerio.load(response.data);
    let items = $('.product-item-container');
    items.each((index, val) => {
        let img = 'http:' + $('.product-image-container', val).find('img').attr('data-src');
        let imgHighRes = img.replace('180x180', '600x600');
        let discount = $('.label-sale', val).text().trim().replace('-','').replace('%','');
        formattedItems.push({
            name: $('h4', val).text().trim(),
            price: $('.price-new', val).text().trim().replace('₹', '').replace(',', ''),
            discountPercentage: discount.includes('%') ? discount : false,
            url: $('.product-image-container', val).find('a').attr('href').split('?')[0],
            img,
            imgHighRes
        });
    });


    if (page == 1) {
        let noOfPages;
        try {
            noOfPages = $('.product-filter-bottom .text-right').text().trim().split('(')[1].split(' ')[0];
        } catch {
            noOfPages = 1;
        }
        return { formattedItems, noOfPages };
    } else {
        return formattedItems;
    }
}

module.exports = search;
