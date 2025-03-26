import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebaseconfig";
import Topnav from "./Topnav";
import { FaArrowLeft } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          const gallery = [...(productData.images || [])];

          if (productData.video) {
            gallery.push(productData.video);
          }

          setProduct({ ...productData, gallery });
          setSelectedMedia(gallery[0] || "");

          // Fetch related products after setting product data
          fetchRelatedProducts(productData.category);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]); 

  const fetchRelatedProducts = async (category) => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter products that match the same category but exclude the current product
      const filteredProducts = productsData.filter(
        (item) => item.category === category && item.id !== id
      );

      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  if (loading) return <h2 className="text-center mt-10 text-gray-700">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-gray-700">{error}</h2>;

  return (
    <div>
      <Topnav />
      <div className="mt-36">
        <Link
          to="/"
          className="flex items-center space-x-2 text-purple-500 font-bold px-4 py-2 border border-purple-500 rounded-lg w-28 mx-3 cursor-pointer hover:bg-black"
        >
          <FaArrowLeft />
          <span>Back</span>
        </Link>
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto items-center justify-center">
        <div className="w-full md:w-1/12 flex flex-col gap-2">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Gallery</h3>
          <div className="grid grid-cols-4 md:grid-cols-1 gap-2">
            {product?.gallery?.map((media, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-lg overflow-hidden p-1 transition-all hover:border ${
                  selectedMedia === media ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedMedia(media)}
              >
                {media.includes(".mp4") ? (
                  <video src={media} className="w-full h-16 object-cover rounded-md" />
                ) : (
                  <img src={media} alt="Thumbnail" className="w-full h-16 self-center object-contain rounded-md" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row items-center">
          {selectedMedia.includes(".mp4") ? (
            <video src={selectedMedia} controls className="w-full max-w-lg h-96 object-cover rounded-md" />
          ) : (
            <img src={selectedMedia} alt={product.name} className="w-3/4 max-w-lg h-96 object-contain rounded-md " />
          )}
          <div className="mt-6 text-center px-5">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl text-gray-600 mt-2 font-medium">Ksh {product.price.toLocaleString()}</p>
            <p className="mt-4 text-gray-700 leading-relaxed px-4">{product.description}</p>

            <button
              onClick={() => {
                const message = `Hello, I would like to order *${product.name}* for Ksh ${product.price.toLocaleString()}. Is it available?`;
                const encodedMessage = encodeURIComponent(message);
                const imageUrl = product.images?.[0];
                const phoneNumber = "254103431253";

                window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}%0A${imageUrl}`, "_blank");
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg mt-4 transition-all shadow-md"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="border rounded-lg p-2 shadow hover:shadow-lg transition-all"
              >
                <img
                  src={item.images?.[0] || "default-placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="md:text-lg sm:text-sm font-bold text-gray-900 mt-2">{item.name}</h3>
                <p className="text-purple-600 font-semibold">Ksh {item.price.toLocaleString()}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
