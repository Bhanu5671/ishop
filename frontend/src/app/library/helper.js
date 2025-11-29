import axios from "axios";

const axiosApiInstance = axios.create(
  {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  }
)

function titletoSlug(title) {
  return title.trim().replace(/'/g, '').replace(/\s+/g, ' ').replace(/ /g, '-').toLowerCase();
}

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export { titletoSlug, axiosApiInstance, getCookie }