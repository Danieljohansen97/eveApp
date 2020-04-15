// Get elements
const sellForm = document.querySelector('#sellCheck');
const show = document.querySelector('#show');

// Variables shown on page
var itemName = "";
var typeId = "";

// Trade hubs
const jita = "&usesystem=30000142";
const amarr = "&usesystem=30002187";

const getSellAmarr = async () => {
    let item = sellForm['item'].value;
    itemName = item;
    getTypeId(itemName);
    // Test request for amarr
    setTimeout(render, 1000);
}

const getTypeId = function (itemName) {
    let request = new XMLHttpRequest();
    request.open("GET", "https://www.fuzzwork.co.uk/api/typeid.php?typename=" + itemName);
    request.send();
    request.onload = () => {
        // typeId from itemName
        return typeId = JSON.parse(request.responseText).typeID;
    }
};

// Submit listener for sellCheck
sellForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let item = sellForm['item'].value;
    itemName = item;
    show.innerHTML = "";
    show.innerHTML += `<h3>${itemName}</h3>`;
    getSellAmarr();
    
});

function render() {
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.evemarketer.com/ec/marketstat/json?typeid=" + typeId + jita);
    request.send();
    request.onload = (response) => {
        // Amarr minimum sell
        let minSellJi = JSON.parse(response.srcElement.responseText)[0].sell.min;
        let maxBuyJi = JSON.parse(response.srcElement.responseText)[0].buy.max;
        let html = `
            <h4>Jita: </h4>
            <p>Minimum sell: ${minSellJi}</p>
            <p>Maximum buy: ${maxBuyJi}</p>
        `;    
        show.innerHTML += html;
    }

    let request2 = new XMLHttpRequest();
    request2.open("GET", "https://api.evemarketer.com/ec/marketstat/json?typeid=" + typeId + amarr);
    request2.send();
    request2.onload = (response) => {
        // Amarr minimum sell
        let minSellAm = JSON.parse(response.srcElement.responseText)[0].sell.min;
        let maxBuyAm = JSON.parse(response.srcElement.responseText)[0].buy.max;
        let html = `
            <h4>Amarr: </h4>
            <p>Minimum sell: ${minSellAm}</p>
            <p>Maximum buy: ${maxBuyAm}</p>
        `;    
        show.innerHTML += html;
    }
}