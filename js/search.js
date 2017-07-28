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
    if (pgItems == undefined) {
        return;
    }
    for (var i = 0; i < pgItems.length; i++) {
        var item = $('<a href="product.html?id=' + pgItems[i].id + '" class="list-group-item">' + pgItems[i].title + '</a>');
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
    for (var i = 0; i < pager.items.length; i++) {
        if (i % pager.itemsPerPage === 0) {
            pager.pagedItems[Math.floor(i / pager.itemsPerPage)] = [pager.items[i]];
        } else {
            pager.pagedItems[Math.floor(i / pager.itemsPerPage)].push(pager.items[i]);
        }
    }
}

var fuse;

function search(query) {
    if (fuse == null) {
        return;
    }
    if (query == "") {
        updateResults([]);
        return;
    }
    var results = fuse.search(query);
    updateResults(results);
}

$("#searchInput").on('change keydown paste input', $.debounce(250, function() {
    search($('#searchInput').val());
}));

$(function() {
    $.getJSON('search.json').then(function(products) {
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

        fuse = new Fuse(products, options);

        var queryStringRegex = /[\?&]q=([^&]+)/g;
        var matches = queryStringRegex.exec(window.location.search);
        if (matches && matches[1]) {
            var query = decodeURIComponent(matches[1].replace(/\+/g, '%20'));
            $('#searchInput').val()
            searchInput.value = query;
            search(query);
        }
    });
});