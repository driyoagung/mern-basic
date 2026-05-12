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
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/products/edit/${product._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setModal({ isOpen: true, id: product._id })}
                    >
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
