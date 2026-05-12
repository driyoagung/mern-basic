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
        <Input
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          error={errors.stock}
        />
        <div className="flex gap-3 justify-end mt-2">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
