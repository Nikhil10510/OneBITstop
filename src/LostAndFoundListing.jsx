import React, { useState, useMemo, useEffect } from "react";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext";
import { getImageSrc } from "./SellBuyPage";
import { getLostFoundItems, addLostFoundItem, deleteLostFoundItem } from "./services/operations/lostFoundApi";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./components/ui/ConfirmationModal";
import FormLoader from "./components/ui/FormLoader";

// Sample data
const Loader = ({ message = "Loading, please wait..." }) => (
  <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-80 z-50">
    <svg
      className="animate-spin h-14 w-14 text-cyan-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <p className="mt-4 text-cyan-300 text-lg font-semibold">{message}</p>
  </div>
);


const WhatsappIcon = () => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 24 24"
  className="w-6 h-6 text-white"
  aria-hidden="true"
  >
    <path d="M20.52 3.48A11.815 11.815 0 0012 0C5.373 0 0 5.373 0 12c0 2.11.554 4.088 1.52 5.82L0 24l6.29-1.56a11.82 11.82 0 005.71 1.44c6.627 0 12-5.373 12-12 0-1.93-.547-3.726-1.48-5.4zM12 21.82a9.77 9.77 0 01-5.25-1.5l-.38-.23-3.7.92.99-3.61-.25-.37A9.782 9.782 0 012.22 12c0-5.42 4.4-9.82 9.82-9.82 2.62 0 5.08 1.02 6.93 2.88a9.755 9.755 0 012.88 6.94c0 5.42-4.4 9.82-9.82 9.82zm5.42-7.62c-.29-.15-1.7-.84-1.96-.94-.26-.1-.44-.15-.63.15s-.72.94-.89 1.13c-.16.19-.32.21-.6.07-.29-.15-1.23-.45-2.35-1.45-.87-.78-1.46-1.75-1.63-2.04-.17-.29-.02-.45.13-.6.14-.14.3-.36.44-.54.14-.18.19-.31.29-.52.1-.21.05-.39-.03-.54-.08-.15-.63-1.52-.87-2.08-.23-.54-.47-.47-.63-.47-.16 0-.35-.02-.54-.02-.19 0-.5.07-.76.37-.26.29-1 1-1 2.45s1.03 2.83 1.17 3.03c.14.21 2.01 3.06 4.88 4.28.68.29 1.21.46 1.62.59.68.21 1.3.18 1.79.11.55-.08 1.7-.69 1.94-1.35.24-.66.24-1.23.17-1.35-.07-.11-.26-.18-.55-.32z" />
  </svg>
);

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

const LostAndFoundListing = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    photo: null, // ✅ new key
    contact: user?.email || "",
    whatsapp: "",
    date: "",
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setNewItem((prev) => ({ ...prev, contact: user.email }));
    }
  }, [user]);

  const handleOpenModal = () => {
    if (!user) {
      toast(
        "Please log in to add a lost/found item.",
        {
          type: "error",
          duration: 3000,
          position: "bottom-right",
          icon: "❌",
        }
      )
      return;
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", newItem.title);
      formData.append("description", newItem.description);
      formData.append("contact", newItem.contact);
      formData.append("whatsapp", newItem.whatsapp);
      formData.append("date", newItem.date);
      formData.append("file", imageFile);
      await addLostFoundItem(formData, user?.token);
      setIsModalOpen(false);
      setImageFile(null);
      fetchItems();
      setNewItem({
        title: "",
        description: "",
        photo: null,
        contact: user?.email || "",
        whatsapp: "",
        date: "",
      });
      toast.success("Item added successfully!");
    } catch (error) {
      setError(error.message || "Error submitting item");
      toast.error("Failed to add item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchItems = async () => {
    setIsLoadingItems(true);
    setError(null);
    try {
      const res = await getLostFoundItems();
      const itemsWithImages = res.map((item) => ({
        ...item,
        imageSrc: getImageSrc(item.photo),
      }));
      setItems(itemsWithImages);
    } catch (error) {
      setError(error.message || "Failed to fetch items");
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    const filtered = items.filter((item) => {
      const itemDate = new Date(item.date || item.createdAt || 0);
      itemDate.setHours(0, 0, 0, 0);
      // Category filter (case-insensitive, fallback to 'all')
      const categoryMatch = selectedCategory === 'all' || (item.category && item.category.toLowerCase() === selectedCategory);
      return (
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        itemDate <= today &&
        categoryMatch
      );
    });

    // 🔽 Apply sort order
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return sortOrder === "newest"
        ? dateB - dateA // descending
        : dateA - dateB; // ascending
    });

    return sorted;
  }, [items, searchQuery, sortOrder, selectedCategory]); // <-- Include selectedCategory as a dependency

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDeleteItem = async (id) => {
    if (!user) {
      toast.error("Please log in to delete items.");
      return;
    }
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    
    if (!user?.token) {
      toast.error("Authentication required to delete items.");
      return;
    }
    
    setError(null);
    setIsDeleting(true);
    try {
      await deleteLostFoundItem(itemToDelete, user.token);
      toast.success("Item deleted successfully!");
      fetchItems();
    } catch (error) {
      setError(error.message || "Failed to delete item");
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const closeConfirmModal = () => {
    if (isDeleting) return; // Don't close if currently deleting
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
        {/* Decorative blurred shapes */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-10 mt-32 text-center leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)] px-4">
          Lost & Found
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Find or Recover Your Belongings</span>
        </h1>

        {/* Main content container with max-width and responsive padding */}
        <div className="relative w-full min-h-[60vh] max-w-7xl mx-auto px-2 sm:px-4 md:px-6 flex flex-col">
          {/* Filter bar above the grid, horizontal on desktop, stacked on mobile */}
          <div className="w-full flex flex-col md:flex-row items-stretch md:items-end gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-4 sm:p-6 mb-8">
            {/* Desktop: left (search), center (category), right (sort). Mobile: stacked. */}
            <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0 md:items-end">
              {/* Search input - left */}
              <div className="w-full md:w-1/3 md:pr-4 flex items-end">
                <input
                  type="text"
                  placeholder="Search by title or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition duration-300"
                />
              </div>
              {/* Category - center */}
              <div className="w-full md:w-1/3 flex items-end justify-center md:px-4 mt-2 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                  <label className="block mb-1 md:mb-0 md:mr-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Category:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full md:w-48 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition duration-300"
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="personal">Personal</option>
                    <option value="essentials">Essentials</option>
                    <option value="stationery">Stationery</option>
                    <option value="clothing">Clothing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              {/* Sort by Date - right */}
              <div className="w-full md:w-1/3 flex items-end justify-end md:pl-4 mt-2 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto md:justify-end">
                  <label className="block mb-1 md:mb-0 md:mr-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Sort by Date:
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full md:w-48 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition duration-300"
                  >
                    <option value="newest">📅 Newest First</option>
                    <option value="oldest">🕰️ Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main grid of items */}
          <main className="flex-1 w-full px-0 sm:px-2 md:px-4 py-4 flex flex-col">
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
              {isLoadingItems ? (
                <Loader />
              ) : filteredItems.length === 0 ? (
                <p className="text-center col-span-full text-gray-500 dark:text-gray-400 text-lg font-medium">
                  No items found matching your criteria or all items have future dates.
                </p>
              ) : (
                filteredItems.map((item, index) => {
                  const whatsappLink = `https://wa.me/${item.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
  `Hi, I'm inquiring about your item: ${item.title} on OneBITstop.`
)}`;
                  const key = item._id || item.id || `${item.title}-${index}`;
                  return (
                    <article
                      key={key}
                      className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 flex flex-col w-[370px] h-[420px] max-w-full p-0 transition-transform duration-300 hover:scale-105 hover:shadow-3xl group"
                    >
                      {item.photo && (
                        <img
                          src={item.photo}
                          alt={item.title}
                          className="object-cover w-full h-48 rounded-t-3xl"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 flex flex-col justify-between p-6">
                        <div>
                          <h3 className="text-xl font-bold mb-2 truncate drop-shadow-lg text-gray-900 dark:text-white leading-tight">
                            {item.title}
                          </h3>
                          <p className="mb-2 text-sm font-medium line-clamp-3 opacity-90 text-gray-700 dark:text-gray-200 leading-relaxed">
                            {item.description}
                          </p>
                          <p className="text-xs font-mono opacity-80 mt-2 break-words text-gray-500 dark:text-gray-400">
                            Posted by: {item.contact}
                          </p>
                          <p className="text-xs italic opacity-80 mt-1 text-gray-500 dark:text-gray-400">
                            Date: {formatDate(item.date)}
                          </p>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          {/* Delete button - only show if user is the owner */}
                          {user && (item.user === user._id || item.userId === user._id) && (
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center absolute bottom-6 right-16 z-10"
                              style={{ width: '48px', height: '48px' }}
                              aria-label="Delete item"
                              title="Delete this item"
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
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center absolute bottom-6 right-6 z-10"
                            style={{ width: '48px', height: '48px' }}
                            aria-label={`Contact ${item.contact} on WhatsApp`}
                          >
                            <WhatsappIcon />
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            <button
              onClick={handleOpenModal}
              className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full p-5 shadow-2xl hover:from-purple-600 hover:to-blue-700 transition-all duration-300 z-30 animate-pulse"
              title="Add New Lost/Found Item"
              aria-label="Add new lost or found item"
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

            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-6 sm:px-0"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="bg-white/90 dark:bg-gray-900/90 p-8 rounded-2xl max-w-lg w-full max-h-screen overflow-auto shadow-2xl custom-scrollbar border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                    📝 Add Lost/Found Item
                  </h3>
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <LabelInputContainer>
                      <Label htmlFor="title">Title*</Label>
                      <Input
                        name="title"
                        value={newItem.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter a clear and concise title"
                        className="w-full bg-white/80 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition"
                      />
                    </LabelInputContainer>

                    <LabelInputContainer>
                      <Label htmlFor="description">Description*</Label>
                      <Input
                        name="description"
                        value={newItem.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Provide a short description"
                        className="w-full bg-white/80 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition"
                      />
                    </LabelInputContainer>

                    <LabelInputContainer>
                      <Label htmlFor="photo" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                        Upload Image*
                      </Label>
                      <label className="flex items-center justify-center w-full p-4 bg-white/80 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => setImageFile(e.target.files[0])}
                          className="hidden"
                        />
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
                            Click to upload or drag and drop
                          </span>
                        </div>
                      </label>
                      {imageFile && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Selected image:
                          </p>
                          <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                          />
                        </div>
                      )}
                    </LabelInputContainer>

                    <LabelInputContainer>
                      <Label htmlFor="contact">Contact Email*</Label>
                      <Input
                        name="contact"
                        type="email"
                        value={newItem.contact}
                        onChange={handleInputChange}
                        required
                        readOnly
                        placeholder={user?.email}
                        className="cursor-not-allowed w-full bg-white/80 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-3"
                      />
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="date">Date Lost/Found*</Label>
                      <Input
                        name="date"
                        type="date"
                        value={newItem.date}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/80 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition"
                      />
                    </LabelInputContainer>

                    <LabelInputContainer>
                      <Label htmlFor="whatsapp">WhatsApp Number*</Label>
                      <Input
                        name="whatsapp"
                        type="tel"
                        value={newItem.whatsapp}
                        onChange={handleInputChange}
                        required
                        placeholder="9876543210"
                        pattern="[6-9]{1}[0-9]{9}"
                        maxLength={10}
                        className="w-full bg-white/80 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition"
                      />
                    </LabelInputContainer>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setNewItem({
                            title: "",
                            description: "",
                            contact: user?.email || "",
                          });
                          setImageFile(null);
                        }}
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group/btn relative block h-10 px-6 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Adding..." : "Add Item →"} <BottomGradient />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-center my-4">{error}</div>}
          </main>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={closeConfirmModal}
          onConfirm={confirmDeleteItem}
          message="Are you sure you want to delete this item? This action cannot be undone."
          loading={isDeleting}
        />
      )}

      {isSubmitting && <FormLoader message="Adding lost/found item, please wait..." />}
      {isDeleting && <FormLoader message="Deleting item, please wait..." />}
    </>
  );
};

export default LostAndFoundListing;
