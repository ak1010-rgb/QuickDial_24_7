import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const tagsList = [
  "Great Service",
  "Honest & Polite",
  "Knowledgeable",
  "Rude",
  "Not on Time",
  "Fake Service Registration",
];

const ReviewPage = () => {
  const { uid } = useParams();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (!u) {
        toast.warning("Please login to write a review.");
        navigate("/login");
      } else {
        setUser(u);
      }
    });
  }, [navigate]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
  if (rating === 0) {
    toast.error("Please give a star rating.");
    return;
  }

  try {
    const reviewsRef = collection(db, "providers", uid, "reviews");

    // 🛑 Check if this user already reviewed this provider
    const existingReviews = await getDocs(reviewsRef);
    const alreadyReviewed = existingReviews.docs.some(
      (d) => d.data().userId === user.uid
    );

    if (alreadyReviewed) {
      toast.info("You already submitted a review for this provider.");
      return;
    }

    // ✅ Otherwise, allow review submission
    await addDoc(reviewsRef, {
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      rating,
      tags: selectedTags,
      comment,
      timestamp: new Date(),
    });

    // Update avgRating
    const allRatings = existingReviews.docs.map((d) => d.data().rating);
    const avg =
      (allRatings.reduce((a, b) => a + b, 0) + rating) /
      (allRatings.length + 1);

    const ref = doc(db, "providers", uid);
    await updateDoc(ref, { avgRating: avg });

    toast.success("Review submitted successfully!");
    navigate(`/provider/${uid}`);
  } catch (err) {
    toast.error("Failed to submit review. Try again.");
  }
};


  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-3 text-blue-700">Rate & Review</h2>

      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star
            key={num}
            onClick={() => setRating(num)}
            className={`w-8 h-8 cursor-pointer ${
              num <= rating ? "fill-yellow-400" : "stroke-gray-400"
            }`}
          />
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Select tags</h3>
        <div className="flex flex-wrap gap-2">
          {tagsList.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 text-sm rounded-full border ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        className="w-full border p-2 rounded mb-4 h-24 resize-none"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewPage;
