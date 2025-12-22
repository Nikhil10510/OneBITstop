import React, { useState, useEffect } from "react";
import { getAllCarpools, createCarpool, deleteCarpool } from "./services/operations/carpoolApi";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./components/ui/ConfirmationModal";
import FormLoader from "./components/ui/FormLoader";

const Loader = ({ message = "Loading, please wait..." }) => (
  <div className="fixed inset-0 flex flex-col justify-center items-center bg-white/80 dark:bg-black/80 z-50">
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

export default function CarpoolingListing() {
  const [sortOrder, setSortOrder] = useState("newest");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [newPost, setNewPost] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seatsAvailable: "",
    note: "",
    userEmail: user?.email || "",
    phoneNumber: "919876543210",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCarpools() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCarpools();
        setPosts(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch carpools");
      } finally {
        setLoading(false);
      }
    }
    fetchCarpools();
  }, []);

  const sortedPosts = [...posts].sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.travelDate) - new Date(a.travelDate)
      : new Date(a.travelDate) - new Date(b.travelDate)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeletePost = async (postId) => {
    if (!user) {
      toast.error("Please log in to delete carpool posts.");
      return;
    }
    setPostToDelete(postId);
    setShowConfirmModal(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    
    if (!user?.token) {
      toast.error("Authentication required to delete carpool posts.");
      return;
    }
    
    setIsDeleting(true);
    setError(null);
    try {
      await deleteCarpool(postToDelete, user.token);
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete));
      toast.success("Carpool post deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete the post");
      toast.error("Failed to delete carpool post. Please try again.");
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const closeConfirmModal = () => {
    if (isDeleting) return; // Don't close if currently deleting
    setShowConfirmModal(false);
    setPostToDelete(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const payload = {
      pickupLocation: newPost.from,
      dropLocation: newPost.to,
      travelDate: newPost.date,
      departureTime: newPost.time,
      seatsAvailable: parseInt(newPost.seatsAvailable, 10),
      additionalNotes: newPost.note,
      contactNumber: newPost.phoneNumber,
      email: newPost.userEmail,
    };
    try {
      const res = await createCarpool(payload, user?.token);
      setPosts([res.data, ...posts]);
      setIsModalOpen(false);
      setNewPost({
        from: "",
        to: "",
        date: "",
        time: "",
        seatsAvailable: "",
        note: "",
        userEmail: user?.email || "",
        phoneNumber: "919876543210",
      });
      toast.success("Carpool post created successfully!");
    } catch (err) {
      setError(err.message || "Error creating post");
      toast.error("Failed to create carpool post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 pt-24 px-4 sm:px-6 lg:px-8 pb-16">
      {/* Decorative blurred shapes */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-4 sm:p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex-1 mb-2 md:mb-0">
            🚗 Carpooling Board
          </h2>
          <div className="flex items-center w-full md:w-auto">
            <label htmlFor="sort" className="mr-3 font-medium text-gray-700 dark:text-gray-300">
              Sort by Date:
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 shadow-sm text-sm bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts
              .filter((post) => post != null)
              .map((post) => (
                <div
                  key={post._id}
                  className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 flex flex-col w-full h-[340px] max-w-full p-0 transition-transform duration-300 hover:scale-105 hover:shadow-3xl group"
                >

                  <div className="flex-1 flex flex-col justify-between p-6 overflow-hidden">
                    <div>
                      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                        <strong>User:</strong> {post.email || "Anonymous"}
                      </div>
                      <p className="mb-1 text-gray-900 dark:text-white"><strong>From:</strong> {post.pickupLocation}</p>
                      <p className="mb-1 text-gray-900 dark:text-white"><strong>To:</strong> {post.dropLocation}</p>
                      <p className="mb-1 text-gray-900 dark:text-white"><strong>Date:</strong> {new Date(post.travelDate).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"})}</p>
                      <p className="mb-1 text-gray-900 dark:text-white"><strong>Time:</strong> {post.departureTime}</p>
                      <p className="mb-1 text-gray-900 dark:text-white"><strong>Seats:</strong> {post.seatsAvailable}</p>
                      {post.additionalNotes && (
                        <p className="text-gray-700 dark:text-gray-200 italic mt-2 text-sm line-clamp-2">"{post.additionalNotes}"</p>
                      )}
                    </div>
                    <div className="flex items-end justify-end gap-2 mt-4">
                      {/* Delete button - only show if user is the owner */}
                      {user && user.email === post.email && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center absolute bottom-6 right-16 z-10"
                          style={{ width: '48px', height: '48px' }}
                          aria-label="Delete carpool post"
                          title="Delete this carpool post"
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
                        href={`https://wa.me/${post.contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi, I'm interested in carpooling with you from ${post.pickupLocation} to ${post.dropLocation} on ${new Date(post.travelDate).toLocaleDateString("en-GB")} via OneBITstop.`
  )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chat on WhatsApp"
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
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-10">
            No carpool posts available.
          </p>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full p-5 shadow-2xl hover:from-indigo-600 hover:to-blue-700 focus:ring-4 focus:ring-indigo-400"
        title="Add New Carpool Post"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[95vh] overflow-y-auto text-gray-900 dark:text-gray-100 custom-scrollbar border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white text-center">
              🚗 Create a New Carpool Listing
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {[
                {
                  name: "from",
                  label: "Pickup Location*",
                  placeholder: "e.g., Bangalore",
                },
                {
                  name: "to",
                  label: "Drop Location*",
                  placeholder: "e.g., Hyderabad",
                },
                { name: "date", label: "Travel Date*", type: "date" },
                { name: "time", label: "Departure Time*", type: "time" },
                {
                  name: "seatsAvailable",
                  label: "Seats Available*",
                  type: "number",
                  placeholder: "Number of seats",
                },
                {
                  name: "note",
                  label: "Additional Notes",
                  placeholder: "e.g., Luggage space available",
                },
                {
                  name: "phoneNumber",
                  label: "Contact Number*",
                  type: "tel",
                  placeholder: "+91 98765 43210",
                },
                {
                  name: "userEmail",
                  label: "Your Email",
                  type: "email",
                  readOnly: true,
                },
              ].map(({ name, label, ...rest }) => (
                <LabelInputContainer key={name}>
                  <Label htmlFor={name} className="text-gray-700 dark:text-gray-300">{label}</Label>
                  <Input
                    name={name}
                    value={newPost[name]}
                    onChange={handleInputChange}
                    required={label.includes("*")}
                    className={`bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-300 dark:border-gray-700 ${rest.readOnly ? "cursor-not-allowed text-gray-400" : ""}`}
                    {...rest}
                  />
                </LabelInputContainer>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewPost({
                      from: "",
                      to: "",
                      date: "",
                      time: "",
                      seatsAvailable: "",
                      note: "",
                      userEmail: user?.email || "",
                      phoneNumber: "",
                    });
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-md bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Post →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={closeConfirmModal}
          onConfirm={confirmDeletePost}
          message="Are you sure you want to delete this carpool post? This action cannot be undone."
          loading={isDeleting}
        />
      )}

      {error && <div className="text-red-500 text-center my-4">{error}</div>}

      {isSubmitting && <FormLoader message="Creating carpool post, please wait..." />}
      {isDeleting && <FormLoader message="Deleting carpool post, please wait..." />}
    </div>
  );
}

const LabelInputContainer = ({ children }) => (
  <div className="flex flex-col space-y-1 w-full">{children}</div>
);
