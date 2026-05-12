import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

export async function getProducts() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export async function getProductById(id) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}

export async function createProduct(data) {
  const res = await axios.post(BASE_URL, data);
  return res.data;
}

export async function updateProduct(id, data) {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}
