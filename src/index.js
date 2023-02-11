import SearchImages, { getImages } from './js/fetch';
import SimpleLightbox from 'simplelightbox';
import '../node_modules/simplelightbox/dist/simple-lightbox.min.css';
import SearchImages from './js/fetch';
import Notiflix from 'notiflix';

const SearchImagesAPI = new SearchImages();
let throttle = require('lodash.throttle');

const searchForm = document.querySelector('#search-form');
const submitBtn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const endListMsg = document.querySelector('.end-list-msg');

submitBtn.addEventListener('click', submitSearch);
searchForm.addEventListener('input', inputHandler);
gallery.addEventListener('click', gallerySlider);
window.addEventListener('scroll', throttle(loadMoreResults, 1000));

let markupLoad = true;

function inputHandler(e) {
  SearchImagesAPI.searchQuery = e.target.value.trim();
}

async function submitSearch(e) {
  e.preventDefault();
  if (SearchImagesAPI.searchQuery === '') {
    return Notiflix.Notify.info("Введіть запит, поле пошуку не має бути порожнім!");
  }
  gallery.innerHTML = '';
  endListMsg.classList.add('js-endlist');
  SearchImagesAPI.resetPage();
  SearchImagesAPI.totalLoaded = 0;
  SearchImagesAPI.preventFetch = false;
  SearchImagesAPI.getImages().then(markup => {
    pageMarkup(markup);
  });
}

function pageMarkup(dataArray) {
  markupLoad = false;
  const galleryMarkup = dataArray
    .map(
      element =>
        `<div class="photo-card">
  <a href="${element.largeImageURL}">
  <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${element.likes.toLocaleString('uk-UA')}
    </p>
    <p class="info-item">
      <b>Views</b>${element.views.toLocaleString('uk-UA')}
    </p>
    <p class="info-item">
      <b>Comments</b>${element.comments.toLocaleString('uk-UA')}
    </p>
    <p class="info-item">
      <b>Downloads</b>${element.downloads.toLocaleString('uk-UA')}
    </p>
  </div>
  
</div>`
    )
    .join('');
  markupLoad = true;
  return gallery.insertAdjacentHTML('beforeend', galleryMarkup);
}

function gallerySlider(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') return;
  let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
    loop: false,
  });
  gallery.refresh();
}

function loadMoreResults(e) {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (
    documentRect.bottom < document.documentElement.clientHeight + 250 &&
    markupLoad
  ) {
    if (SearchImagesAPI.preventFetch === false) {
      SearchImagesAPI.getImages()
        .then(markup => {
          pageMarkup(markup);
        })
        .catch(error => {
          SearchImagesAPI.notificationEnd();
          endListMsg.classList.remove('js-endlist');
        });
    }
  }
}
