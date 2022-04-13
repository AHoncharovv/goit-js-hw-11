import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const axios = require('axios');

const BASE_URL = 'https://pixabay.com/api/';
const LIBRARY_KEY = '26656666-c9df0a89ed3cb80a5684720fa';
const inputField = document.querySelector('.search-form');
const photoCardField = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let inputText = '';
let searchPage = 1;
let totalImgToSearch = 40;

loadMoreBtn.style.opacity = "0";

inputField.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  photoCardField.innerHTML = '';
  inputText = event.currentTarget.elements.searchQuery.value;
  searchPage = 1;
  
  if (inputText.length === 0) {
    Notify.failure('Please enter text to search.');
    return;
  }
 
  getUser().then(response => {
      if (response.data.total === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');    
        loadMoreBtn.style.opacity = "0";
        return;
    };
    Notify.success(`Hooray! We found ${response.data.total} images.`);
    console.log(response.data.total);
    return response.data.hits;
  }).then(result => {
    
    const photoListMarkup = result.map(makeCardMarkup).join('');
    photoCardField.insertAdjacentHTML('beforeend', photoListMarkup);
    loadMoreBtn.style.opacity = "1";
  });
  
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
            per_page: 20,

    }
    });
      
      return response;
  } catch (error) {
    console.log(error);
  }
};

const makeCardMarkup = (element) => {
  return      `
                <div class="photo-card">
                <img style="width: 215px; height: auto;" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
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
              </div>
              `;
};
// let lightbox = new SimpleLightbox('.photo-card a', {
//   overlay: true,
//   overlayOpacity:	0.7,
//   spinner: true,
//   nav:	true,
//   captions: true,
//   captionsData: 'alt',
//   captionsDelay: 250,

// });

loadMoreBtn.addEventListener('click', handleLoadMoreClick);

function handleLoadMoreClick() {
  searchPage += 1;

  getUser().then(response => {
    totalImgToSearch += 40;
      if (totalImgToSearch > response.data.total) {
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



