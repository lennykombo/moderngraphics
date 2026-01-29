import React, { useState, useEffect } from "react";
import { db } from "../components/firebaseconfig";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { MdClose, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";


const Product = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [video, setVideo] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [editMenuOpen, setEditMenuOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editProduct, setEditProduct] = useState(null);


  const handleEditMenuToggle = (productId) => {
    setEditMenuOpen(editMenuOpen === productId ? null : productId); // Toggle dropdown
  };  

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategoryList(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  // Fetch products from Firestore
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []);

const handleEditProduct = (product) => {
  setEditProduct(product);
};

/*const handleUpdateProduct = async () => {
  if (!editProduct) return;

  try {
    await updateDoc(doc(db, "products", editProduct.id), {
      name: editProduct.name,
      price: parseFloat(editProduct.price),
      category: editProduct.category,
      description: editProduct.description,
      images: editProduct.images,
      video: editProduct.video,
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === editProduct.id ? editProduct : p))
    );

    setEditProduct(null);
  } catch (error) {
    console.error("Error updating product:", error);
  }
};*/

//works on the update
const uploadVideoToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "moderntech");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dpbnggtof/video/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error);
    return null;
  }
};

/*const handleUpdateProduct = async () => {
  if (!editProduct) return;

  let videoUrl = editProduct.video;
  if (video && typeof video !== "string") {
    videoUrl = await uploadVideoToCloudinary(video);
  }

  try {
    await updateDoc(doc(db, "products", editProduct.id), {
      name: editProduct.name,
      price: parseFloat(editProduct.price),
      category: editProduct.category,
      description: editProduct.description,
      images: editProduct.images,
      video: videoUrl,
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === editProduct.id ? { ...editProduct, video: videoUrl } : p))
    );

    setEditProduct(null);
  } catch (error) {
    console.error("Error updating product:", error);
  }
};*/
const handleUpdateProduct = async () => {
  if (!editProduct || !editProduct.id) {
    console.error("Product ID or editProduct is missing!");
    return;
  }

  let imageUrl = editProduct.image || ""; // Keep existing image if not updated
  let videoUrl = editProduct.video || ""; // Keep existing video if not updated

  // Handle Image Upload
  if (editProduct.image && typeof editProduct.image === "string" && editProduct.image.startsWith("blob:")) {
    if (!editProduct.imageFile) {
      console.error("Image file is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("file", editProduct.imageFile);
    formData.append("upload_preset", "moderntech");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dpbnggtof/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      imageUrl = data.secure_url;
    } catch (error) {
      console.error("Cloudinary image upload failed:", error);
      return;
    }
  }

  // Handle Video Upload
  if (editProduct.video && typeof editProduct.video === "string" && editProduct.video.startsWith("blob:")) {
    if (!editProduct.videoFile) {
      console.error("Video file is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("file", editProduct.videoFile);
    formData.append("upload_preset", "moderntech");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dpbnggtof/video/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      videoUrl = data.secure_url;
    } catch (error) {
      console.error("Cloudinary video upload failed:", error);
      return;
    }
  }

  // Update Firestore
  try {
    const productRef = doc(db, "products", editProduct.id);
    await updateDoc(productRef, {
      name: editProduct.name,
      price: editProduct.price,
      category: editProduct.category,
      description: editProduct.description,
      image: imageUrl,
      video: videoUrl,
    });

    alert("Product updated successfully!");
    setEditProduct(null);
  } catch (error) {
    console.error("Error updating product:", error);
  }
};


/*const handleVideoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setEditProduct((prev) => ({ ...prev, video: URL.createObjectURL(file) }));
  }
};*/
const handleVideoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setVideo(file);
    setEditProduct((prev) => ({ ...prev, video: URL.createObjectURL(file) }));
  }
};

const handleRemoveVideoedit = () => {
  setEditProduct((prev) => ({ ...prev, video: null }));
};

const handleImageChange = (event) => {
  const files = Array.from(event.target.files);
  setEditProduct((prev) => ({
    ...prev,
    images: [...(prev.images || []), ...files.map((file) => URL.createObjectURL(file))],
  }));
};

const handleRemoveditImage = (index) => {
  setEditProduct((prev) => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index),
  }));
};

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
  
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "moderntech"); // Replace with Cloudinary preset
  
        try {
          const response = await fetch("https://api.cloudinary.com/v1_1/dpbnggtof/image/upload", {
            method: "POST",
            body: formData,
          });
  
          const data = await response.json();
          return { url: data.secure_url, file };
        } catch (error) {
          console.error("Cloudinary image upload failed", error);
          return null;
        }
      })
    );
  
    setProductImages([...productImages, ...uploadedImages.filter(img => img !== null)]);
  };
  

  const handleRemoveImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  
  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "moderntech"); // Replace with Cloudinary preset
  
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dpbnggtof/video/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      setVideo({ url: data.secure_url, file: file.name });
    } catch (error) {
      console.error("Cloudinary video upload failed", error);
    }
  };
  

  const handleRemoveVideo = () => {
    setVideo(null);
  };


const handleAddProduct = async () => {
  if (!productName || !price || productImages.length === 0) {
    alert("Please fill in all fields!");
    return;
  }

  const newProduct = {
    name: productName,
    images: productImages.map(img => img.url), // Store Cloudinary image URLs
    category: categories,
    description,
    price: parseFloat(price),
    video: video ? video.url : null, // Store Cloudinary video URL
    createdAt: new Date(),
  };

  try {
    await addDoc(collection(db, "products"), newProduct); // Store in Firestore
    setProducts([...products, newProduct]); // Update UI
    setShowForm(false); // Hide form
    setProductName("");
    setProductImages([]);
    setCategories("");
    setDescription("");
    setPrice("");
    setVideo(null);
  } catch (error) {
    console.error("Error adding product: ", error);
  }
};

const handleDeleteProduct = async (productId) => {
  // 1. Confirm user intention
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    // 2. Delete from Firestore
    await deleteDoc(doc(db, "products", productId));

    // 3. Update local state to remove item immediately from UI
    setProducts((prevProducts) => 
      prevProducts.filter((product) => product.id !== productId)
    );
    
    // 4. Close the menu
    setEditMenuOpen(null);
    
    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product.");
  }
};


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {!showForm ? (
        <div>
          <h2 className="text-2xl font-bold">Product List</h2>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded mt-4"
            onClick={() => setShowForm(true)}
          >
            + Add New Product
          </button>

          {/* Product List */}
          <div className="mt-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 border rounded mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Product List */}
      <div className="flex flex-col gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded p-4 flex flex-col md:flex-row items-center md:justify-between relative"
            >
              {/* Product Image */}
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded md:mr-4"
              />

              {/* Product Details */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-700">Ksh {product.price.toLocaleString()}</p>
              </div>

              {/* Edit Menu (Dropdown) */}
              <div className="relative">
                <button
                  className="text-gray-500 hover:text-blue-500"
                  onClick={() => handleEditMenuToggle(product.id)}
                >
                  <MdEdit size={20} />
                </button>

                {editMenuOpen === product.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg py-2 z-50">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => {
                        console.log("Editing product:", product);
                        setEditMenuOpen(null);
                        handleEditProduct(product)
                      }}
                    >
                      <MdEdit /> Edit
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-500"
                      onClick={() => {
                        console.log("Deleting product:", product);
                        handleDeleteProduct(product.id);
                        setEditMenuOpen(null);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-500"
                      onClick={() => setEditMenuOpen(null)}
                    >
                      <MdClose /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No products found.</p>
        )}
      </div>
    </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-purple-500">Add a new product</h2>
          <p className="text-gray-600">Create and manage your products.</p>

          {/* Product Form */}
          <div className="mt-4">
            <label className="block font-medium text-purple-500">Product name</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium text-purple-500">Product images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full p-2 border rounded mt-1"
              onChange={handleImageUpload}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {productImages.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={img.url} alt="Uploaded" className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-medium text-purple-500">Categories</label>
            {loadingCategories ? (
              <p className="text-gray-500">Loading categories...</p>
            ) : (
              <select
                className="w-full p-2 border rounded mt-1"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
              >
                <option value="">Select a category</option>
                {categoryList.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mt-4">
            <label className="block font-medium text-purple-500">Description</label>
            <textarea
              className="w-full p-2 border rounded mt-1"
              placeholder="Product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium text-purple-500">Price</label>
            <input
              type="number"
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium text-purple-500">Add a video?</label>
            <input
              type="file"
              accept="video/*"
              className="w-full p-2 border rounded mt-1"
              onChange={handleVideoUpload}
            />
            {video && (
              <div className="mt-2 relative">
                <video src={video.url} controls className="w-full h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 bg-white border border-gray-200 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition"
                  onClick={handleRemoveVideo}
                >
                  <MdClose size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowForm(false)}
            >
              CANCEL
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleAddProduct}
            >
              SAVE
            </button>
          </div>
        </div>
      )}

{editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={editProduct.name}
              onChange={(e) => setEditProduct((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="number"
              className="w-full p-2 border rounded mb-2"
              value={editProduct.price}
              onChange={(e) => setEditProduct((prev) => ({ ...prev, price: e.target.value }))}
            />
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
               className="w-full p-2 border rounded"
               value={editProduct.category}
               onChange={(e) =>
               setEditProduct((prev) => ({ ...prev, category: e.target.value }))
                }
               >
             <option value="">Select a category</option>
              {categoryList.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
                ))}
             </select>
             </div>

            <div className="mb-4">
              <label className="block text-gray-700">Product Images</label>
              <div className="flex flex-wrap gap-2">
                {editProduct.images && editProduct.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => handleRemoveditImage(index)}
                    >
                      <MdClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <input type="file" multiple onChange={handleImageChange} className="mt-2" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Product Video</label>
              {editProduct.video && (
                <div className="relative">
                  <video src={editProduct.video} controls className="w-full h-40 rounded" />
                  <button className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1" onClick={handleRemoveVideoedit}><MdClose size={14} /></button>
                </div>
              )}
              <input type="file" accept="video/*" onChange={handleVideoChange} className="mt-2" />
            </div>
            <div className="flex justify-between mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setEditProduct(null)}>Cancel</button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={handleUpdateProduct}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;