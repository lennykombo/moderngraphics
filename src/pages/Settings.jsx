import React, { useState, useEffect } from 'react';
import { db } from "../components/firebaseconfig";
import { collection, doc, setDoc, getDocs, deleteDoc, orderBy, query } from "firebase/firestore";

function Settings() {
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const bannersCollection = collection(db, "banners");
      const bannersQuery = query(bannersCollection, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(bannersQuery);

      const bannersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBanners(bannersData);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBanner(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async () => {
    if (!banner) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", banner);
    formData.append("upload_preset", "moderntech");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dpbnggtof/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const imageUrl = data.secure_url;
      setImageUrl(imageUrl);
      await saveImageToFirebase(imageUrl);
      fetchBanners(); // Refresh banner list after upload
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const saveImageToFirebase = async (imageUrl) => {
    try {
      await setDoc(doc(db, "banners", banner.name), {
        imageUrl: imageUrl,
        timestamp: new Date(),
      });
      console.log("Image URL saved to Firestore:", imageUrl);
    } catch (error) {
      console.error("Error saving image URL to Firestore", error);
    }
  };

  const deleteBanner = async (id) => {
    try {
      await deleteDoc(doc(db, "banners", id));
      setBanners(banners.filter(banner => banner.id !== id));
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Upload Banner</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Preview:</p>
          <img src={preview} alt="Banner Preview" className="w-full h-auto rounded-lg shadow-md" />
        </div>
      )}
      <button
        onClick={uploadToCloudinary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && <p className="mt-2 text-green-500">Image uploaded successfully!</p>}

      {/* List of Uploaded Banners */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Uploaded Banners</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="relative border p-2 rounded-lg shadow-md">
              <img src={banner.imageUrl} alt="Uploaded Banner" className="w-full h-auto rounded" />
              <button
                onClick={() => deleteBanner(banner.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
