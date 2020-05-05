import _ from 'lodash';
import $ from 'jquery';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import './css/style.css';
import Items from '../resources/data/items.json';

const searchForm = document.querySelector('#searchForm');
const search = document.querySelector('#search');
const matchList = document.querySelector('#match-list');
const displayInfo = document.querySelector('#displayInfo');
const amountInput = document.querySelector('#amount');
const calcTenJita = document.querySelector('#calc10');

const jita = "&usesystem=30000142";
const amarr = "&usesystem=30002187";

// Just prevent default behaviour from hitting enter on search form
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Search items.json and filter it
const searchItems = async searchText => {
    const items = Items;

    // Get matches to current text input
    let matches = items.filter(item => {
        const regex = new RegExp(`^${searchText}.*`, 'gi');
        return item.name.match(regex);
    });

    if (searchText.length === 0) {
        matches = [];
        matchList.innerHTML = '';
    }

    outputHtml(matches);
};

// Show results in html
const outputHtml = matches => {
    if (matches.length > 0) {
        matches = matches.splice(0,10);
        const html = matches.map(match => `
            <a href="#! class="collection-item" id="${match.typeId}" onclick="choose(this.id)">${match.name}</a><br>
        `)
        .join('');

        matchList.innerHTML = `<h4 class="collection-header">Choose item</h4>`
        matchList.innerHTML += html;
    }
}

window.choose = (clickedItem) => {
    let fillItem = document.getElementById(clickedItem);

    let name = fillItem.innerHTML;
    let typeId = fillItem.id;

    search.value = name;
    matchList.innerHTML = '';
    

    getItemFromApi(typeId, name);
}

// Eventlistener to handle autofill
search.addEventListener('input', () => searchItems(search.value));

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

search.addEventListener('focus', () => searchItems(search.value));




function getItemFromApi(typeId, name) {
    displayInfo.innerHTML = `<h3 class="itemTitle">${name}</h3>`;
    let url1 = "https://api.evemarketer.com/ec/marketstat/json?typeid=" + typeId + jita;
    let url2 = "https://api.evemarketer.com/ec/marketstat/json?typeid=" + typeId + amarr;

    // Fetch Jita and print to screen
    fetch(url1).then(res => res.json()).then(
        data => {   
            if(amountInput.value != undefined && amountInput.value > 0) {
                let minSell = numberWithCommas( data[0].sell.min * amountInput.value );
                let tenPercentJita = numberWithCommas((data[0].sell.min * amountInput.value) / 100 * 90);
                let maxBuy = numberWithCommas( data[0].buy.max * amountInput.value );

                let html = `
                <h4 class="jitaTitle">Jita</h4>
                <p>Minimum Sell: <span id="minSellJita">${minSell}</span></p>
                <p>Maximum Buy: ${maxBuy}</p>
                `;

                displayInfo.innerHTML += html;
                calcTenJita.innerHTML = `10% Jita: ${tenPercentJita}`;
            } else {
                let minSell = numberWithCommas( data[0].sell.min );
                let tenPercentJita = numberWithCommas(data[0].sell.min / 100 * 90);
                let maxBuy = numberWithCommas( data[0].buy.max );

                let html = `
                <h4 class="jitaTitle">Jita</h4>
                <p>Minimum Sell: <span id="minSellJita">${minSell}</span></p>
                <p>Maximum Buy: ${maxBuy}</p>
                `;
                displayInfo.innerHTML += html;
                calcTenJita.innerHTML = `10% Jita: ${tenPercentJita}`;
            }
    });

    fetch(url2).then(res => res.json()).then(
        data => {
            if(amountInput.value != undefined && amountInput.value > 0) {
                let minSell = numberWithCommas( data[0].sell.min * amountInput.value );
                let maxBuy = numberWithCommas( data[0].buy.max * amountInput.value );

                let html = `
                <h4 class="amarrTitle">Amarr</h4>
                <p>Minimum Sell: <span>${minSell}</span></p>
                <p>Maximum Buy: ${maxBuy}</p>
                `;
            displayInfo.innerHTML += html;
            } else {
                let minSell = numberWithCommas( data[0].sell.min );
                let maxBuy = numberWithCommas( data[0].buy.max );

                let html = `
                <h4 class="amarrTitle">Amarr</h4>
                <p>Minimum Sell: <span id="minSellAmarr">${minSell}</span></p>
                <p>Maximum Buy: ${maxBuy}</p>
                `;
                displayInfo.innerHTML += html;
            }
        }
    );

}