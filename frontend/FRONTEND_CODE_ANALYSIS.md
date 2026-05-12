# Analisis Codebase Frontend

Dokumen ini menjelaskan struktur frontend, fungsi setiap folder dan file, serta fungsi syntax utama di setiap file. Analisis hanya mencakup folder `frontend`.

## Gambaran Umum

Frontend ini adalah aplikasi React untuk melakukan operasi CRUD data product. Dibangun menggunakan:

- `React` sebagai library utama untuk membangun UI.
- `Vite` sebagai build tool dan development server.
- `React Router DOM` untuk navigasi antar halaman.
- `Axios` sebagai HTTP client untuk berkomunikasi dengan backend API.
- `Tailwind CSS` untuk styling berbasis utility class.

Alur utama aplikasi:

1. `main.jsx` merender komponen `App` ke dalam DOM.
2. `App.jsx` mendefinisikan routing menggunakan React Router.
3. Setiap route merender satu halaman dari folder `pages/`.
4. Halaman menggunakan custom hook dari `hooks/` untuk mengambil dan mengelola data.
5. Custom hook memanggil fungsi dari `api/` yang berisi semua request Axios ke backend.
6. Komponen UI dari `components/` digunakan kembali di berbagai halaman.
7. Fungsi helper dari `utils/` dipakai untuk memformat data sebelum ditampilkan.

---

## Struktur Folder Frontend

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── product.api.js
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Modal.jsx
│   ├── hooks/
│   │   └── useProduct.js
│   ├── pages/
│   │   ├── ProductListPage.jsx
│   │   ├── ProductCreatePage.jsx
│   │   └── ProductEditPage.jsx
│   ├── utils/
│   │   └── formatDate.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Penjelasan Folder

### `frontend/`

Folder utama frontend. Berisi file konfigurasi Vite, konfigurasi package npm, environment variable, dan folder source code.

### `frontend/public/`

Berisi aset statis yang tidak diproses oleh Vite, seperti favicon. File di sini bisa diakses langsung dari root URL.

### `frontend/src/`

Seluruh source code aplikasi React berada di sini. Isinya dibagi berdasarkan tanggung jawab masing-masing folder.

### `frontend/src/api/`

Berisi semua fungsi HTTP request ke backend menggunakan Axios. Dengan memusatkan seluruh request di sini, komponen tidak perlu mengetahui detail URL atau cara pemanggilan API.

### `frontend/src/components/`

Berisi komponen React yang dapat digunakan kembali di berbagai halaman. Dibagi menjadi dua subfolder:

- `layout/` — komponen yang membentuk struktur halaman seperti Navbar.
- `ui/` — komponen kecil yang bersifat generic seperti Button, Input, dan Modal.

### `frontend/src/hooks/`

Berisi custom hook React. Custom hook memisahkan logic pengambilan dan pengelolaan data dari komponen tampilan, sehingga komponen halaman tetap bersih dan fokus pada UI.

### `frontend/src/pages/`

Berisi komponen halaman utama. Setiap file mewakili satu halaman yang dirender oleh React Router berdasarkan URL.

### `frontend/src/utils/`

Berisi fungsi helper murni yang bisa dipakai di mana saja. Contohnya fungsi untuk memformat angka menjadi format mata uang atau memformat tanggal.

---

## File: `main.jsx`

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Fungsi File

`main.jsx` adalah entry point aplikasi React. File ini bertugas merender komponen root `App` ke dalam elemen HTML dengan id `root` yang ada di `index.html`.

### Penjelasan Syntax

`import { StrictMode } from "react";`

Mengimpor `StrictMode` dari React. `StrictMode` adalah wrapper yang membantu mendeteksi potensi masalah pada aplikasi selama proses development. Di production, `StrictMode` tidak mengubah perilaku apapun.

`import { createRoot } from "react-dom/client";`

Mengimpor `createRoot` dari `react-dom`. Ini adalah API React modern (React 18+) untuk merender aplikasi ke dalam DOM.

`import "./index.css";`

Mengimpor file CSS global. File ini berisi `@import "tailwindcss"` yang mengaktifkan Tailwind CSS di seluruh aplikasi.

`import App from "./App.jsx";`

Mengimpor komponen root aplikasi.

`createRoot(document.getElementById("root"))`

Membuat root React yang terhubung ke elemen dengan id `root` di `index.html`.

`.render(<StrictMode><App /></StrictMode>)`

Merender komponen `App` di dalam `StrictMode` ke dalam elemen root tersebut.

---

## File: `App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProductListPage from "./pages/ProductListPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import ProductEditPage from "./pages/ProductEditPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/create" element={<ProductCreatePage />} />
          <Route path="/products/edit/:id" element={<ProductEditPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

### Fungsi File

`App.jsx` adalah komponen root yang mengatur navigasi dan layout utama aplikasi. Semua route didefinisikan di sini.

### Penjelasan Syntax

`import { BrowserRouter, Routes, Route } from "react-router-dom";`

Mengimpor tiga komponen dari React Router:

- `BrowserRouter` — menyediakan konteks routing ke seluruh aplikasi menggunakan URL browser.
- `Routes` — wrapper yang menampung semua definisi `Route`.
- `Route` — mendefinisikan satu pasang URL dan komponen yang dirender.

`<BrowserRouter>`

Membungkus seluruh aplikasi agar semua komponen di dalamnya bisa menggunakan fitur routing.

`<div className="min-h-screen bg-gray-100">`

Div pembungkus yang memastikan halaman selalu setinggi layar dengan warna latar abu-abu. `className` digunakan di React sebagai pengganti `class` di HTML.

`<Navbar />`

Merender komponen Navbar di atas semua halaman. Karena berada di luar `<Routes>`, Navbar selalu tampil di setiap halaman.

`<Route path="/" element={<ProductListPage />} />`

Ketika URL adalah `/`, React Router merender komponen `ProductListPage`.

`<Route path="/products/create" element={<ProductCreatePage />} />`

Ketika URL adalah `/products/create`, merender `ProductCreatePage`.

`<Route path="/products/edit/:id" element={<ProductEditPage />} />`

Ketika URL adalah `/products/edit/:id`, merender `ProductEditPage`. Bagian `:id` adalah parameter dinamis yang nilainya bisa dibaca di dalam komponen menggunakan hook `useParams`.

`export default function App()`

Mengekspor komponen sebagai default export. Ini adalah cara standar untuk mengekspor komponen utama dari sebuah file.

---

## File: `index.css`

```css
@import "tailwindcss";
```

### Fungsi File

File CSS global yang mengaktifkan Tailwind CSS v4 di seluruh aplikasi. Dengan satu baris ini, semua utility class Tailwind bisa digunakan di komponen manapun.

---

## File: `src/api/product.api.js`

```js
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
```

### Fungsi File

File ini memusatkan semua pemanggilan HTTP ke backend API. Setiap fungsi mewakili satu operasi CRUD. Komponen dan hook tidak perlu menulis logika Axios secara langsung, cukup memanggil fungsi dari file ini.

### Penjelasan Syntax

`import axios from "axios";`

Mengimpor library Axios untuk melakukan HTTP request.

`const BASE_URL = \`${import.meta.env.VITE_API_URL}/products\`;`

Membuat konstanta URL dasar untuk endpoint product. `import.meta.env.VITE_API_URL` membaca nilai dari file `.env`. Di Vite, variabel environment wajib menggunakan prefix `VITE_` agar bisa diakses di sisi client.

`export async function getProducts()`

Fungsi untuk mengambil semua data product. Melakukan `GET` request ke `/api/products`.

`export async function getProductById(id)`

Fungsi untuk mengambil satu product berdasarkan id. Melakukan `GET` request ke `/api/products/:id`.

`export async function createProduct(data)`

Fungsi untuk membuat product baru. Melakukan `POST` request dengan body berisi data product.

`export async function updateProduct(id, data)`

Fungsi untuk mengubah product yang sudah ada. Melakukan `PUT` request ke `/api/products/:id` dengan body berisi data terbaru.

`export async function deleteProduct(id)`

Fungsi untuk menghapus product. Melakukan `DELETE` request ke `/api/products/:id`.

`const res = await axios.get(BASE_URL);`

Menjalankan HTTP request dan menunggu hasilnya. `await` digunakan karena request bersifat asynchronous.

`return res.data;`

Mengembalikan hanya properti `data` dari response Axios. Axios membungkus response di dalam objek dengan properti seperti `data`, `status`, dan `headers`. Dengan mengembalikan `res.data` langsung, pemanggilnya tidak perlu mengakses `.data` lagi.

---

## File: `src/utils/formatDate.js`

```js
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
```

### Fungsi File

Berisi fungsi helper untuk memformat data sebelum ditampilkan ke pengguna. Dengan menempatkan fungsi ini di `utils/`, logika formatting tidak tersebar di berbagai komponen.

### Penjelasan Syntax

`export function formatDate(dateString)`

Fungsi untuk mengubah string tanggal dari database menjadi format tanggal yang mudah dibaca.

`new Date(dateString)`

Mengkonversi string tanggal menjadi objek `Date` JavaScript.

`.toLocaleDateString("id-ID", { ... })`

Memformat tanggal sesuai locale Indonesia. Hasilnya contohnya: `12 Mei 2026`.

`export function formatCurrency(amount)`

Fungsi untuk mengubah angka menjadi format mata uang Rupiah.

`new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })`

Menggunakan API `Intl.NumberFormat` bawaan JavaScript untuk memformat angka sesuai standar internasional. Hasilnya contohnya: `Rp 250.000`.

`.format(amount)`

Menerapkan format ke nilai angka yang diberikan.

---

## File: `src/hooks/useProduct.js`

```js
import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../api/product.api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProductById(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  return { product, loading, error };
}
```

### Fungsi File

Berisi dua custom hook yang memisahkan logika pengambilan data dari komponen tampilan. Dengan custom hook, halaman cukup memanggil hook dan menerima data yang sudah siap digunakan.

### `useProducts`

Custom hook untuk mengambil semua product dari API.

#### Penjelasan Syntax

`const [products, setProducts] = useState([]);`

Membuat state `products` dengan nilai awal array kosong. `setProducts` digunakan untuk memperbarui nilainya.

`const [loading, setLoading] = useState(false);`

State untuk melacak apakah proses fetch sedang berjalan. Digunakan untuk menampilkan indikator loading di UI.

`const [error, setError] = useState(null);`

State untuk menyimpan pesan error jika request gagal.

`async function fetchProducts()`

Fungsi internal yang menjalankan proses pengambilan data. Dibuat sebagai fungsi bernama agar bisa di-return sebagai `refetch` dan dipanggil ulang ketika dibutuhkan.

`setLoading(true);`

Mengubah state loading menjadi `true` sebelum request dimulai.

`const res = await getProducts();`

Memanggil fungsi dari `api/product.api.js` dan menunggu hasilnya.

`setProducts(res.data);`

Menyimpan array product ke dalam state setelah data berhasil diterima.

`setError(err.message);`

Menyimpan pesan error ke state jika request gagal.

`finally { setLoading(false); }`

Blok `finally` selalu dijalankan, baik request berhasil maupun gagal. Ini memastikan state loading selalu kembali ke `false` setelah proses selesai.

`useEffect(() => { fetchProducts(); }, []);`

Menjalankan `fetchProducts` saat komponen pertama kali dimuat. Array kosong `[]` sebagai dependency berarti efek ini hanya berjalan sekali.

`return { products, loading, error, refetch: fetchProducts };`

Mengembalikan state dan fungsi yang dibutuhkan komponen. `refetch` memungkinkan komponen memicu pengambilan data ulang, misalnya setelah menghapus product.

### `useProductById`

Custom hook untuk mengambil satu product berdasarkan id. Digunakan di halaman edit.

#### Penjelasan Syntax

`const [product, setProduct] = useState(null);`

State untuk menyimpan satu objek product, dengan nilai awal `null`.

`useEffect(() => { ... }, [id]);`

Efek dijalankan setiap kali nilai `id` berubah. Ini penting karena jika pengguna berpindah dari edit produk A ke edit produk B, hook akan otomatis fetch ulang data yang sesuai.

`if (id) fetchProduct();`

Pengecekan agar fetch tidak dijalankan jika `id` belum tersedia atau bernilai `undefined`.

---

## File: `src/components/layout/Navbar.jsx`

```jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide">
          MERN CRUD
        </Link>
        <Link
          to="/products/create"
          className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          + Add Product
        </Link>
      </div>
    </nav>
  );
}
```

### Fungsi File

Komponen navigasi yang selalu tampil di bagian atas semua halaman. Berisi logo yang mengarah ke halaman list, dan tombol untuk menuju halaman tambah product.

### Penjelasan Syntax

`import { Link } from "react-router-dom";`

Mengimpor komponen `Link` dari React Router. `Link` digunakan sebagai pengganti tag `<a>` HTML agar navigasi tidak mereload halaman.

`<Link to="/">`

Membuat tautan ke halaman utama (Product List). Saat diklik, URL berubah menjadi `/` tanpa reload halaman.

`<Link to="/products/create">`

Membuat tautan ke halaman tambah product.

`export default function Navbar()`

Mengekspor komponen sebagai default export.

---

## File: `src/components/ui/Button.jsx`

```jsx
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) {
  const base = "px-4 py-2 rounded-lg font-semibold transition text-sm";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
```

### Fungsi File

Komponen tombol yang dapat digunakan ulang di seluruh aplikasi. Mendukung tiga varian tampilan: `primary`, `danger`, dan `secondary`.

### Penjelasan Syntax

`{ children, onClick, type = "button", variant = "primary", disabled = false }`

Destructuring props dengan nilai default. `children` adalah konten di dalam tombol. Nilai default ditetapkan agar komponen tetap berfungsi meski props tidak diberikan.

`const base = "..."`

String berisi class Tailwind dasar yang selalu diterapkan ke semua varian tombol.

`const variants = { primary: "...", danger: "...", secondary: "..." }`

Objek yang memetakan nama varian ke class Tailwind yang sesuai.

`className={\`${base} ${variants[variant]} ${disabled ? "..." : ""}\`}`

Menggabungkan class dasar, class varian sesuai props, dan class disabled secara kondisional menggunakan template literal.

`{children}`

Merender konten yang disisipkan di antara tag `<Button>` dan `</Button>`.

---

## File: `src/components/ui/Input.jsx`

```jsx
export default function Input({ label, name, type = "text", value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
```

### Fungsi File

Komponen input form yang dapat digunakan ulang. Mendukung label, pesan error, dan berbagai tipe input.

### Penjelasan Syntax

`{label && (<label>...</label>)}`

Merender elemen `<label>` hanya jika props `label` diberikan. Ini adalah short-circuit evaluation — jika `label` bernilai falsy, elemen label tidak dirender.

`value={value}` dan `onChange={onChange}`

Menjadikan input sebagai controlled component. State nilai input dikelola di luar komponen (di halaman yang menggunakannya), dan setiap perubahan diteruskan melalui `onChange`.

`error ? "border-red-400" : "border-gray-300"`

Mengubah warna border secara kondisional. Jika ada error, border berubah merah.

`{error && <p className="text-xs text-red-500">{error}</p>}`

Merender pesan error di bawah input hanya jika ada pesan error.

---

## File: `src/components/ui/Modal.jsx`

```jsx
export default function Modal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Fungsi File

Komponen dialog konfirmasi yang tampil di atas halaman. Digunakan saat pengguna akan menghapus data, untuk memastikan tindakan disengaja.

### Penjelasan Syntax

`if (!isOpen) return null;`

Jika prop `isOpen` bernilai `false`, komponen tidak merender apapun. Ini adalah pola umum untuk komponen yang bisa disembunyikan.

`className="fixed inset-0 bg-black/50 ..."`

`fixed inset-0` membuat div memenuhi seluruh layar. `bg-black/50` memberikan latar belakang hitam semi-transparan sebagai overlay.

`z-50`

Memastikan modal tampil di atas semua elemen lain di halaman.

`onConfirm` dan `onCancel`

Fungsi yang diteruskan dari komponen induk. Modal sendiri tidak tahu apa yang terjadi setelah tombol diklik — itu tanggung jawab komponen yang menggunakannya.

---

## File: `src/pages/ProductListPage.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProduct";
import { deleteProduct } from "../api/product.api";
import { formatCurrency, formatDate } from "../utils/formatDate";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

export default function ProductListPage() {
  const { products, loading, error, refetch } = useProducts();
  const [modal, setModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  async function handleDelete() {
    await deleteProduct(modal.id);
    setModal({ isOpen: false, id: null });
    refetch();
  }

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Product List</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(product.createdAt)}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button variant="secondary" onClick={() => navigate(`/products/edit/${product._id}`)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setModal({ isOpen: true, id: product._id })}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={modal.isOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
```

### Fungsi File

Halaman utama yang menampilkan semua product dalam bentuk tabel. Pengguna dapat melihat daftar product, menuju halaman edit, dan menghapus product dengan konfirmasi modal.

### Penjelasan Syntax

`const { products, loading, error, refetch } = useProducts();`

Memanggil custom hook untuk mendapatkan data product beserta state loading dan error.

`const [modal, setModal] = useState({ isOpen: false, id: null });`

State untuk mengontrol visibilitas modal dan menyimpan id product yang akan dihapus. Keduanya digabung dalam satu objek agar lebih terorganisir.

`const navigate = useNavigate();`

Hook dari React Router untuk navigasi secara programatik, misalnya setelah mengklik tombol Edit.

`async function handleDelete()`

Fungsi yang dijalankan ketika pengguna mengkonfirmasi penghapusan. Prosesnya: hapus product via API, tutup modal, lalu fetch ulang data terbaru.

`if (loading) return <p>Loading...</p>;`

Menampilkan teks loading jika data masih dalam proses pengambilan.

`if (error) return <p>{error}</p>;`

Menampilkan pesan error jika pengambilan data gagal.

`products.map((product, index) => (...))`

Mengiterasi array product untuk merender satu baris tabel per product.

`key={product._id}`

Setiap elemen dalam list React wajib memiliki prop `key` yang unik. React menggunakan ini untuk mengidentifikasi elemen mana yang berubah saat state diperbarui.

`index % 2 === 0 ? "bg-white" : "bg-gray-50"`

Memberikan warna latar bergantian pada baris tabel untuk meningkatkan keterbacaan.

`navigate(\`/products/edit/${product._id}\`)`

Mengarahkan pengguna ke halaman edit product yang sesuai berdasarkan id-nya.

`setModal({ isOpen: true, id: product._id })`

Membuka modal dan menyimpan id product yang dipilih untuk dihapus.

---

## File: `src/pages/ProductCreatePage.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/product.api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.stock) newErrors.stock = "Stock is required";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await createProduct(form);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 flex flex-col gap-4">
        <Input label="Product Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} error={errors.price} />
        <Input label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} error={errors.stock} />
        <div className="flex gap-3 justify-end mt-2">
          <Button variant="secondary" onClick={() => navigate("/")}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Product"}</Button>
        </div>
      </form>
    </div>
  );
}
```

### Fungsi File

Halaman untuk menambah product baru. Berisi form dengan validasi sisi client sebelum data dikirim ke backend.

### Penjelasan Syntax

`const [form, setForm] = useState({ name: "", price: "", stock: "" });`

State tunggal untuk menampung semua nilai field form. Lebih efisien daripada membuat state terpisah per field.

`const [errors, setErrors] = useState({});`

State untuk menyimpan pesan error validasi per field.

`function handleChange(e)`

Fungsi yang dijalankan setiap kali nilai input berubah.

`setForm({ ...form, [e.target.name]: e.target.value });`

Memperbarui field yang berubah menggunakan computed property name `[e.target.name]`. Spread operator `...form` memastikan field lain tidak terhapus.

`setErrors({ ...errors, [e.target.name]: "" });`

Menghapus pesan error untuk field yang sedang diisi pengguna.

`function validate()`

Menjalankan validasi form dan mengembalikan objek berisi pesan error. Jika semua valid, objek yang dikembalikan kosong.

`e.preventDefault();`

Mencegah perilaku default form HTML yaitu mereload halaman.

`Object.keys(newErrors).length > 0`

Mengecek apakah ada error dari hasil validasi. Jika ada, set errors ke state dan hentikan proses submit.

`await createProduct(form);`

Mengirim data form ke API untuk disimpan ke database.

`navigate("/");`

Setelah berhasil menyimpan, pengguna diarahkan kembali ke halaman list.

---

## File: `src/pages/ProductEditPage.jsx`

```jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductById } from "../hooks/useProduct";
import { updateProduct } from "../api/product.api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProductById(id);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
      });
    }
  }, [product]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.stock) newErrors.stock = "Stock is required";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    try {
      await updateProduct(id, form);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 flex flex-col gap-4">
        <Input label="Product Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} error={errors.price} />
        <Input label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} error={errors.stock} />
        <div className="flex gap-3 justify-end mt-2">
          <Button variant="secondary" onClick={() => navigate("/")}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Updating..." : "Update Product"}</Button>
        </div>
      </form>
    </div>
  );
}
```

### Fungsi File

Halaman untuk mengubah data product yang sudah ada. Data lama diambil berdasarkan id dari URL, lalu ditampilkan di form agar pengguna bisa mengubahnya.

### Penjelasan Syntax

`const { id } = useParams();`

Mengambil nilai parameter `:id` dari URL. Misalnya jika URL adalah `/products/edit/abc123`, maka `id` bernilai `"abc123"`.

`const { product, loading } = useProductById(id);`

Memanggil custom hook untuk mengambil data product berdasarkan id.

`useEffect(() => { if (product) { setForm({ ... }); } }, [product]);`

Mengisi state form dengan data product setelah data berhasil dimuat. Efek ini berjalan setiap kali nilai `product` berubah, yaitu dari `null` menjadi objek setelah fetch selesai.

`await updateProduct(id, form);`

Mengirim data form yang sudah diubah ke API untuk memperbarui product di database.

---

## File: `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
```

### Fungsi File

File konfigurasi Vite. Mendaftarkan plugin yang digunakan dan mengatur proxy untuk development server.

### Penjelasan Syntax

`plugins: [react(), tailwindcss()]`

Mendaftarkan dua plugin: plugin React untuk mendukung JSX, dan plugin Tailwind CSS v4 untuk memproses utility class.

`server: { proxy: { "/api": "http://localhost:5000" } }`

Mengatur proxy sehingga setiap request ke `/api` dari frontend secara otomatis diteruskan ke `http://localhost:5000`. Ini menghindari masalah CORS selama development dan memudahkan penulisan URL di `api/product.api.js` tanpa perlu menyebut domain backend secara eksplisit.

---

## File: `.env`

```env
VITE_API_URL=/api
```

### Fungsi File

Menyimpan variabel environment untuk frontend. Di Vite, variabel harus menggunakan prefix `VITE_` agar bisa diakses di dalam kode JavaScript melalui `import.meta.env`.

### Penjelasan Syntax

`VITE_API_URL=/api`

Menyimpan base URL untuk API. Nilainya `/api` karena Vite proxy sudah mengurus penerusan ke backend. Jika suatu saat backend dipindah ke domain berbeda, cukup ubah nilai ini tanpa harus mengubah semua file yang menggunakannya.

---

## Alur Request CRUD Product

### Mengambil Semua Product (Read)

1. `ProductListPage` memanggil `useProducts()`.
2. Hook menjalankan `getProducts()` dari `api/product.api.js`.
3. Axios melakukan `GET /api/products`.
4. Vite proxy meneruskan request ke `http://localhost:5000/api/products`.
5. Data diterima, disimpan ke state `products`.
6. Komponen merender tabel berisi data product.

### Membuat Product (Create)

1. Pengguna mengisi form di `ProductCreatePage` dan klik tombol Save.
2. `handleSubmit` menjalankan validasi form.
3. Jika valid, memanggil `createProduct(form)` dari `api/product.api.js`.
4. Axios melakukan `POST /api/products` dengan body data form.
5. Setelah berhasil, `navigate("/")` mengarahkan ke halaman list.

### Mengubah Product (Update)

1. Pengguna klik tombol Edit di `ProductListPage`.
2. `navigate` mengarahkan ke `/products/edit/:id`.
3. `ProductEditPage` mengambil `id` dari URL via `useParams`.
4. `useProductById(id)` fetch data product lama dari API.
5. `useEffect` mengisi form dengan data lama saat data tersedia.
6. Pengguna mengubah data lalu klik Update.
7. `updateProduct(id, form)` mengirim `PUT` request ke API.
8. Setelah berhasil, diarahkan kembali ke halaman list.

### Menghapus Product (Delete)

1. Pengguna klik tombol Delete di `ProductListPage`.
2. State modal diubah menjadi `{ isOpen: true, id: product._id }`.
3. Komponen `Modal` tampil meminta konfirmasi.
4. Jika dikonfirmasi, `handleDelete` memanggil `deleteProduct(modal.id)`.
5. Axios melakukan `DELETE /api/products/:id`.
6. Modal ditutup dan `refetch()` dipanggil untuk memuat ulang data terbaru.

---

## Catatan Teknis

- Semua variabel environment di Vite wajib menggunakan prefix `VITE_`. Variabel tanpa prefix tidak akan terbaca di sisi client.
- Proxy Vite hanya aktif saat development. Di production, frontend dan backend perlu dikonfigurasi secara terpisah.
- Seluruh state form menggunakan controlled component, artinya React yang menjadi sumber kebenaran nilai input, bukan DOM.
- Custom hook di `hooks/useProduct.js` hanya menangani pengambilan data. Operasi create, update, dan delete dipanggil langsung dari halaman karena setelah operasi tersebut biasanya ada navigasi atau refetch yang perlu dikontrol dari komponen.
- Komponen `Button`, `Input`, dan `Modal` dirancang generic agar bisa dipakai di seluruh aplikasi tanpa perlu membuat ulang styling.