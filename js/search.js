var pager = {};

function prevPage() {
    pager.prevPage();
    bindList();
}

function nextPage() {
    pager.nextPage();
    bindList();
}

function updateResults(results) {
    pager.items = results;
    pager.itemsPerPage = 20;
    pagerInit();
    bindList();
}

function bindList() {
    var pgItems = pager.pagedItems[pager.currentPage];
    $("#searchResults").empty();
    for (var i = 0; i < pgItems.length; i++) {
        var item = $('<a href="/product.html?id=' + pgItems[i].id + '" class="list-group-item">' + pgItems[i].title + '</a>');
        $("#searchResults").append(item);
    }
}

function pagerInit() {
    pager.pagedItems = [];
    pager.currentPage = 0;
    if (pager.itemsPerPage === undefined) {
        pager.itemsPerPage = 5;
    }
    pager.prevPage = function() {
        if (pager.currentPage > 0) {
            pager.currentPage--;
        }
    };
    pager.nextPage = function() {
        if (pager.currentPage < pager.pagedItems.length - 1) {
            pager.currentPage++;
        }
    };
    init = function() {
        for (var i = 0; i < pager.items.length; i++) {
            if (i % pager.itemsPerPage === 0) {
                pager.pagedItems[Math.floor(i / pager.itemsPerPage)] = [pager.items[i]];
            } else {
                pager.pagedItems[Math.floor(i / pager.itemsPerPage)].push(pager.items[i]);
            }
        }
    };
    init();
}

$(function() {
    var queryStringRegex = /[\?&]q=([^&]+)/g;
    var matches = queryStringRegex.exec(window.location.search);
    if (matches && matches[1]) {
        var value = decodeURIComponent(matches[1].replace(/\+/g, '%20'));

        $.getJSON('/search.json').then(function(posts) {

            var options = {
                shouldSort: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "id",
                    "title"
                ]
            };

            var fuse = new Fuse(posts, options);

            var results = fuse.search(value);

            updateResults(results);
        });
    }
});