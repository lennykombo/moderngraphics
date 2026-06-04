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
  // --- NEW STATES FOR PERSONALIZATION ---
const [giftWrap, setGiftWrap] = useState(false);
//const [engraving, setEngraving] = useState(false);
const [cardType, setCardType] = useState("");
const [specialInstructions, setSpecialInstructions] = useState("");

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

  const handleOrder = () => {
  // 1. Build the detailed message using the states
  const message = `*NEW ORDER REQUEST*
--------------------------
*Product:* ${product.name}
*Price:* Ksh ${product.price.toLocaleString()}
--------------------------
*Gift Wrapping:* ${giftWrap ? "Yes" : "No"}
*Card:* ${cardType || "None"}
*Special Instructions:* ${specialInstructions || "None"}
--------------------------
Is this available?`;

  // 2. Encode and open WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "254717050901";
  const imageUrl = product.images?.[0] || "";
  
  window.open(
    `https://wa.me/${phoneNumber}?text=${encodedMessage}%0A%0A*Product Image:* ${imageUrl}`,
    "_blank"
  );
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
      /*.from([".mobile-info-item", ".desktop-info-item"], {
        x: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.6");*/

      .from(".animate-text-item", {
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

     {/* <main className="flex-grow mt-32 md:mt-36 px-6 max-w-7xl mx-auto w-full">
        {/* Back button *//*
        <Link
          to="/"
          className="back-btn flex items-center text-purple-600 font-medium mb-8 hover:underline w-fit"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Link>

        {/* ===== Product Section ===== *//*
        <div className="flex flex-col md:flex-row md:items-start gap-10 overflow-x-hidden">
          
          {/* ===== Mobile View: Product Info on Top ===== *//*
          <div className="block md:hidden mb-6">
            <h1 className="animate-text-item, mobile-info-item text-3xl font-semibold text-gray-900 mb-3">
              {product.name}
            </h1>
            <p className="animate-text-item, mobile-info-item text-xl text-purple-600 font-semibold mb-4">
              Ksh {product.price.toLocaleString()}
            </p>
            <p className="animate-text-item, mobile-info-item text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4 my-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
  <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Personalization Options</h3>
  
  {/* Checkboxes *//*
  <div className="flex flex-col gap-3">
    <label className="flex items-center space-x-3 cursor-pointer group">
      <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="w-5 h-5 accent-purple-600 rounded" />
      <span className="text-gray-700 group-hover:text-purple-600 transition">Gift Wrapping Required</span>
    </label>

    {/*<label className="flex items-center space-x-3 cursor-pointer group">
      <input type="checkbox" checked={engraving} onChange={(e) => setEngraving(e.target.checked)} className="w-5 h-5 accent-purple-600 rounded" />
      <span className="text-gray-700 group-hover:text-purple-600 transition">Engraving/ Branding required</span>
    </label>*//*
  </div>

  {/* Card Selection Dropdown *//*
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">I need a Card (Kindly specify type)</label>
    <select 
      value={cardType} 
      onChange={(e) => setCardType(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
    >
      <option value="">No Card needed</option>
      <option value="Birthday">Birthday</option>
      <option value="Love/Romantic">Love/Romantic</option>
      <option value="Anniversary">Anniversary</option>
      <option value="Congratulations">Congratulations</option>
      <option value="Other">Other (Specify below)</option>
    </select>
  </div>

  {/* Instructions Textarea *//*
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Special instructions / Card Message</label>
    <textarea 
      rows="3"
      placeholder="Enter details for engraving or card messages here..."
      value={specialInstructions}
      onChange={(e) => setSpecialInstructions(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
    ></textarea>
  </div>
</div>

            <button
             /* onClick={() => {
                const message = `Hello, I would like to order *${product.name}* for Ksh ${product.price.toLocaleString()}. Is it available?`;
                const encodedMessage = encodeURIComponent(message);
                const phoneNumber = "254103431253"; // Update phone number
                const imageUrl = product.images?.[0];
                window.open(
                  `https://wa.me/${phoneNumber}?text=${encodedMessage}%0A${imageUrl}`,
                  "_blank"
                );
              }}*//*
             onClick={handleOrder}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md transition w-fit"
            >
              Order Now
            </button>
          </div>

          {/* ===== Left: Image + Thumbnails ===== *//*
          <div className="product-media-section w-full md:w-1/2 flex flex-col md:flex-row items-start gap-4 overflow-hidden">
            {/* Thumbnails (Desktop - Vertical Scroll) *//*
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
                    <img src={media} alt="thumb" className="w-full h-full object-cover" 
                    onContextMenu={(e) => e.preventDefault()} // Disables Right-Click
                    onDragStart={(e) => e.preventDefault()} />
                  )}
                </div>
              ))}
            </div>

            {/* Main Image *//*
           
<div className="flex-1 h-96 rounded-lg shadow-sm overflow-hidden flex items-center justify-center bg-white relative">
  {/* The 'main-media-display' class is kept here for GSAP animations *//*
  <div className="main-media-display w-full h-full flex items-center justify-center relative"> 
    {selectedMedia.includes(".mp4") ? (
      /* Videos remain unprotected so users can click 'Play/Pause' *//*
      <video
        src={selectedMedia}
        controls
        className="w-full h-full object-contain"
      />
    ) : (
      /* Protected Image Wrapper *//*
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={selectedMedia}
          alt={product.name}
          // pointer-events-none: browser ignores clicks on the image
          // select-none: stops the "ghost" image from appearing when trying to highlight
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* THE SHIELD: This invisible layer catches the right-click and drag *//*
        <div 
          className="absolute inset-0 z-10 bg-transparent"
          onContextMenu={(e) => e.preventDefault()} // Blocks "Save Image As..."
          onDragStart={(e) => e.preventDefault()}   // Blocks dragging to desktop
        />
      </div>
    )}
  </div>
</div>

            {/* Thumbnails (Mobile - Horizontal Scroll) *//*
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
                    <img src={media} alt="thumb" className="w-full h-full object-cover" 
                    onContextMenu={(e) => e.preventDefault()} // Disables Right-Click
                    onDragStart={(e) => e.preventDefault()} 
                    />
                  )}
                </div>
              ))}
             </div>
          </div>

          {/* ===== Right: Product Info (Desktop only) ===== *//*
          <div className="hidden md:flex flex-col w-full md:w-1/2">
            {/* Added 'desktop-info-item' class for stagger animation *//*
            <h1 className="animate-text-item, desktop-info-item text-4xl font-semibold text-gray-900 mb-3">
              {product.name}
            </h1>
            <p className="animate-text-item, desktop-info-item text-2xl text-purple-600 font-semibold mb-4">
              Ksh {product.price.toLocaleString()}
            </p>
            <p className="animate-text-item, desktop-info-item text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4 my-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
  <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Personalization Options</h3>
  
  {/* Checkboxes *//*
  <div className="flex flex-col gap-3">
    <label className="flex items-center space-x-3 cursor-pointer group">
      <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="w-5 h-5 accent-purple-600 rounded" />
      <span className="text-gray-700 group-hover:text-purple-600 transition">Gift Wrapping Required</span>
    </label>

    {/*<label className="flex items-center space-x-3 cursor-pointer group">
      <input type="checkbox" checked={engraving} onChange={(e) => setEngraving(e.target.checked)} className="w-5 h-5 accent-purple-600 rounded" />
      <span className="text-gray-700 group-hover:text-purple-600 transition">Engraving/ Branding required</span>
    </label>*//*
  </div>

  {/* Card Selection Dropdown *//*
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">I need a Card (Kindly specify type)</label>
    <select 
      value={cardType} 
      onChange={(e) => setCardType(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
    >
      <option value="">No Card needed</option>
      <option value="Birthday">Birthday</option>
      <option value="Love/Romantic">Love/Romantic</option>
      <option value="Anniversary">Anniversary</option>
      <option value="Congratulations">Congratulations</option>
      <option value="Other">Other (Specify below)</option>
    </select>
  </div>

  {/* Instructions Textarea *//*
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Special instructions / Card Message</label>
    <textarea 
      rows="3"
      placeholder="Enter details for engraving or card messages here..."
      value={specialInstructions}
      onChange={(e) => setSpecialInstructions(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
    ></textarea>
  </div>
</div>

            <button
              /*onClick={() => {
                const message = `Hello, I would like to order *${product.name}* for Ksh ${product.price.toLocaleString()}. Is it available?`;
                const encodedMessage = encodeURIComponent(message);
                const phoneNumber = "254103431253"; 
                const imageUrl = product.images?.[0];
                window.open(
                  `https://wa.me/${phoneNumber}?text=${encodedMessage}%0A${imageUrl}`,
                  "_blank"
                );
              }}*//*
             onClick={handleOrder}
              className="bg-purple-500 hover:bg-gray-800 text-white px-10 py-3 rounded-md transition w-fit shadow-md hover:shadow-lg"
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
                  // Added 'related-card' class and opacity-0
                  className="related-card opacity-0 hover:shadow-lg transition-all rounded-lg p-2 bg-white block"
                >
                  <img
                    src={item.images?.[0] || "default-placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md mb-2"
                    onContextMenu={(e) => e.preventDefault()} // Disables Right-Click
                    onDragStart={(e) => e.preventDefault()} 
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
      </main>*/}

      <main className="flex-grow mt-32 md:mt-36 px-6 max-w-7xl mx-auto w-full">
  {/* Back button */}
  <Link
    to="/"
    className="back-btn flex items-center text-purple-600 font-medium mb-8 hover:underline w-fit"
  >
    <FaArrowLeft className="mr-2" /> Back
  </Link>

  {/* Outer Wrapper: Column on mobile, Row on desktop */}
  <div className="flex flex-col md:flex-row md:items-start gap-10 overflow-x-hidden">
    
    {/* --- COLUMN 1: (TOP on Mobile, LEFT on Desktop) --- */}
    <div className="w-full md:w-1/2">
      
      {/* A. MOBILE-ONLY HEADER: Name and Price at the very top */}
      <div className="md:hidden mb-6">
        <h1 className="animate-text-item text-3xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h1>
        <p className="animate-text-item text-xl text-purple-600 font-bold mb-3">
          Ksh {product.price.toLocaleString()}
        </p>
        <p className="animate-text-item text-gray-700 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* B. MEDIA SECTION: This now falls under the price on mobile */}
      <div className="product-media-section w-full flex flex-col md:flex-row items-start gap-4">
        {/* Desktop Thumbnails (Vertical) */}
        <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-96 pr-1 flex-shrink-0">
          {product.gallery?.map((media, index) => (
            <div
              key={index}
              onClick={() => setSelectedMedia(media)}
              className={`w-20 h-20 border-2 rounded-md cursor-pointer overflow-hidden transition relative ${
                selectedMedia === media ? "border-purple-500 scale-105" : "border-gray-300"
              }`}
            >
              {media.includes(".mp4") ? (
                <video src={media} className="w-full h-full object-cover" muted />
              ) : (
                <img src={media} className="w-full h-full object-cover pointer-events-none" 
                onContextMenu={e => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()} />
              )}
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 h-80 md:h-96 rounded-lg shadow-sm overflow-hidden flex items-center justify-center bg-white relative w-full">
          <div className="main-media-display w-full h-full flex items-center justify-center relative"> 
            {selectedMedia.includes(".mp4") ? (
              <video src={selectedMedia} controls className="w-full h-full object-contain" />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={selectedMedia}
                  alt={product.name}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
                <div 
                  className="absolute inset-0 z-10 bg-transparent"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Thumbnails (Horizontal) */}
        <div className="flex md:hidden gap-3 mt-4 overflow-x-auto flex-nowrap pb-2 w-full scroll-smooth no-scrollbar">
          {product.gallery?.map((media, index) => (
            <div
              key={index}
              onClick={() => setSelectedMedia(media)}
              className={`flex-shrink-0 w-20 h-20 border-2 rounded-md cursor-pointer overflow-hidden relative ${
                selectedMedia === media ? "border-purple-500" : "border-gray-300"
              }`}
            >
              {media.includes(".mp4") ? (
                <video src={media} className="w-full h-full object-cover" muted />
              ) : (
                <img 
                  src={media} 
                  className="w-full h-full object-cover pointer-events-none" 
                  onContextMenu={e => e.preventDefault()}
                   onDragStart={(e) => e.preventDefault()} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* --- COLUMN 2: (BOTTOM on Mobile, RIGHT on Desktop) --- */}
    <div className="w-full md:w-1/2">
      
      {/* C. DESKTOP-ONLY HEADER: Only shows on big screens */}
      <div className="hidden md:block">
        <h1 className="animate-text-item text-4xl font-semibold text-gray-900 mb-3">
          {product.name}
        </h1>
        <p className="animate-text-item text-2xl text-purple-600 font-semibold mb-4">
          Ksh {product.price.toLocaleString()}
        </p>
        <p className="animate-text-item text-gray-700 mb-6 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* D. PERSONALIZATION OPTIONS: Follows the image on mobile */}
      <div className="space-y-4 my-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Personalization Options</h3>
        
        <div className="flex flex-col gap-3">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="w-5 h-5 accent-purple-600 rounded" />
            <span className="text-gray-700">Gift Wrapping Required</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">I need a Card (Kindly specify type)</label>
          <select 
            value={cardType} 
            onChange={(e) => setCardType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="">No Card needed</option>
            <option value="Birthday">Birthday</option>
            <option value="Love/Romantic">Love/Romantic</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Congratulations">Congratulations</option>
            <option value="Other">Other (Specify below)</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Special instructions / Card Message</label>
          <textarea 
            rows="3"
            placeholder="Enter details here..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 outline-none resize-none focus:ring-2 focus:ring-purple-200"
          ></textarea>
        </div>
      </div>

      {/* E. ORDER BUTTON */}
      <button
        onClick={handleOrder}
        className="bg-purple-500 hover:bg-black text-white px-10 py-4 rounded-md transition-all w-full md:w-fit font-bold shadow-md"
      >
        Order Now
      </button>
    </div>
  </div>

  {/* ===== Related Products Section stays here at the bottom ===== */}
  <div className="mt-16 mb-20">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {relatedProducts.map((item) => (
        <Link key={item.id} to={`/product/${item.id}`} className="related-card opacity-0 hover:shadow-lg transition-all rounded-lg p-2 bg-white block">
          <div className="relative overflow-hidden mb-2 rounded-md">
            <img src={item.images?.[0]} alt={item.name} className="w-full h-48 object-cover pointer-events-none" onContextMenu={e => e.preventDefault()}
             onDragStart={(e) => e.preventDefault()} />
            <div className="absolute inset-0 z-10" onContextMenu={e => e.preventDefault()}
             onDragStart={(e) => e.preventDefault()} />
          </div>
          <p className="font-medium text-gray-800 truncate">{item.name}</p>
          <p className="text-purple-600 font-semibold text-sm">Ksh {item.price.toLocaleString()}</p>
        </Link>
      ))}
    </div>
  </div>
</main>

      <Footer/>
    </div>
  );
};

export default ProductDetail;

