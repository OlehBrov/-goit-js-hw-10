// export { getImages };
// import axios from "axios";

// const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = '33350252-53a75f568ce69e642e03bf7bf';

//  function getImages(query) {
//   try {
//     return axios
//       .get(`${BASE_URL}?key=${API_KEY}&q=${query}`, {
//         params: {
//           image_type: 'photo',
//           orientation: 'horizontal',
//           safesearch: true,
//           per_page: 40,
//           page: 1,
//         }
//       })
//        .then(response => {
//         return response.data.hits;
//       });
//   } catch (error) {
//     console.log('error', error);
//   }
// }

import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33350252-53a75f568ce69e642e03bf7bf';
export default class SearchImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.collection = 1;
    this.imgsPerPage = 150;
    this.totalLoaded = 0;
    this.preventFetch = false;
  }
  getImages() {
    console.log('this search-query', this.searchQuery)
    axios.interceptors.response.use(
      res => {
        console.log('RES in first part', res);
        return res;
      },
      res => {
        console.log('RES in second part', res);
        this.preventFetch = true;
        throw res;
      }
    );
    console.log(this);
    try {
      return axios
        .get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}`, {
          params: {
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: this.imgsPerPage,
            page: this.page,
            validateStatus: status => {
              return status >= 200 && status < 300;
            },
          },
        })
        .then(response => {
            if (response.data.hits.length < 1) {
            Notiflix.Notify.warning(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
          }
          this.collection = response.data.total;
          this.totalLoaded += response.data.hits.length;
          this.notification();
          this.page += 1;
          return response.data.hits;
        });
    } catch (error) {
      console.log('ERROR in catch');
    }

    return this.notificationEnd();
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  notification() {
    Notiflix.Notify.success(
      `Loaded ${this.totalLoaded} images of total ${this.collection}`
    );
  }
  notificationEnd() {
    Notiflix.Notify.warning('No more images to load');
  }
}
