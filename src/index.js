import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios');

const BASE_URL = 'https://pixabay.com/api/';
const LIBRARY_KEY = '26656666-c9df0a89ed3cb80a5684720fa';
const inputField = document.querySelector('.search-form');
const photoCardField = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let inputText = '';
let searchPage = 1;

inputField.style.marginBottom = "25px";
loadMoreBtn.style.marginTop = "25px";
loadMoreBtn.style.marginLeft = "250px";
loadMoreBtn.style.marginBottom = "25px";
loadMoreBtn.style.opacity = "0";

inputField.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  photoCardField.innerHTML = '';
  inputText = event.currentTarget.elements.searchQuery.value;
 
  getUser().then(response => {
      if (response.data.total === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');    
        loadMoreBtn.style.opacity = "0";
        return;
    };
    return response.data.hits;
  }).then(result => {
    const photoListMarkup = result.map(makeCardMarkup).join('');
      photoCardField.insertAdjacentHTML('beforeend', photoListMarkup);
  });
  
  searchPage = 1;
  event.target.reset(); 
  loadMoreBtn.style.opacity = "1";
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
            per_page: 3,

    }
    });
      
      return response;
  } catch (error) {
    console.log(error);
  }
};

const makeCardMarkup = (element) => {
    return      `<div class="photo-card">
                <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                    <b>Likes: ${element.likes}</b>
                  </p>
                  <p class="info-item">
                    <b>Views: ${element.views}</b>
                  </p>
                  <p class="info-item">
                    <b>Comments: ${element.comments}</b>
                  </p>
                  <p class="info-item">
                    <b>Downloads: ${element.downloads}</b>
                  </p>
                </div>
              </div>`;
};

loadMoreBtn.addEventListener('click', handleLoadMoreClick);

function handleLoadMoreClick(element) {
  searchPage += 1;

  getUser().then(response => {
      if (searchPage > response.data.totalHits) {
        Notify.failure("We're sorry, but you've reached the end of search results.");  
        loadMoreBtn.style.opacity = "0";
        return;
    };
    return response.data.hits;
  }).then(result => {
    const photoListMarkup = result.map(makeCardMarkup).join('');
      photoCardField.insertAdjacentHTML('beforeend', photoListMarkup);
  });
}



