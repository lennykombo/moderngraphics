import { useState, useEffect } from "react";
import { db } from "../components/firebaseconfig";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import Productcard from "../components/Productcard";
//import bannerImage from "../assets/bunner2.png";
import { products } from "../components/data";
import Topnav from "../components/Topnav";


function Button({ children, className, onClick, variant = "default" }) {
  const variants = {
    default: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
    ghost: "text-gray-700 px-4 py-2 rounded hover:bg-gray-200",
  };
  return (
    <button className={`${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

const EcommerceUI = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setcategories] = useState([]);
  const [products, setProducts] = useState([]);
 // const [loadingCategories, setLoadingCategories] = useState(true);
/* const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");*/
  const [bannersImage, setBannerImage] = useState([]);


  // Fetch categories from Firestore
    useEffect(() => {
      const fetchCategories = async () => {
        //setLoadingCategories(true);
        try {
          const querySnapshot = await getDocs(collection(db, "categories"));
          const categoriesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }));
          setcategories(categoriesData);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
       // setLoadingCategories(false);
      };
  
      fetchCategories();
    }, []);

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
    console.log("Fetched Products:", products);

 // Fetch the latest banner from Firestore
 useEffect(() => {
  const fetchLatestBanner = async () => {
    try {
      const bannersCollection = collection(db, "banners");
      const bannersQuery = query(bannersCollection, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(bannersQuery);

      if (!querySnapshot.empty) {
        const latestBanner = querySnapshot.docs[0].data();
        setBannerImage(latestBanner.imageUrl);
      }
    } catch (error) {
      console.error("Error fetching latest banner:", error);
    }
  };
  fetchLatestBanner();
}, []);

  const filteredProducts = products.filter((p) => {
    return (
      (!selectedCategory || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Topnav/>
      {/* Header with Logo and Banner */}
    
      <header className="relative w-full h-[40vh] md:h-[50vh] xl:h-[60vh] p-1 flex items-center justify-center text-white text-center mt-16 xl:mt-20 overflow-hidden hidden md:flex">
        {bannersImage ? (
          <img
            src={bannersImage}
            alt="Promotional Banner"
            className="absolute top-5 left-0 w-full h-full object-fill xl:object-top"
          />
        ) : (
          <p className="text-gray-500">Loading banner...</p>
        )}
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-100 p-4 border-r mt-20">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul className="flex flex-wrap gap-2 md:block ">
            {categories.map((category) => (
              <li key={category.id} className="mb-2">
                <Button
                  variant="ghost"
                  className="w-full md:w-auto text-left"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Bar */}
          <div className="flex items-center border-b pb-2 mb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">
           {selectedCategory || "All Products"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Productcard key={product.id} product={{ ...product, image: product.images?.[0] }} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EcommerceUI