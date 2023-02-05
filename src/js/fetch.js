export { getImages };
import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33350252-53a75f568ce69e642e03bf7bf';

 function getImages(query) {
  try {
    return axios
      .get(`${BASE_URL}?key=${API_KEY}&q=${query}`)
       .then(response => {
        console.log(response.data.hits)
        return response.data.hits;
      });
  } catch (error) {
    console.log('error', error);
  }
}

// getImages('cat')