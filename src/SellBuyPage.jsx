import React, { useEffect, useState } from "react";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext";
import { getAllSellBuyListings, createSellBuyListing, deleteSellBuyListing } from "./services/operations/sellBuyApi";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./components/ui/ConfirmationModal";
import FormLoader from "./components/ui/FormLoader";

export const Loader = () => (
  <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/80 z-50">
    <div className="relative w-16 h-16">
      <div className="absolute w-full h-full border-4 border-t-transparent border-cyan-400 rounded-full animate-spin" />
      <div className="absolute inset-2 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin-slow" />
    </div>
    <p className="text-cyan-300 text-lg font-semibold tracking-wide animate-pulse mt-4">
      Loading listings, please wait...
    </p>
  </div>
);

export const getImageSrc = (photo) => {
  if (!photo?.data?.data || !photo?.contentType) return "";

  const byteArray = new Uint8Array(photo.data.data); // Convert to typed array
  const blob = new Blob([byteArray], { type: photo.contentType }); // Create blob
  return URL.createObjectURL(blob); // Return object URL
};
const SellBuyPage = () => {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState(25000);
  const [sortOption, setSortOption] = useState("Newest First");
  const [showForm, setShowForm] = useState(false);
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [newListing, setNewListing] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    whatsappNumber: "",
    email: user?.email || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllSellBuyListings();
      const listingsWithImages = res.map((item) => ({
        ...item,
        imageSrc: getImageSrc(item.photo),
      }));
      setMarketItems(listingsWithImages);
    } catch (err) {
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchListings();
  }, []);

  const parsePrice = (priceStr) => {
    if (priceStr == null) return 0;
    return Number(String(priceStr).replace(/[^0-9]/g, ""));
  };

  const categories = Array.from(
    new Set(marketItems.map((item) => item.category))
  );

  const filteredProducts = marketItems.filter((item) => {
    const priceNum = parsePrice(item.price);
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All Categories" || item.category === category) &&
      priceNum <= priceRange
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);

    switch (sortOption) {
      case "Price: Low to High":
        return priceA - priceB;
      case "Price: High to Low":
        return priceB - priceA;
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setPriceRange(25000);
  };

  const handleInputChange = (e) => {
    setNewListing({ ...newListing, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    if (!imageFile) {
      toast("Please upload an image.",
        {
          type: "warning",
          duration: 3000,
          position: "bottom-right",
          icon: "🔔",
        }
      )
      setIsSubmitting(false);
      return;
    }
    const formatWhatsApp = (num) => {
      const cleaned = num.replace(/\D/g, "");
      return cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
    };
    const formData = new FormData();
    formData.append("title", newListing.title);
    formData.append("price", newListing.price);
    formData.append("category", newListing.category);
    formData.append("description", newListing.description);
    formData.append("whatsappNumber", formatWhatsApp(newListing.whatsappNumber));
    formData.append("email", user.email);
    formData.append("file", imageFile);
    try {
      const res = await createSellBuyListing(formData, user?.token);
      toast(
        "Listing created successfully!",
        {
          type: "success",
          duration: 3000,
          position: "bottom-right",
          icon: "🎉",
        }
      )
      setMarketItems((prev) => [res.data, ...prev]);
      setShowForm(false);
      setNewListing({
        title: "",
        price: "",
        category: "",
        description: "",
        whatsappNumber: "",
        email: user?.email || "",
      });
      setImageFile(null);
      fetchListings();
    } catch (error) {
      setError(error.message || "Failed to create listing.");
      toast(
        `Failed to create listing. Reason: ${error.message || "Unknown error"}`,
        {
          type: "error",
          duration: 3000,
          position: "bottom-right",
          icon: "❌",
        }
      )
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!user) {
      toast.error("Please log in to delete listings.");
      return;
    }
    setListingToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteListing = async () => {
    if (!listingToDelete) return;
    
    if (!user?.token) {
      toast.error("Authentication required to delete listings.");
      return;
    }
    
    setError(null);
    setIsDeleting(true);
    try {
      await deleteSellBuyListing(listingToDelete, user.token);
      toast.success("Listing deleted successfully!");
      fetchListings();
    } catch (error) {
      setError(error.message || "Failed to delete listing.");
      toast.error("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
      setListingToDelete(null);
    }
  };

  const closeConfirmModal = () => {
    if (isDeleting) return; // Don't close if currently deleting
    setShowConfirmModal(false);
    setListingToDelete(null);
  };

  const handleSellClick = () => {
    if (!user) {
      toast("Please log in to submit a listing.",
        {
          type: "warning",
          duration: 3000,
          position: "bottom-right",
          icon: "🔔",
        }
      )
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Decorative blurred shapes */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-10 mt-32 text-center leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)] px-4">
        Buy & Sell
        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Marketplace for BITians</span>
      </h1>

      {/* Main content container with max-width and responsive padding */}
      <div className="relative w-full min-h-[60vh] max-w-7xl mx-auto px-2 sm:px-4 md:px-6 flex flex-col">
        {/* Filter bar above the grid, horizontal on desktop, stacked on mobile */}
        <div className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-4 sm:p-6 mb-8">
          <div className="flex flex-col md:flex-row w-full gap-4 md:gap-4 md:items-center">
            {/* Search input */}
            <div className="w-full md:w-1/4 flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Category */}
            <div className="w-full md:w-1/4 flex items-center">
              <label className="mr-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Category:</label>
              <select
                className="w-full md:w-auto p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition duration-300"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {/* Price Range */}
            <div className="w-full md:w-1/3 flex items-center">
              <label className="mr-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Price Range:</label>
              <input
                type="range"
                min="0"
                max="25000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full md:w-48 accent-blue-500"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap">₹0 - ₹{priceRange.toLocaleString()}</span>
            </div>
            {/* Reset All */}
            <div className="w-full md:w-auto flex items-center justify-end">
              <button
                onClick={resetFilters}
                className="text-sm underline text-red-400 hover:text-red-300 relative ml-auto"
              >
                Reset All
                <BottomGradient />
              </button>
            </div>
          </div>
        </div>

        {/* Product Listing */}
        <main className="flex-1 w-full px-0 sm:px-2 md:px-4 py-4 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0 text-gray-900 dark:text-white">
              {loading
                ? "Loading listings..."
                : `Showing ${sortedProducts.length} product(s)`}
            </h2>
            <select
              className="bg-white/90 dark:bg-gray-800/80 p-2 rounded border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {error && <div className="text-red-500 text-center my-4">{error}</div>}

          {loading ? (
            <Loader />
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
              {sortedProducts.map((product) => (
                <article
                  key={product._id}
                  className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 flex flex-col w-[370px] h-[420px] max-w-full p-0 transition-transform duration-300 hover:scale-105 hover:shadow-3xl group"
                >
                  {product.photo && (
                    <img
                      src={product.photo}
                      alt={product.title}
                      className="object-cover w-full h-48 rounded-t-3xl"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 flex flex-col justify-between p-6 overflow-hidden">
                    <div>
                      <h3 className="text-xl font-bold mb-2 truncate drop-shadow-lg text-gray-900 dark:text-white leading-tight">
                        {product.title}
                      </h3>
                      <p className="text-blue-500 dark:text-blue-400 font-bold">₹{product.price}</p>
                      <p className="mb-2 text-sm font-medium opacity-90 text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-xs font-mono opacity-80 mt-2 break-words text-gray-500 dark:text-gray-400">
                        Posted by: {product.email}
                      </p>
                    </div>
                    <div className="flex items-end justify-end gap-2 mt-4">
                      {/* Delete button - only show if user is the owner */}
                      {user && user.email === product.email && (
                        <button
                          onClick={() => handleDeleteListing(product._id)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center absolute bottom-6 right-16 z-10"
                          style={{ width: '48px', height: '48px' }}
                          aria-label="Delete listing"
                          title="Delete this listing"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                      
                      {/* WhatsApp button */}
                      {product.whatsappNumber && (
                        <a
                          href={`https://wa.me/${product.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
      `Hi, I'm interested in buying your product: ${product.title || product.name} on OneBITstop.`
    )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center absolute bottom-6 right-6 z-10"
                          style={{ width: '48px', height: '48px' }}
                          aria-label="Contact on WhatsApp"
                        >
                          <svg
                            height="24"
                            width="24"
                            viewBox="0 0 58 58"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="#2CB742"
                              d="M0,58l4.988-14.963C2.457,38.78,1,33.812,1,28.5C1,12.76,13.76,0,29.5,0S58,12.76,58,28.5 S45.24,57,29.5,57c-4.789,0-9.299-1.187-13.26-3.273L0,58z"
                            />
                            <path
                              fill="#FFFFFF"
                              d="M47.683,37.985c-1.316-2.487-6.169-5.331-6.169-5.331c-1.098-0.626-2.423-0.696-3.049,0.42
                  c0,0-1.577,1.891-1.978,2.163c-1.832,1.241-3.529,1.193-5.242-0.52l-3.981-3.981l-3.981-3.981
                  c-1.713-1.713-1.761-3.41-0.52-5.242c0.272-0.401,2.163-1.978,2.163-1.978c1.116-0.627,1.046-1.951,0.42-3.049
                  c0,0-2.844-4.853-5.331-6.169c-1.058-0.56-2.357-0.364-3.203,0.482l-1.758,1.758c-5.577,5.577-2.831,11.873,2.746,17.45
                  l5.097,5.097l5.097,5.097c5.577,5.577,11.873,8.323,17.45,2.746l1.758-1.758C48.048,40.341,48.243,39.042,47.683,37.985z"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>

      {/* Floating Add Listing Button */}
      <button
        onClick={handleSellClick}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-full p-5 shadow-2xl hover:from-blue-600 hover:to-green-700 transition-all duration-300 z-30 animate-float"
        title="Add New Listing"
        aria-label="Add new listing"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Modal */}
      {showForm && user && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 sm:px-6"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[95vh] flex flex-col text-gray-100 custom-scrollbar border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-5 text-gray-900 dark:text-white text-center">
              🛍️ Add New Listing
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 overflow-y-auto flex-grow pr-2"
              style={{ maxHeight: "calc(95vh - 120px)" }}
            >
              <LabelInputContainer>
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                  Title*
                </Label>
                <Input
                  name="title"
                  value={newListing.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Listing title"
                  className="bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="price" className="text-gray-700 dark:text-gray-300">
                  Price (₹)*
                </Label>
                <Input
                  name="price"
                  value={newListing.price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 1000"
                  className="bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                  Category*
                </Label>
                <Input
                  name="category"
                  value={newListing.category}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Electronics"
                  className="bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="photo" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Upload Image*
                </Label>
                <label htmlFor="photo" className="w-full cursor-pointer">
                  <div className="flex items-center justify-center w-full p-4 bg-white/80 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <div className="flex flex-col items-center space-y-2">
                      <svg
                        className="w-8 h-8 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-sm">
                        Tap to upload or drag and drop
                      </span>
                    </div>
                  </div>
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setImageFile(file);
                  }}
                  className="hidden"
                />
                {imageFile && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Selected image:
                    </p>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <textarea
                  name="description"
                  value={newListing.description}
                  onChange={handleInputChange}
                  placeholder="Details about your listing"
                  className="w-full p-2 rounded bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                  rows={3}
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="whatsappNumber" className="text-gray-700 dark:text-gray-300">
                  WhatsApp Number
                </Label>
                <Input
                  name="whatsappNumber"
                  value={newListing.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 919876543210"
                  className="bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="userEmail" className="text-gray-700 dark:text-gray-300">
                  Your Email
                </Label>
                <Input
                  name="userEmail"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="cursor-not-allowed bg-white/80 dark:bg-gray-900/60 text-gray-400 border border-gray-300 dark:border-gray-700"
                />
              </LabelInputContainer>
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewListing({
                      title: "",
                      price: "",
                      category: "",
                      description: "",
                      whatsappNumber: "",
                      userEmail: user?.email || "",
                    });
                    setImageFile(null);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={confirmDeleteListing}
        title="Confirm Deletion"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        loading={isDeleting}
      />

      {isSubmitting && <FormLoader message="Creating listing, please wait..." />}
      {isDeleting && <FormLoader message="Deleting listing, please wait..." />}
    </div>
  );
};

export default SellBuyPage;

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-1", className)}>
    {children}
  </div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);