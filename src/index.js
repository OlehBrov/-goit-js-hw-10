import { getImages }  from './js/fetch'
import SimpleLightbox from "simplelightbox";
import "../node_modules/simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';


const searchForm = document.querySelector("#search-form")
const submitBtn = document.querySelector("button")
const gallery = document.querySelector(".gallery")

let searchQuery = ''

submitBtn.addEventListener('click', queryInputHandler);
searchForm.addEventListener('input', inputHandler);

function inputHandler(e) {
    searchQuery = e.target.value
    console.log(searchQuery)
    // return queryInput;
}

 async function queryInputHandler(e) {
     e.preventDefault();
     gallery.innerHTML = "";
     const markup = await getImages(searchQuery);
     if (markup.length < 1) {
         Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
         return;
     }
     pageMarkup(markup)

}

function pageMarkup(dataArray) {
     const galleryMarkup =  dataArray.map((element) => 
`<div class="photo-card">
  <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
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
</div>`)  
        .join("");
    return gallery.insertAdjacentHTML("afterbegin", galleryMarkup);
}

