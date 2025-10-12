import React, { useState, useEffect } from "react";
import { db } from "../components/firebaseconfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, } from "firebase/firestore";

function Categories() {
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
   const [editingId, setEditingId] = useState(null);


    // ✅ Fetch categories
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(fetched);
    });
    return () => unsubscribe();
  }, [])

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "moderntech"); // Replace with your Cloudinary preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dpbnggtof/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url; // Returns the uploaded image URL
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

 /* const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Category name and description are required.");
      return;
    }

    setLoading(true);
    let imageUrl = "";

    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
      if (!imageUrl) {
        alert("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    try {
      await addDoc(collection(db, "categories"), {
        name: categoryName,
        description: categoryDescription,
        image: imageUrl,
        createdAt: new Date(),
      });
      alert("Category added successfully!");
      setCategoryName("");
      setCategoryDescription("");
      setImage(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    } finally {
      setLoading(false);
    }
  };*/

  const handleSubmit = async () => {
    if (!categoryName.trim() || !categoryDescription.trim()) {
      alert("Category name and description are required.");
      return;
    }

    setLoading(true);
    let imageUrl = "";

    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
      if (!imageUrl) {
        alert("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    try {
      if (editingId) {
        // ✅ Update existing category
        const docRef = doc(db, "categories", editingId);
        await updateDoc(docRef, {
          name: categoryName,
          description: categoryDescription,
          ...(imageUrl && { image: imageUrl }),
        });
        alert("Category updated successfully!");
      } else {
        // ✅ Add new category
        await addDoc(collection(db, "categories"), {
          name: categoryName,
          description: categoryDescription,
          image: imageUrl,
          createdAt: new Date(),
        });
        alert("Category added successfully!");
      }

      // Reset form
      setCategoryName("");
      setCategoryDescription("");
      setImage(null);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setCategoryName(cat.name);
    setCategoryDescription(cat.description);
    setImage(null);
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteDoc(doc(db, "categories", id));
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  return (
     <div className="max-w-5xl mx-auto p-6">
      {/* ====== Add/Edit Category Form ====== */}
      {!showForm ? (
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={() => setShowForm(true)}
          >
            + Add New Category
          </button>
        </div>
      ) : (
        <div className="bg-white p-5 rounded shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">
            {editingId ? "Edit Category" : "Add a New Category"}
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Add category name"
              className="w-full p-2 border rounded mt-1"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Category Description
            </label>
            <textarea
              placeholder="Enter category description"
              className="w-full p-2 border rounded mt-1"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded mt-1"
              onChange={handleImageUpload}
            />
            {image && <p className="mt-2 text-sm text-gray-600">Selected: {image.name}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setCategoryName("");
                setCategoryDescription("");
                setImage(null);
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Category"
                : "Save Category"}
            </button>
          </div>
        </div>
      )}

      {/* ====== Display Categories ====== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <p className="text-gray-500 italic">No categories added yet.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition"
            >
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {cat.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {cat.description || "No description provided."}
                </p>
                {/*<p className="text-xs text-gray-400 mt-2">
                  Added on:{" "}
                  {cat.createdAt?.toDate
                    ? cat.createdAt.toDate().toLocaleDateString()
                    : new Date(cat.createdAt).toLocaleDateString()}
                </p>*/}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Categories;
