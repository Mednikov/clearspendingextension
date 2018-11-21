// var extensions = "chrome" === 'chrome' ? chrome : browser;
// var active = false;

window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

function generatePage(org) {
    // console.log(org)
    $(".container").append('<div class="card"><div class="card-body"></div></div>')
    if (org.name !== ('' || undefined)) {
        $(".card-body").append('<h5 class="card-title">' + org.name + '</h5>');
    }
    if (org.type !== ('' || undefined)) {
        $(".card-body").append('<h6 class="card-subtitle mb-2 text-muted">' + org.type + '</h6>');
    }
    $(".card-body").append('<div class="card-text"></div>');
    if (org.address !== ('' || undefined)) {
        $(".card-text").append('<div class="row"><div class="col"><p>' + org.address + '</p></div></div>');
    }
    if (org.inn !== ('' || undefined) || org.kpp !== ('' || undefined)) {
        $(".card-text").append('<div class="row row-second"></div>');
        if (org.inn !== ('' || undefined)) {
            $(".card-text .row-second").append('<div class="col"><strong>ИНН: </strong>' + org.inn + '</div>');
        }
        if (org.kpp !== ('' || undefined)) {
            $(".card-text .row-second").append('<div class="col"><strong>КПП: </strong>' + org.kpp + '</div>');
        }
    }

    if (org.contracts !== ('' || undefined) || org.suppliers !== ('' || undefined)) {
        $(".card").append('<ul class="list-group list-group-flush"></ul>');
        if (org.contracts !== ('' || undefined)){
            $(".list-group").append('<li class="list-group-item"></li>');
            if (org.contracts.amount !== ('' || undefined)) {
                $(".list-group-item").append('<strong>Всего контрактов: </strong>' + org.contracts.amount + '</br>');
            };
            if (org.contracts.sum !== ('' || undefined)) {
                $(".list-group-item").append('<strong>Сумма контрактов: </strong>' + org.contracts.sum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' руб.</br>');
            };
        }
        if (org.suppliers !== ('' || undefined)) {
            $(".list-group").append('<li class="list-group-item list-group-item-second"></li>')
            if (org.suppliers.amount !== ('' || undefined)) {
                $(".list-group-item-second").append('<strong>Поставщиков: </strong>' + org.suppliers.amount)
            }
        }
    }

    if (org.spz !== ('' || undefined)) {
        $(".card").append('<div class="card-body card-body-second text-center"></div>');
        $(".card-body-second").append('<a href="https://clearspending.ru/customer/' + org.spz + '" class="card-link">Посмотреть на Госзатратах</a>');
    }
}

function generatePageError(){
    $(".container").append('<h5 class="card-title my-3 text-center">Такой организации нет на Госзатратах</h5>');
}

function removeLoader(){
    $(".loader").remove();
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'data.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var queryInfo = {
    active: true,
    lastFocusedWindow: true
};
// browser.tabs.getSelected(null, function(tab) {
browser.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var tabUrl = new URL(tab.url);
    var tabHostname = tabUrl.hostname.replace("www.", "");
    // console.log(tabHostname);
    
    loadJSON(function(response) {
        var data = JSON.parse(response);
        // var check = data.includes('giadom.mintrud01.ru');
        // console.log(data);
        var found = false;
        for(var i = 0; i < data.length; i++) {
            if (data[i].site.replace("www.", "") == tabHostname) {
                found = true;
                removeLoader();
                generatePage(data[i]);
                break;
            }
        }
        if (!found) {
            removeLoader();
            generatePageError();
        }
        // console.log(found);
    });
});

$('body').on('click', 'a', function(){
    browser.tabs.create({url: $(this).attr('href')});
    return false;
});

