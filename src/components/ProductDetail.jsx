import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebaseconfig";
import Topnav from "./Topnav";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "./Footer";

// 1. GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  // 2. Ref for scoping
  const containerRef = useRef();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          const gallery = [...(productData.images || [])];
          if (productData.video) gallery.push(productData.video);

          setProduct({ ...productData, gallery });
          setSelectedMedia(gallery[0] || "");
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

      const filteredProducts = productsData.filter(
        (item) => item.category === category && item.id !== id
      );
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  // --- GSAP ANIMATIONS ---

  // A. Main Content Entry (Runs when 'loading' changes to false)
  useGSAP(() => {
    if (loading || !product) return; // Wait for data

    const tl = gsap.timeline();

    // 1. Back Button
    tl.from(".back-btn", { x: -20, opacity: 0, duration: 0.5, ease: "power2.out" })
    
    // 2. Main Image Section (Fade up)
      .from(".product-media-section", { 
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out" 
      }, "-=0.3")

    // 3. Text Details (Staggered slide in)
    // We target both mobile (.mobile-info) and desktop (.desktop-info) classes
      .from([".mobile-info-item", ".desktop-info-item"], {
        x: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.6");

  }, { dependencies: [loading, product], scope: containerRef });


  // B. Image Switch Animation (Runs when selectedMedia changes)
  useGSAP(() => {
    if (loading) return;
    // A quick "refresh" fade when changing images
    gsap.fromTo(".main-media-display",
      { opacity: 0.5, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
    );
  }, { dependencies: [selectedMedia], scope: containerRef });


  // C. Related Products (ScrollTrigger)
  useGSAP(() => {
    if (loading || relatedProducts.length === 0) return;

    ScrollTrigger.batch(".related-card", {
      start: "top 85%",
      onEnter: (batch) => {
        gsap.fromTo(batch,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
        );
      },
      once: true
    });
    
    ScrollTrigger.refresh();
  }, { dependencies: [relatedProducts, loading], scope: containerRef });


  if (loading) return <h2 className="text-center mt-10 text-gray-700">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-gray-700">{error}</h2>;

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 flex flex-col">
      <Topnav />

      <main className="flex-grow mt-32 md:mt-36 px-6 max-w-7xl mx-auto w-full">
        {/* Back button */}
        <Link
          to="/"
          className="back-btn flex items-center text-purple-600 font-medium mb-8 hover:underline w-fit"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Link>

        {/* ===== Product Section ===== */}
        <div className="flex flex-col md:flex-row md:items-start gap-10 overflow-x-hidden">
          
          {/* ===== Mobile View: Product Info on Top ===== */}
          <div className="block md:hidden mb-6">
            <h1 className="mobile-info-item text-3xl font-semibold text-gray-900 mb-3">
              {product.name}
            </h1>
            <p className="mobile-info-item text-xl text-purple-600 font-semibold mb-4">
              Ksh {product.price.toLocaleString()}
            </p>
            <p className="mobile-info-item text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            <button
              onClick={() => {
                const message = `Hello, I would like to order *${product.name}* for Ksh ${product.price.toLocaleString()}. Is it available?`;
                const encodedMessage = encodeURIComponent(message);
                const phoneNumber = "254103431253"; // Update phone number
                const imageUrl = product.images?.[0];
                window.open(
                  `https://wa.me/${phoneNumber}?text=${encodedMessage}%0A${imageUrl}`,
                  "_blank"
                );
              }}
              className="mobile-info-item bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md transition w-fit"
            >
              Order Now
            </button>
          </div>

          {/* ===== Left: Image + Thumbnails ===== */}
          <div className="product-media-section w-full md:w-1/2 flex flex-col md:flex-row items-start gap-4 overflow-hidden">
            {/* Thumbnails (Desktop - Vertical Scroll) */}
            <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-96 pr-1 flex-shrink-0">
              {product.gallery?.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedMedia(media)}
                  className={`w-20 h-20 border-2 rounded-md cursor-pointer overflow-hidden transition ${
                    selectedMedia === media
                      ? "border-purple-500 scale-105" // Added scale on active
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {media.includes(".mp4") ? (
                    <video src={media} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={media} alt="thumb" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 h-96 rounded-lg shadow-sm overflow-hidden flex items-center justify-center bg-white">
              {/* Added 'main-media-display' class for animation */}
              <div className="main-media-display w-full h-full flex items-center justify-center"> 
                {selectedMedia.includes(".mp4") ? (
                  <video
                    src={selectedMedia}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedMedia}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* Thumbnails (Mobile - Horizontal Scroll) */}
            <div className="flex md:hidden gap-3 mt-4 overflow-x-auto flex-nowrap pb-2 w-full scroll-smooth no-scrollbar">
              {product.gallery?.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedMedia(media)}
                  className={`flex-shrink-0 w-24 h-24 border-2 rounded-md cursor-pointer overflow-hidden ${
                    selectedMedia === media ? "border-purple-500" : "border-gray-300"
                  }`}
                >
                  {media.includes(".mp4") ? (
                    <video src={media} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={media} alt="thumb" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ===== Right: Product Info (Desktop only) ===== */}
          <div className="hidden md:flex flex-col w-full md:w-1/2">
            {/* Added 'desktop-info-item' class for stagger animation */}
            <h1 className="desktop-info-item text-4xl font-semibold text-gray-900 mb-3">
              {product.name}
            </h1>
            <p className="desktop-info-item text-2xl text-purple-600 font-semibold mb-4">
              Ksh {product.price.toLocaleString()}
            </p>
            <p className="desktop-info-item text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            <button
              onClick={() => {
                const message = `Hello, I would like to order *${product.name}* for Ksh ${product.price.toLocaleString()}. Is it available?`;
                const encodedMessage = encodeURIComponent(message);
                const phoneNumber = "254103431253"; 
                const imageUrl = product.images?.[0];
                window.open(
                  `https://wa.me/${phoneNumber}?text=${encodedMessage}%0A${imageUrl}`,
                  "_blank"
                );
              }}
              className="desktop-info-item bg-purple-500 hover:bg-gray-800 text-white px-10 py-3 rounded-md transition w-fit shadow-md hover:shadow-lg"
            >
              Order Now
            </button>
          </div>
        </div>

        {/* ===== Related Products ===== */}
        <div className="mt-16 mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  // Added 'related-card' class and opacity-0
                  className="related-card opacity-0 hover:shadow-lg transition-all rounded-lg p-2 bg-white block"
                >
                  <img
                    src={item.images?.[0] || "default-placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                  <p className="font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-purple-600 font-semibold text-sm">
                    Ksh {item.price.toLocaleString()}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No related products found.</p>
            )}
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default ProductDetail;











/*import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebaseconfig";
import Topnav from "./Topnav";
import { FaArrowLeft } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import Footer from "./Footer";

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
          if (productData.video) gallery.push(productData.video);

          setProduct({ ...productData, gallery });
          setSelectedMedia(gallery[0] || "");
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
     <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topnav />

      <main className="flex-grow mt-32 md:mt-36 px-6 max-w-7xl mx-auto w-full">
        {/* Back button *//*
        <Link
          to="/"
          className="flex items-center text-purple-600 font-medium mb-8 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Link>
            {/* ===== Product Section ===== *//*
<div className="flex flex-col md:flex-row md:items-start gap-10 overflow-x-hidden">
  {/* ===== Mobile View: Product Info on Top ===== *//*
  <div className="block md:hidden mb-6">
    <h1 className="text-3xl font-semibold text-gray-900 mb-3">
      {product.name}
    </h1>
    <p className="text-xl text-purple-600 font-semibold mb-4">
      Ksh {product.price.toLocaleString()}
    </p>
    <p className="text-gray-700 mb-6 leading-relaxed">
      {product.description}
    </p>

    <button
      onClick={() => {
        const message = `Hello, I would like to order *${product.name}* for Ksh ${product.price.toLocaleString()}. Is it available?`;
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "254103431253";
        const imageUrl = product.images?.[0];
        window.open(
          `https://wa.me/${phoneNumber}?text=${encodedMessage}%0A${imageUrl}`,
          "_blank"
        );
      }}
      className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md transition w-fit"
    >
      Order Now
    </button>
  </div>

  {/* ===== Left: Image + Thumbnails ===== *//*
  <div className="w-full md:w-1/2 flex flex-col md:flex-row items-start gap-4 overflow-hidden">
    {/* Thumbnails (Desktop - Vertical Scroll) *//*
    <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-96 pr-1 flex-shrink-0">
      {product.gallery?.map((media, index) => (
        <div
          key={index}
          onClick={() => setSelectedMedia(media)}
          className={`w-20 h-20 border-2 rounded-md cursor-pointer overflow-hidden transition ${
            selectedMedia === media
              ? "border-purple-500"
              : "border-gray-300"
          }`}
        >
          {media.includes(".mp4") ? (
            <video
              src={media}
              className="w-full h-full object-cover"
              muted
            />
          ) : (
            <img
              src={media}
              alt="thumb"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>

    {/* Main Image *//*
    <div className="flex-1 h-96 rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
      {selectedMedia.includes(".mp4") ? (
        <video
          src={selectedMedia}
          controls
          className="w-full h-full object-contain"
        />
      ) : (
        <img
          src={selectedMedia}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      )}
    </div>

    {/* Thumbnails (Mobile - Horizontal Scroll) *//*
    <div className="flex md:hidden gap-3 mt-4 overflow-x-auto flex-nowrap pb-2 w-full scroll-smooth no-scrollbar">
      {product.gallery?.map((media, index) => (
        <div
          key={index}
          onClick={() => setSelectedMedia(media)}
          className={`flex-shrink-0 w-24 h-24 border-2 rounded-md cursor-pointer overflow-hidden ${
            selectedMedia === media
              ? "border-purple-500"
              : "border-gray-300"
          }`}
        >
          {media.includes(".mp4") ? (
            <video
              src={media}
              className="w-full h-full object-cover"
              muted
            />
          ) : (
            <img
              src={media}
              alt="thumb"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  </div>

  {/* ===== Right: Product Info (Desktop only) ===== *//*
  <div className="hidden md:flex flex-col w-full md:w-1/2">
    <h1 className="text-4xl font-semibold text-gray-900 mb-3">
      {product.name}
    </h1>
    <p className="text-2xl text-purple-600 font-semibold mb-4">
      Ksh {product.price.toLocaleString()}
    </p>
    <p className="text-gray-700 mb-6 leading-relaxed">
      {product.description}
    </p>

    <button
      onClick={() => {
        const message = `Hello, I would like to order *${product.name}* for Ksh ${product.price.toLocaleString()}. Is it available?`;
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "254103431253";
        const imageUrl = product.images?.[0];
        window.open(
          `https://wa.me/${phoneNumber}?text=${encodedMessage}%0A${imageUrl}`,
          "_blank"
        );
      }}
      className="bg-purple-500 hover:bg-gray-800 text-white px-10 py-3 rounded-md transition w-fit"
    >
      Order Now
    </button>
  </div>
</div>


        {/* ===== Related Products ===== *//*
        <div className="mt-16 mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="hover:shadow-lg transition-all rounded-lg p-2 bg-white"
                >
                  <img
                    src={item.images?.[0] || "default-placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-purple-600 font-semibold text-sm">
                    Ksh {item.price.toLocaleString()}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No related products found.</p>
            )}
          </div>
        </div>
      </main>

      {/* ===== Footer ===== *//*
      <Footer/>
    </div>
  );
};

export default ProductDetail;*/
