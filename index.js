const mdcomputers = require('./scrapers/mdcomputers.js');
const vedantcomputers = require('./scrapers/vedantcomputers.js');
const primeabgb = require('./scrapers/primeabgb.js');

const searchFunctions = [
    mdcomputers,
    vedantcomputers,
    primeabgb
]


function search(term) {
    let promiseList = [];

    searchFunctions.forEach(searcher => {
        promiseList.push(searcher(term));
    })

    return Promise.all(promiseList)
        .then(lists => {
            return [].concat(...lists);
        });
}

module.exports = search;