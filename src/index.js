import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { makeCardMarkup } from './makeCardMarkup';
import { getUser } from './getUser';

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
 
  getUser(inputText, searchPage).then(response => {
      if (response.total === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');    
        loadMoreBtn.style.opacity = "0";
        return;
    };
    Notify.success(`Hooray! We found ${response.total} images.`);
    console.log(response.total);
    return response.hits;
  }).then(result => {
    
    const photoListMarkup = result.map(makeCardMarkup).join('');
    photoCardField.insertAdjacentHTML('beforeend', photoListMarkup);
    loadMoreBtn.style.opacity = "1";
  });
  
  event.target.reset(); 
  
}

loadMoreBtn.addEventListener('click', handleLoadMoreClick);

function handleLoadMoreClick() {
  searchPage += 1;

  getUser(inputText, searchPage).then(response => {
    totalImgToSearch += 40;
      if (totalImgToSearch > response.total) {
        Notify.failure("We're sorry, but you've reached the end of search results.");  
        loadMoreBtn.style.opacity = "0";
        return;
    };
    return response.hits;
  }).then(result => {
    const photoListMarkup = result.map(makeCardMarkup).join('');
      photoCardField.insertAdjacentHTML('beforeend', photoListMarkup);
  });
}


// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";
// let lightbox = new SimpleLightbox('.photo-card a', {
//   overlay: true,
//   overlayOpacity:	0.7,
//   spinner: true,
//   nav:	true,
//   captions: true,
//   captionsData: 'alt',
//   captionsDelay: 250,

// });


