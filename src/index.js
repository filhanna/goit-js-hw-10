import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
import debounce from 'lodash.debounce';
const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener(
  'input',
  debounce(evt => {
    if (evt.target.value.trim() === '') {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    } else {
      onSearch();
    }
  }, DEBOUNCE_DELAY)
);

function onSearch() {
  const inputValue = inputSearch.value;

  fetchCountries(inputValue)
    .then(data => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length < 10 && data.length > 2) {
        createMarcupListCountry(data);
      } else {
        createMarcupOneCountry(data);
      }
    })
    .catch(err => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarcupOneCountry(data) {
  countryInfo.innerHTML = `<div style="display:flex; align-items: center;">
        <img src= ${
          data[0].flags.png
        } alt="" width="30" style="margin-right: 10px;">
    <h2> ${data[0].name.official}</h2>
    </div>
    <ul style="list-style: none; padding: 0">
      <li><b>Capital: </b> ${data[0].capital}</li>
      <li><b>Population: </b>${data[0].population}</li>
      <li><b>Languages: </b>${Object.values(data[0].languages)} </li>
    </ul>`;
}
function createMarcupListCountry(data) {
  return data.map(country => {
    countryList.insertAdjacentHTML(
      'beforeend',
      `<li style="display: flex; align-items: center;"><img src= ${country.flags.png} alt="" width="30" height="100%" style="margin-right: 10px;">
    <h2>${country.name.official}</h2></li>`
    );
  });
}
