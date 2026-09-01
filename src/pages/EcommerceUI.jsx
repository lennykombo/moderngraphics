import { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../components/firebaseconfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Productcard from "../components/Productcard";
import Topnav from "../components/Topnav";
import Footer from "../components/Footer";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const EcommerceUI = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(collection(db, "banners"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const urls = snap.docs.map((d) => d.data().imageUrl).filter(Boolean);
        setBannerImages(urls);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Banner Interval
  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerImages]);

  // --- DATA MEMOIZATION (Prevents re-animation loop) ---
  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, selectedCategory, searchTerm]);

  // --- GSAP ANIMATIONS ---


  // 1. HERO ANIMATION (Typing + Fade Up)
  /*useGSAP(() => {
    const tl = gsap.timeline();

    // A. Typewriter Effect
    tl.to(".typing-target", {
      text: "Timeless Personalized Gifts",
      duration: 1.5,
      ease: "none",
    })
    
    // B. Fade in Paragraph & Button
    // CHANGED: Use .fromTo() instead of .from()
    // This forces the animation to explicitly animate TO opacity 1, preventing it from getting stuck.
    .fromTo(".hero-text-element", 
      { y: 20, opacity: 0 }, // Start state
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: "power3.out" 
      }, 
      "-=0.5" // Overlap with typing
    )
    
    // C. Fade in Hero Image
    .fromTo(".hero-image", 
      { x: 50, opacity: 0 }, 
      { 
        x: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power2.out" 
      }, 
      "<" // Start at same time as text fade
    );

  }, { scope: containerRef });*/


  // 1. HERO ANIMATION (Typing + Fade Up)
  useGSAP(() => {
    const tl = gsap.timeline();

    // A. Subtle Image Zoom/Fade
    tl.fromTo(".hero-image", 
      { opacity: 0, scale: 1.05 }, 
      { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
    )
    
    // B. Typewriter Effect
    .to(".typing-target", {
      text: "Timeless Personalized Gifts",
      duration: 1.5,
      ease: "none",
    }, "-=0.8")
    
    // C. Content Fade Up
    .fromTo(".hero-text-element", 
      { y: 20, opacity: 0 }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: "power3.out" 
      }, 
      "-=0.5"
    );

    // Cursor Blink
    gsap.to(".cursor", { opacity: 0, repeat: -1, yoyo: true, duration: 0.5 });

  }, { scope: containerRef });

  // 2. PRODUCT GRID ANIMATION (ScrollTrigger Batch)
  useGSAP(() => {
    if (filteredProducts.length === 0) return;

    ScrollTrigger.batch(".product-card", {
      start: "top 85%",
      onEnter: (batch) => {
        gsap.fromTo(batch, 
          { opacity: 0, y: 30 }, 
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.1, 
            duration: 0.5, 
            ease: "power2.out",
            overwrite: "auto"
          }
        );
      },
      once: true // Only animate once
    });
    
    ScrollTrigger.refresh();
  }, { dependencies: [filteredProducts], scope: containerRef });

  // 3. BANNER ZOOM ANIMATION
  /*useGSAP(() => {
    gsap.fromTo(".active-banner-img",
      { scale: 1.1, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 4, ease: "power1.out" }
    );
  }, { dependencies: [currentIndex], scope: containerRef });*/


  return (
    <div ref={containerRef} className="flex flex-col min-h-screen">
      <Topnav />

      {/* HERO SECTION */}
      {/*<section className="flex flex-col-reverse md:flex-row items-center justify-between mt-20 px-8 md:px-16 py-12">
        <div className="w-full md:w-1/2 mt-8 md:mt-0">
          
          {/* H1: Typing Animation Target */}
          {/* Added 'min-h' to prevent layout jump before text types in *//*
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 min-h-[48px] md:min-h-[60px] flex items-center py-5">
            <span className="typing-target"></span>
            <span className="cursor text-black ml-1"></span>
          </h1>

          <p className="hero-text-element text-gray-600 mb-6 text-lg">
            Crafted to celebrate life’s moments with a touch of elegance.
          </p>
          <button
            onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
            className="hero-text-element bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Shop Now
          </button>
        </div>

     
        {/* Hero Image *//*

<div className="hero-image w-full md:w-3/4 relative h-72 md:h-96 overflow-hidden rounded-lg shadow-md bg-white">
  {bannerImages.length > 0 ? (
    bannerImages.map((src, i) => (
      <img
  key={i}
  src={src}
  alt={`banner-${i}`}
  // CHANGED: 'object-fill' forces the image to stretch to the exact box size
  className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
    i === currentIndex ? "opacity-100 active-banner-img" : "opacity-0"
  }`}
/>
    ))
  ) : (
     <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
       Loading...
     </div>
  )}
</div>
      </section>*/}


{/* HERO SECTION -  STYLE SLIM BANNER */}
<section className="relative w-full h-[300px] md:h-[450px] overflow-hidden mt-16">
  
  {/* Banner Images Background */}
  <div className="hero-image absolute inset-0 w-full h-full">
    {bannerImages.length > 0 ? (
      bannerImages.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`banner-${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100 active-banner-img" : "opacity-0"
          }`}
        />
      ))
    ) : (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )}
    
    {/* Soft Overlay (helps white text pop without hiding the image) */}
    <div className="absolute inset-0 bg-black/20" />
  </div>

  {/* Text Content Overlay */}
  {/*<div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
    <div className="max-w-2xl">
      {/* H1 with Typing Animation *//*
      <h1 className="text-2xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg flex items-center min-h-[40px] md:min-h-[60px]">
        <span className="typing-target"></span>
        <span className="cursor bg-white ml-1 w-[2px] h-[24px] md:h-[45px] inline-block"></span>
      </h1>

      <p className="hero-text-element text-white text-sm md:text-lg mb-6 max-w-md drop-shadow-md font-medium">
        Crafted to celebrate life’s moments with a touch of elegance.
      </p>
      
      <button
        onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
        className="hero-text-element bg-purple-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:bg-black transition-all shadow-lg text-sm md:text-base"
      >
        Shop Now
      </button>
    </div>
  </div>*/}
</section>
 
      {/* PRODUCTS SECTION */}
<section id="products-section" className="w-full px-6 md:px-16 py-12">
  <h2 className="text-2xl font-bold text-center md:text-left mb-8">Our Products</h2>

  {/* Main Layout Wrapper: Sideways on Desktop */}
  <div className="flex flex-col md:flex-row gap-8">
    
    {/* --- CATEGORIES SIDEBAR --- */}
    <aside className="w-full md:w-64 flex-shrink-0">
      
      {/* MOBILE VIEW: Dropdown (Remains exactly as you had it) */}
      <div className="md:hidden relative w-full max-w-xs mx-auto mb-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-300 px-4 py-3 rounded-md shadow-sm text-gray-700 font-medium active:scale-95 transition-transform"
        >
          <span>{selectedCategory === "All" ? "Select Category" : selectedCategory}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden">
            <button
              onClick={() => { setSelectedCategory("All"); setIsDropdownOpen(false); }}
              className={`w-full text-left px-4 py-3 ${selectedCategory === "All" ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-600"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.name); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-3 ${selectedCategory === cat.name ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-600"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      
<div className="hidden md:flex flex-col gap-2 sticky top-32 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
  <h3 className="text-sm font-uppercase tracking-widest text-gray-400 mb-2 px-2">
    CATEGORIES
  </h3>
  
  <button
    onClick={() => setSelectedCategory("All")}
    className={`text-left px-4 py-2 rounded-md transition-all duration-200 flex-shrink-0 ${
      selectedCategory === "All"
        ? "bg-purple-500 text-white shadow-md translate-x-2"
        : "text-gray-600 hover:bg-gray-100 hover:text-black"
    }`}
  >
    All Products
  </button>

  {categories.map((cat) => (
    <button
      key={cat.id}
      onClick={() => setSelectedCategory(cat.name)}
      className={`text-left px-4 py-2 rounded-md transition-all duration-200 flex-shrink-0 ${
        selectedCategory === cat.name
          ? "bg-purple-500 text-white shadow-md translate-x-2"
          : "text-gray-600 hover:bg-gray-100 hover:text-black"
      }`}
    >
      {cat.name}
    </button>
  ))}
</div>
    </aside>

    {/* --- PRODUCT GRID & SEARCH AREA --- */}
    <div className="flex-grow">
      {/* Search Bar (Moved above grid) */}
      <div className="max-w-md mb-8">
        <input
          type="text"
          placeholder="Search items..."
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all shadow-sm bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} 
          className="product-card opacity-0 h-full"
           onContextMenu={(e) => e.preventDefault()} > 
            <Productcard product={{ ...product, image: product.images?.[0] }} />
          </div>
        ))}
      </div>

      {/* No Products Found State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No products found in this category.
        </div>
      )}
    </div>

  </div>
</section>

      <Footer/>
    </div>
  );
};

export default EcommerceUI;


