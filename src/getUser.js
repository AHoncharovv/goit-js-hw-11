const BASE_URL = 'https://pixabay.com/api/';
const LIBRARY_KEY = '26656666-c9df0a89ed3cb80a5684720fa';
const axios = require('axios');

export async function getUser(inputText, searchPage) {
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
      
      return response.data;
  } catch (error) {
    console.log(error);
  }
};