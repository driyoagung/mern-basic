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
