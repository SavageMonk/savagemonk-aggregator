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
<<<<<<< HEAD
=======


>>>>>>> ade0152c9247a3151fb9531f32f29d6eef33a1cc
}

async function searchSinglePage(searchQuery, page) {
    let formattedItems = [];
<<<<<<< HEAD
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
=======
    response = await axios.get(`https://www.primeabgb.com/page/${page}/?post_type=product&s=${searchQuery}`);
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
            discountPercentage,
            url: $('h3.product-name', val).find('a').attr('href').trim(),
            img: $('img.attachment-post-thumbnail', val).attr('src')
        })
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
>>>>>>> ade0152c9247a3151fb9531f32f29d6eef33a1cc
        return { formattedItems, noOfPages };
    } else {
        return formattedItems;
    }
<<<<<<< HEAD

    return formattedItems
}

=======
}

// search("3700x");

>>>>>>> ade0152c9247a3151fb9531f32f29d6eef33a1cc
module.exports = search;
