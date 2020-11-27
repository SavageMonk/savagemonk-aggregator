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
    let response = await axios.get(`${PROXY_URL}https://www.primeabgb.com/page/${page}/?post_type=product&s=${searchQuery}`);
    const $ = cheerio.load(response.data);
    let items = $('li.product-item');
    // console.log(items);
    items.each((index, val) => {
        // console.log($('span.price', val).find('ins').text().trim());
        let price = Number($('span.price', val).find('ins').text().trim().split(',').join('').replace('₹',''));
        let oldPrice = Number($('span.price', val).find('del').text().trim().split(',').join('').replace('₹',''));
        let discountPercentage = ((oldPrice - price)/oldPrice) * 100;
        // console.log({index, price});
        formattedItems.push({
            name: $('h3.product-name', val).text().trim(),
            price,
            discountPercentage: (discountPercentage==0?false:discountPercentage),
            url: $('h3.product-name', val).find('a').attr('href').trim(),
            img: $('img.attachment-post-thumbnail', val).attr('src')
        });
    });


    if (page == 1) {
        let pagesUl = $('ul.page-numbers');
        let noOfPages;
        
        try {
            noOfPages = pagesUl.find('a.page-numbers').not('.next').last().text();
        } catch (err) {
            noOfPages = 1;
        }

        noOfPages = String(noOfPages).length==0?1:noOfPages;
        return { formattedItems, noOfPages };
    } else {
        return formattedItems;
    }
}

// search("3700x");

module.exports = search;
