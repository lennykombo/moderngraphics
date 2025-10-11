import { useState, useEffect } from "react";
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

      {/* HERO SECTION */}
    <section className="flex flex-col-reverse md:flex-row items-center justify-between mt-20 px-8 md:px-16 py-12">
  {/* Left (on desktop) / Bottom (on mobile): Text + Button */}
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

  {/* Right (on desktop) / Top (on mobile): Sliding Image */}
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


      {/* CATEGORY & PRODUCTS SECTION */}
      <section className="w-full px-6 md:px-16 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Our Products</h2>

        {/* Category Tabs */}
        <div className="flex justify-center flex-wrap gap-4 mb-6">
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

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search Products"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {filteredProducts.map(product => (
          <Productcard
            key={product.id}
            product={{ ...product, image: product.images?.[0] }}
           />
         ))}
        </div>

      </section>

      {/* FOOTER */}
     <Footer/>
    </div>
  );
};

export default EcommerceUI;
