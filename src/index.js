import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios');

const BASE_URL = 'https://pixabay.com/api/';
const LIBRARY_KEY = '26656666-c9df0a89ed3cb80a5684720fa';
const inputField = document.querySelector('.search-form');

let inputText = '';
let searchPage = 1;

inputField.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  inputText = event.currentTarget.elements.searchQuery.value;
  console.log(inputText);

  getUser().then(response => {
      if (response.data.total === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');    
    }
    console.log(response.data.hits[23].largeImageURL);
  });
  
  searchPage = 1;
  event.target.reset(); 
}

async function getUser() {
  try {
    const response = await axios.get(`${BASE_URL}`, {
    params: {
            key: LIBRARY_KEY,
            q: inputText,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: searchPage,
            per_page: 40,

    }
    });
      
      return response;
  } catch (error) {
    console.log(error);
  }
};




