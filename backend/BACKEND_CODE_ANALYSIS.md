# Analisis Codebase Backend

Dokumen ini menjelaskan struktur backend, fungsi setiap folder dan file, serta fungsi syntax utama di setiap file. Analisis hanya mencakup folder `backend`.

## Gambaran Umum

Backend ini adalah REST API sederhana untuk CRUD data product menggunakan:

- `Express` sebagai framework HTTP server.
- `Mongoose` sebagai ODM untuk koneksi dan operasi MongoDB.
- `dotenv` untuk membaca konfigurasi dari file `.env`.
- `cors` untuk mengizinkan request dari origin lain, misalnya frontend.
- `nodemon` untuk menjalankan server development dengan auto-restart.

Alur utama aplikasi:

1. `server.js` membaca environment variable, connect ke MongoDB, lalu menjalankan server.
2. `app.js` membuat instance Express, memasang middleware, route, dan error handler.
3. Request ke `/api/products` diarahkan ke `routes/product.routes.js`.
4. Route memanggil function controller di `src/controllers/product.controller.js`.
5. Controller memakai model `Product` dari `src/models/product.model.js`.
6. Jika terjadi error, error dikirim ke middleware `src/middlewares/errorHandler.js`.

## Struktur Folder Backend

```text
backend/
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env
├── routes/
│   └── product.routes.js
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── product.controller.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   └── models/
│       └── product.model.js
└── node_modules/
```

Catatan: `node_modules/` berisi package hasil install dari npm. Folder ini bukan source code aplikasi, jadi biasanya tidak dianalisis file per file dan tidak perlu diubah manual.

## Penjelasan Folder

### `backend/`

Folder utama backend. Di sini terdapat file entry point server, konfigurasi package npm, environment variable, dan folder source code.

### `backend/routes/`

Berisi definisi endpoint API. Route bertugas memetakan kombinasi HTTP method dan URL ke function controller.

Contoh:

- `GET /api/products` diarahkan ke `getAllProducts`.
- `POST /api/products` diarahkan ke `createProduct`.
- `PUT /api/products/:id` diarahkan ke `updateProduct`.

### `backend/src/`

Folder source code utama backend selain entry point. Isinya dipisah berdasarkan tanggung jawab:

- `config/` untuk konfigurasi seperti koneksi database.
- `controllers/` untuk logic request dan response.
- `middlewares/` untuk function perantara Express.
- `models/` untuk schema dan model database.

### `backend/src/config/`

Berisi konfigurasi teknis aplikasi. Pada project ini digunakan untuk koneksi MongoDB.

### `backend/src/controllers/`

Berisi controller, yaitu function yang menerima request dari route, menjalankan logic aplikasi, berinteraksi dengan model, lalu mengirim response.

### `backend/src/middlewares/`

Berisi middleware Express. Middleware adalah function yang berjalan di tengah alur request-response. Pada project ini terdapat middleware untuk menangani error.

### `backend/src/models/`

Berisi model database. Model mendefinisikan struktur data, validasi field, dan menjadi interface untuk melakukan operasi database melalui Mongoose.

## File: `server.js`

```js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
```

### Fungsi File

`server.js` adalah entry point backend. File ini bertugas:

- Mengaktifkan pembacaan file `.env`.
- Mengambil instance Express dari `app.js`.
- Menghubungkan aplikasi ke MongoDB.
- Menjalankan HTTP server setelah database berhasil connect.

### Penjelasan Syntax

`import dotenv from "dotenv";`

Mengimpor package `dotenv`. Package ini digunakan agar variable di file `.env` bisa dibaca melalui `process.env`.

`import app from "./app.js";`

Mengimpor instance Express dari file `app.js`. Dengan pemisahan ini, konfigurasi app dan proses menjalankan server tidak dicampur dalam satu file.

`import connectDB from "./src/config/db.js";`

Mengimpor function koneksi database dari `src/config/db.js`.

`dotenv.config();`

Memuat isi file `.env` ke `process.env`. Contohnya `PORT` dan `MONGO_URI`.

`const PORT = process.env.PORT || 5000;`

Membuat constant `PORT`. Jika `PORT` ada di `.env`, nilai itu dipakai. Jika tidak ada, fallback ke `5000`.

`connectDB().then(() => { ... });`

Memanggil koneksi database. Karena `connectDB` adalah async function, return-nya berupa Promise. Method `.then()` dijalankan setelah koneksi berhasil.

`app.listen(PORT, () => { ... });`

Menjalankan server Express pada port yang sudah ditentukan.

`console.log(...)`

Menampilkan pesan di terminal bahwa server sudah berjalan.

## File: `app.js`

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes.js";
import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Error Handler (harus paling bawah)
app.use(errorHandler);

export default app;
```

### Fungsi File

`app.js` bertugas membuat dan mengatur aplikasi Express. File ini tidak menjalankan server langsung, tetapi menyiapkan konfigurasi aplikasi.

Isi tanggung jawabnya:

- Membuat instance Express.
- Memasang middleware global.
- Memasang route product.
- Memasang error handler.
- Mengekspor `app` agar bisa dijalankan oleh `server.js`.

### Penjelasan Syntax

`import express from "express";`

Mengimpor Express untuk membuat aplikasi HTTP API.

`import cors from "cors";`

Mengimpor middleware CORS. Ini membantu frontend dari origin berbeda agar bisa mengakses backend.

`import dotenv from "dotenv";`

Mengimpor dotenv. Di file ini juga dipanggil `dotenv.config()`, meskipun `server.js` sudah melakukannya. Ini tidak merusak aplikasi, tetapi secara konsep cukup dilakukan di entry point.

`import productRoutes from "./routes/product.routes.js";`

Mengimpor router product yang berisi endpoint CRUD product.

`import errorHandler from "./src/middlewares/errorHandler.js";`

Mengimpor middleware khusus untuk menangani error.

`const app = express();`

Membuat instance aplikasi Express. Instance ini dipakai untuk memasang middleware dan route.

`app.use(cors());`

Memasang middleware CORS ke semua request.

`app.use(express.json());`

Memasang middleware bawaan Express untuk membaca request body berformat JSON. Tanpa ini, `req.body` pada request `POST` atau `PUT` tidak akan terbaca sebagai object JavaScript.

`app.use("/api/products", productRoutes);`

Memasang route product dengan prefix `/api/products`. Artinya route `/` di dalam `productRoutes` akan menjadi `/api/products`.

`app.use(errorHandler);`

Memasang middleware error handler. Posisi ini harus setelah route agar error dari controller bisa ditangani di akhir alur request.

`export default app;`

Mengekspor instance Express agar bisa di-import oleh `server.js`.

## File: `routes/product.routes.js`

```js
import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../src/controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
```

### Fungsi File

File ini mendefinisikan endpoint CRUD untuk resource product. Router ini tidak memproses database langsung, tetapi meneruskan request ke controller.

Karena di `app.js` router ini dipasang dengan prefix `/api/products`, maka mapping endpoint akhirnya menjadi:

| Method | Endpoint | Controller | Fungsi |
| --- | --- | --- | --- |
| `GET` | `/api/products` | `getAllProducts` | Mengambil semua product |
| `GET` | `/api/products/:id` | `getProductById` | Mengambil satu product berdasarkan id |
| `POST` | `/api/products` | `createProduct` | Membuat product baru |
| `PUT` | `/api/products/:id` | `updateProduct` | Mengubah product berdasarkan id |
| `DELETE` | `/api/products/:id` | `deleteProduct` | Menghapus product berdasarkan id |

### Penjelasan Syntax

`import express from "express";`

Mengimpor Express agar bisa membuat router.

`import { ... } from "../src/controllers/product.controller.js";`

Mengimpor beberapa named export dari controller product. Named export artinya function diekspor dengan nama masing-masing, bukan sebagai default export.

`const router = express.Router();`

Membuat object router Express. Router berguna untuk mengelompokkan endpoint yang masih satu domain fitur.

`router.get("/", getAllProducts);`

Jika ada request `GET /api/products`, Express memanggil function `getAllProducts`.

`router.get("/:id", getProductById);`

Jika ada request `GET /api/products/:id`, Express memanggil function `getProductById`. Bagian `:id` adalah route parameter dan nilainya dapat dibaca melalui `req.params.id`.

`router.post("/", createProduct);`

Jika ada request `POST /api/products`, Express memanggil function `createProduct`.

`router.put("/:id", updateProduct);`

Jika ada request `PUT /api/products/:id`, Express memanggil function `updateProduct`.

`router.delete("/:id", deleteProduct);`

Jika ada request `DELETE /api/products/:id`, Express memanggil function `deleteProduct`.

`export default router;`

Mengekspor router agar bisa dipasang di `app.js`.

## File: `src/config/db.js`

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

### Fungsi File

File ini berisi function untuk menghubungkan backend ke MongoDB menggunakan Mongoose.

### Penjelasan Syntax

`import mongoose from "mongoose";`

Mengimpor Mongoose. Mongoose dipakai untuk koneksi MongoDB dan membuat model/schema.

`const connectDB = async () => { ... };`

Membuat async function bernama `connectDB`. Function ini asynchronous karena proses koneksi database membutuhkan waktu dan return Promise.

`try { ... } catch (error) { ... }`

Blok `try` menjalankan proses yang mungkin gagal. Jika gagal, error ditangkap oleh `catch`.

`const conn = await mongoose.connect(process.env.MONGO_URI);`

Menghubungkan aplikasi ke MongoDB menggunakan connection string dari `.env`. Keyword `await` membuat JavaScript menunggu sampai proses koneksi selesai.

`process.env.MONGO_URI`

Mengambil variable `MONGO_URI` dari environment. Nilai ini berasal dari file `.env` setelah `dotenv.config()` dijalankan.

`console.log(...)`

Menampilkan host MongoDB yang berhasil terkoneksi.

`console.error(...)`

Menampilkan pesan error jika koneksi gagal.

`process.exit(1);`

Menghentikan proses Node.js dengan exit code `1`. Exit code `1` biasanya berarti aplikasi berhenti karena error.

`export default connectDB;`

Mengekspor function agar bisa dipakai oleh `server.js`.

## File: `src/models/product.model.js`

```js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
```

### Fungsi File

File ini mendefinisikan schema dan model `Product`. Model ini menjadi perantara antara controller dan collection MongoDB.

Data product memiliki field:

| Field | Tipe | Validasi |
| --- | --- | --- |
| `name` | `String` | Wajib, spasi awal/akhir dihapus |
| `price` | `Number` | Wajib, minimal `0` |
| `stock` | `Number` | Wajib, minimal `0` |
| `createdAt` | `Date` | Otomatis dari `timestamps` |
| `updatedAt` | `Date` | Otomatis dari `timestamps` |

### Penjelasan Syntax

`import mongoose from "mongoose";`

Mengimpor Mongoose untuk membuat schema dan model.

`const productSchema = new mongoose.Schema(...);`

Membuat schema product. Schema adalah definisi bentuk dokumen yang akan disimpan di MongoDB.

`name: { ... }`

Mendefinisikan field `name`.

`type: String`

Menentukan bahwa nilai `name` harus berupa string.

`required: [true, "Name is required"]`

Menjadikan field wajib diisi. Jika kosong, Mongoose akan menghasilkan pesan error `"Name is required"`.

`trim: true`

Menghapus spasi di awal dan akhir string sebelum data disimpan.

`price: { ... }`

Mendefinisikan field `price`.

`type: Number`

Menentukan bahwa `price` harus berupa angka.

`min: [0, "Price cannot be negative"]`

Memberi validasi bahwa nilai minimum adalah `0`. Jika angka negatif, Mongoose mengembalikan pesan error.

`stock: { ... }`

Mendefinisikan field `stock`.

`min: [0, "Stock cannot be negative"]`

Memberi validasi agar stock tidak boleh negatif.

`{ timestamps: true }`

Opsi schema yang membuat Mongoose otomatis menambahkan field `createdAt` dan `updatedAt`.

`const Product = mongoose.model("Product", productSchema);`

Membuat model bernama `Product` dari `productSchema`. Mongoose biasanya membuat collection MongoDB dalam bentuk plural lowercase, yaitu `products`.

`export default Product;`

Mengekspor model agar bisa digunakan controller.

## File: `src/controllers/product.controller.js`

```js
import Product from "../models/product.model.js";
```

Controller mengimpor model `Product` agar bisa menjalankan query database.

### `getAllProducts`

```js
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
```

#### Fungsi

Mengambil semua product dari database.

#### Penjelasan Syntax

`export const getAllProducts = ...`

Membuat dan mengekspor function controller dengan nama `getAllProducts`.

`async (req, res, next) => { ... }`

Function asynchronous Express controller.

- `req` berisi data request.
- `res` digunakan untuk mengirim response.
- `next` digunakan untuk meneruskan error atau request ke middleware berikutnya.

`const products = await Product.find();`

Mengambil semua dokumen product dari database.

`res.status(200).json(...)`

Mengirim response HTTP status `200 OK` dalam format JSON.

`catch (error) { next(error); }`

Jika query gagal, error diteruskan ke middleware `errorHandler`.

### `getProductById`

```js
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
```

#### Fungsi

Mengambil satu product berdasarkan `id` dari URL.

#### Penjelasan Syntax

`Product.findById(req.params.id)`

Mencari product berdasarkan MongoDB ObjectId. Nilai `id` diambil dari URL parameter `:id`.

`if (!product) { ... }`

Mengecek apakah product tidak ditemukan.

`return res.status(404).json(...)`

Mengirim response `404 Not Found` dan menghentikan function agar kode setelahnya tidak dijalankan.

`res.status(200).json(...)`

Mengirim product jika ditemukan.

### `createProduct`

```js
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
```

#### Fungsi

Membuat product baru berdasarkan JSON body dari client.

#### Penjelasan Syntax

`Product.create(req.body)`

Membuat dokumen product baru dari body request. Contoh body:

```json
{
  "name": "Keyboard",
  "price": 250000,
  "stock": 10
}
```

`req.body`

Berisi data JSON yang dikirim client. Ini bisa terbaca karena `app.js` memakai `express.json()`.

`res.status(201).json(...)`

Mengirim response `201 Created`, yaitu status umum untuk data yang berhasil dibuat.

### `updateProduct`

```js
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
```

#### Fungsi

Mengubah data product berdasarkan `id`.

#### Penjelasan Syntax

`Product.findByIdAndUpdate(req.params.id, req.body, { ... })`

Mencari product berdasarkan `id`, lalu memperbarui datanya memakai `req.body`.

`new: true`

Mengatur agar hasil return adalah data terbaru setelah update. Jika tidak diatur, Mongoose dapat mengembalikan data lama sebelum update.

`runValidators: true`

Memastikan validasi schema tetap dijalankan saat update. Contohnya `price` dan `stock` tetap tidak boleh negatif.

`if (!product) { ... }`

Jika id tidak cocok dengan data apa pun, kirim `404 Not Found`.

`res.status(200).json(...)`

Mengirim response sukses berisi data product terbaru.

### `deleteProduct`

```js
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
```

#### Fungsi

Menghapus product berdasarkan `id`.

#### Penjelasan Syntax

`Product.findByIdAndDelete(req.params.id)`

Mencari product berdasarkan `id`, lalu menghapusnya dari database.

`if (!product) { ... }`

Jika product tidak ditemukan, kirim response `404`.

`res.status(200).json(...)`

Mengirim response sukses bahwa product sudah dihapus.

`next(error)`

Meneruskan error ke `errorHandler`, misalnya jika format `id` tidak valid sebagai ObjectId.

## File: `src/middlewares/errorHandler.js`

```js
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
```

### Fungsi File

File ini berisi middleware untuk menangani error secara terpusat. Controller cukup memanggil `next(error)`, lalu middleware ini yang menyusun response error.

### Penjelasan Syntax

`const errorHandler = (err, req, res, next) => { ... }`

Membuat Express error middleware. Middleware error Express memiliki 4 parameter:

- `err`: object error.
- `req`: request dari client.
- `res`: response yang akan dikirim.
- `next`: function untuk lanjut ke middleware berikutnya.

`const statusCode = res.statusCode === 200 ? 500 : res.statusCode;`

Menentukan status code error.

- Jika status masih `200`, artinya belum ada status error yang diset, maka digunakan `500`.
- Jika sebelumnya sudah ada status lain, status itu dipakai.

`res.status(statusCode).json(...)`

Mengirim response JSON dengan status code yang sudah ditentukan.

`success: false`

Menandakan request gagal.

`message: err.message || "Internal Server Error"`

Mengirim pesan error dari object error. Jika tidak ada pesan, gunakan default `"Internal Server Error"`.

`stack: process.env.NODE_ENV === "development" ? err.stack : undefined`

Menampilkan stack trace hanya saat mode development. Ini bagus karena stack trace tidak seharusnya ditampilkan di production.

`export default errorHandler;`

Mengekspor middleware agar bisa dipasang di `app.js`.

## File: `package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongoose": "^9.6.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

### Fungsi File

`package.json` adalah file konfigurasi npm untuk backend. File ini menyimpan nama project, script command, dependency, dan dev dependency.

### Penjelasan Syntax

`"name": "backend"`

Nama package/project.

`"version": "1.0.0"`

Versi project.

`"main": "index.js"`

Entry default package menurut npm. Pada project ini server sebenarnya dijalankan dari `server.js` melalui script.

`"scripts"`

Berisi command npm yang bisa dijalankan.

`"start": "node server.js"`

Menjalankan backend dengan Node.js biasa.

Command:

```bash
npm start
```

`"dev": "nodemon server.js"`

Menjalankan backend dengan nodemon. Nodemon akan restart otomatis saat file berubah.

Command:

```bash
npm run dev
```

`"test": "echo \"Error: no test specified\" && exit 1"`

Script test placeholder. Saat ini belum ada test sungguhan.

`"dependencies"`

Package yang dibutuhkan saat aplikasi berjalan.

- `cors`: middleware CORS.
- `dotenv`: membaca `.env`.
- `express`: framework HTTP API.
- `mongoose`: koneksi dan model MongoDB.

`"devDependencies"`

Package yang hanya dibutuhkan saat development.

- `nodemon`: auto-restart server saat file berubah.

## File: `package-lock.json`

### Fungsi File

`package-lock.json` adalah file lock dependency yang dibuat otomatis oleh npm. File ini menyimpan versi dependency yang benar-benar terinstall agar install berikutnya konsisten.

File ini biasanya tidak diedit manual. Saat menjalankan `npm install`, npm dapat memperbarui file ini jika ada perubahan dependency.

## File: `.env`

Contoh struktur:

```env
PORT=5000
MONGO_URI=...
```

### Fungsi File

`.env` menyimpan konfigurasi rahasia atau konfigurasi yang berbeda antara environment development dan production.

Pada backend ini:

- `PORT` menentukan port server.
- `MONGO_URI` menentukan connection string MongoDB.

### Penjelasan Syntax

`PORT=5000`

Menyimpan nilai port. Nilai ini dibaca lewat `process.env.PORT`.

`MONGO_URI=...`

Menyimpan connection string MongoDB. Nilai ini dibaca lewat `process.env.MONGO_URI`.

Catatan keamanan: isi `.env` tidak sebaiknya dibagikan atau di-commit ke repository publik karena dapat berisi username, password, token, atau connection string database.

## Alur Request CRUD Product

### Mengambil Semua Product

1. Client mengirim `GET /api/products`.
2. `app.js` meneruskan request ke `productRoutes`.
3. `product.routes.js` memanggil `getAllProducts`.
4. Controller menjalankan `Product.find()`.
5. Response dikirim dengan status `200`.

### Mengambil Product Berdasarkan ID

1. Client mengirim `GET /api/products/:id`.
2. Route mengambil `id` dari URL.
3. Controller menjalankan `Product.findById(req.params.id)`.
4. Jika data tidak ada, response `404`.
5. Jika ada, response `200` berisi data product.

### Membuat Product

1. Client mengirim `POST /api/products` dengan body JSON.
2. `express.json()` membaca body tersebut.
3. Controller menjalankan `Product.create(req.body)`.
4. Mongoose memvalidasi data berdasarkan schema.
5. Jika valid, response `201` berisi data baru.

### Mengubah Product

1. Client mengirim `PUT /api/products/:id` dengan body JSON.
2. Controller menjalankan `Product.findByIdAndUpdate(...)`.
3. Opsi `runValidators: true` memastikan validasi schema tetap jalan.
4. Jika id tidak ditemukan, response `404`.
5. Jika berhasil, response `200` berisi data terbaru.

### Menghapus Product

1. Client mengirim `DELETE /api/products/:id`.
2. Controller menjalankan `Product.findByIdAndDelete(req.params.id)`.
3. Jika id tidak ditemukan, response `404`.
4. Jika berhasil, response `200` dengan pesan sukses.

## Catatan Teknis

- Project memakai ES Module syntax (`import` dan `export`). Agar ini berjalan stabil di Node.js, biasanya `package.json` perlu memiliki `"type": "module"`. Jika server saat dijalankan memunculkan error terkait module, tambahkan konfigurasi tersebut.
- Error untuk invalid MongoDB ObjectId akan masuk ke `catch` controller dan diteruskan ke `errorHandler`.
- Validasi model sudah ada untuk `name`, `price`, dan `stock`.
- `dotenv.config()` saat ini dipanggil di `server.js` dan `app.js`. Secara praktik cukup dipanggil sekali di entry point, tetapi kondisi sekarang tetap dapat berjalan.
- `.env` berisi data sensitif. Jangan tampilkan nilai asli connection string di dokumentasi publik.
