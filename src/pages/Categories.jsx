import React, { useState } from "react";
import { db } from "../components/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

function Categories() {
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
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
  };

  return (
   <div>
     <div className="max-w-xl p-6">
        {!showForm ? (
          <div>
            <h2 className="text-2xl font-bold mb-3">Categories</h2>
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded"
              onClick={() => setShowForm(true)}
            >
              + Add New Category
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">
              Add a new category
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
              {image && <p className="mt-2 text-sm">Selected: {image.name}</p>}
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
