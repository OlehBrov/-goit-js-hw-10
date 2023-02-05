import { getImages }  from './js/fetch'
import SimpleLightbox from "simplelightbox";
import "../node_modules/simplelightbox/dist/simple-lightbox.min.css";


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
     const markup = await getImages(searchQuery);
     pageMarkup(markup)

}

function pageMarkup(dataArray) {
     const galleryMarkup =  dataArray.map((element) => 
`<div class="photo-card">
  <img src="${element.previewURL}" alt="${element.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${element.likes}Likes</b>
    </p>
    <p class="info-item">
      <b>${element.views}Views</b>
    </p>
    <p class="info-item">
      <b>${element.comments}Comments</b>
    </p>
    <p class="info-item">
      <b>${element.downloads}Downloads</b>
    </p>
  </div>
</div>`)  
        .join("");
    return gallery.insertAdjacentHTML("afterbegin", galleryMarkup);
}

