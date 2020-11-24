const axios = require('axios');
const cheerio = require('cheerio');

async function search(query) {
    searchQuery = query.split(" ").map(term => encodeURIComponent(term)).join('+');
    return searchAllPages(searchQuery);
}

async function searchAllPages(query, page) {
    let { formattedItems, noOfPages } = await searchSinglePage(query, 1);

    if (noOfPages > 1) {
        promisesList = [];

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
    response = await axios.get(`https://www.primeabgb.com/page/${page}/?post_type=product&taxonomy=product_cat&s=${searchQuery}`);
    const $ = cheerio.load(response.data);
    items = $('.product-inner')
    items.each((index, val) => {
        formattedItems.push({
            name: $('.product-name', val).text().trim(),
            price: $('.price', val).text().trim(),
            discountPercentage: $('.flashs', val).text().trim(),
            url: $('.thumb-inner', val).find('a').attr('href'),
            img: $('.product-thumb', val).find('img').attr('src'),
        })
    });

    let noOfPages = $('.page-numbers .current').text();

    if(page == 1) {
        return { formattedItems, noOfPages };
    } else {
        return formattedItems;
    }

    return formattedItems
}

module.exports = search;
