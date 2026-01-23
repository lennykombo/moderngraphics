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
  useGSAP(() => {
    const tl = gsap.timeline();

    // A. Typewriter Effect
    tl.to(".typing-target", {
      text: "Timeless Personalized Gifts",
      duration: 1.5,
      ease: "none",
    })
    
    // B. Blinking Cursor (Runs nicely alongside)
    /*.to(".cursor", {
      opacity: 0,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      duration: 0.5
    }, 0)*/

    // C. Fade in Paragraph, Button, and Image
    .from(".hero-text-element", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.5") // Overlap slightly with end of typing
    
    .from(".hero-image", {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "<"); // Run at same time as paragraph

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
  useGSAP(() => {
    gsap.fromTo(".active-banner-img",
      { scale: 1.1, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 4, ease: "power1.out" }
    );
  }, { dependencies: [currentIndex], scope: containerRef });


  return (
    <div ref={containerRef} className="flex flex-col min-h-screen">
      <Topnav />

      {/* HERO SECTION */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between mt-20 px-8 md:px-16 py-12">
        <div className="w-full md:w-1/2 mt-8 md:mt-0">
          
          {/* H1: Typing Animation Target */}
          {/* Added 'min-h' to prevent layout jump before text types in */}
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

        {/* Hero Image */}
        <div className="hero-image w-full md:w-1/2 relative h-72 md:h-96 overflow-hidden rounded-lg shadow-md">
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
             <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
               Loading...
             </div>
          )}
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products-section" className="w-full px-6 md:px-16 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Our Products</h2>

        {/* Categories */}
        <div className="border py-5 shadow-md flex justify-center flex-wrap gap-4 mb-6 p-3 rounded-md font-semibold">
          <button
            onClick={() => setSelectedCategory("All")}
            // Updated styles for a cleaner look with shadows
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === "All" 
                ? "bg-black text-white shadow-lg scale-105" 
                : "bg-white text-gray-500 hover:text-black hover:shadow-md"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === cat.name 
                  ? "bg-black text-white shadow-lg scale-105" 
                  : "bg-white text-gray-500 hover:text-black hover:shadow-md"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search Products"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
  {filteredProducts.map(product => (
    // Added 'h-full' to ensure the card stretches if a neighbor is taller
    <div key={product.id} className="product-card opacity-0 h-full"> 
      <Productcard product={{ ...product, image: product.images?.[0] }} />
    </div>
  ))}
</div>
      </section>

      <Footer/>
    </div>
  );
};

export default EcommerceUI;











/*import { useState, useEffect } from "react";
import { db } from "../components/firebaseconfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Productcard from "../components/Productcard";
import Topnav from "../components/Topnav";
import Footer from "../components/Footer";


const EcommerceUI = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [bannerImages, setBannerImages] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

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

   // Fetch banners
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


  // Auto-slide
  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerImages]);


  const filteredProducts = products.filter(p =>
    (selectedCategory === "All" || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Topnav />

      {/* HERO SECTION *//*
    <section className="flex flex-col-reverse md:flex-row items-center justify-between mt-20 px-8 md:px-16 py-12">
 
  <div className="w-full md:w-1/2 mt-8 md:mt-0">
    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
      Timeless Personalized Gifts
    </h1>
    <p className="text-gray-600 mb-6 text-lg">
      Crafted to celebrate life’s moments with a touch of elegance.
    </p>
    <button
      onClick={() =>
        document
          .getElementById("products-section")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
    >
      Shop Now
    </button>
  </div>

 
  <div className="w-full md:w-1/2 relative h-72 md:h-96 overflow-hidden rounded-lg shadow-md">
    {bannerImages.length > 0 ? (
      bannerImages.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`banner-${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
        Loading banners...
      </div>
    )}
  </div>
</section>


      {/* CATEGORY & PRODUCTS SECTION *//*
      <section className="w-full px-6 md:px-16 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Our Products</h2>

        {/* Category Tabs *//*
        <div className="flex justify-center flex-wrap gap-4 mb-6 border p-3 rounded-md font-semibold">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 border-b-2 ${selectedCategory === "All" ? "border-black text-black" : "border-transparent text-gray-500"} hover:text-black`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 border-b-2 ${selectedCategory === cat.name ? "border-black text-black" : "border-transparent text-gray-500"} hover:text-black`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search *//*
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search Products"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Grid *//*
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
         {filteredProducts.map(product => (
          <Productcard
            key={product.id}
            product={{ ...product, image: product.images?.[0] }}
           />
         ))}
        </div>

      </section>

   
     <Footer/>
    </div>
  );
};

export default EcommerceUI;*/
