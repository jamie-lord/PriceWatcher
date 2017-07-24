$(document).ready(function() {

    function loadJSON(file, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    function load(id) {
        loadJSON('products/' + id + '.json', function(response) {
            var product = JSON.parse(response);
            updatePageTitle(product);
            setupProductDetails(product);
            setupProductChart(product);
        });
    }

    function getAllUrlParams(url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        var obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // in case params look like: list[]=thing1&list[]=thing2
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function(v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                // set parameter value (use 'true' if empty)
                var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();

                // if parameter name already exists
                if (obj[paramName]) {
                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // if no array index number specified...
                    if (typeof paramNum === 'undefined') {
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                    }
                    // if array index number specified...
                    else {
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                // if param name doesn't exist yet, set it
                else {
                    obj[paramName] = paramValue;
                }
            }
        }

        return obj;
    }

    function updatePageTitle(product) {
        document.title = 'PriceWatcher - ' + product.Name;
    }

    function setupProductDetails(product) {
        $('#product-heading-col').append('<h1>' + product.Name + '</h1>');

        var detailsTemplate = getHtmlTemplate('template-product-details');

        if (product.EAN != null) {
            $('#product-detail-col').append('<p>EAN: ' + product.EAN + '</p>');
        }

        var details = detailsTemplate.replace(/{{product-tesco-id}}/g, product.TescoProductId)
            .replace(/{{product-tesco-client-id}}/g, product.TescoClientId)
            .replace(/{{product-tesco-base-id}}/g, product.TescoBaseProductId);

        $('#product-detail-col').append(details);

        $('#product-img-col').append('<img src="' + product.Image + '" class="img-responsive img-thumbnail pull-right" alt="' + product.Name + '">');
    }

    // Get a HTML template
    function getHtmlTemplate(name) {
        var template = document.getElementById(name);
        return template.innerHTML;
    }

    function setupProductChart(product) {
        var dates = [];
        var prices = [];
        product.PriceHistory.forEach(function(element) {
            dates.push(element.Checked);
            prices.push(element.Price);
        }, this);

        var tescoDataset = {
            label: 'Tesco',
            data: prices,
            backgroundColor: [
                'rgba(010,85,160,0.2)'
            ],
            borderColor: [
                'rgba(10,85,160,1)'
            ],
            borderWidth: 1,
            steppedLine: true
        };

        var productChart = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [tescoDataset]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    var chartContext = document.getElementById("product-price-chart").getContext('2d');

    var id = getAllUrlParams().id;
    load(id);

});