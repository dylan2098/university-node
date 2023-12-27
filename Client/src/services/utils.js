import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

export function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export const uploadImage = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'n3got5z5');

  const res = await fetch("https://api.cloudinary.com/v1_1/dvweth7yl/image/upload", {
    method: 'POST',
    body: data
  });
  const resultJson = await res.json();
  return resultJson;
};