import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, getDocs, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Star, ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const ProviderDetails = () => {
  const { uid } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [hasRecommended, setHasRecommended] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u || null));

    const fetchProvider = async () => {
      const ref = doc(db, "providers", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProvider(snap.data());
        if (user && snap.data().recommendedBy?.includes(user.uid)) {
          setHasRecommended(true);
        }
      }

      const reviewSnap = await getDocs(collection(db, "providers", uid, "reviews"));
      const fetchedReviews = reviewSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReviews(fetchedReviews);
    };

    if (uid) fetchProvider();
    return () => unsubscribeAuth();
  }, [uid, user]);

  const handleRecommend = async () => {
    if (!user) {
      toast.warning("Please login to recommend this provider.");
      return;
    }
    if (hasRecommended) {
      toast.info("You already recommended this provider.");
      return;
    }

    try {
      const ref = doc(db, "providers", uid);
      await updateDoc(ref, {
        recommendCount: increment(1),
        recommendedBy: arrayUnion(user.uid),
      });
      setHasRecommended(true);
      toast.success("Thanks for recommending!");
    } catch (err) {
      toast.error("Failed to recommend. Try again.");
    }
  };

  const handleRateReview = () => {
    navigate(`/review/${uid}`);
  };

  if (!provider) return <p className="text-center mt-10">Loading provider details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-5 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-semibold text-blue-700 mb-2">{provider.name}</h2>

      <div className="flex items-center justify-between mb-4">
        <p className="text-lg text-gray-700">{provider.service}</p>
        <div className="flex items-center text-yellow-500">
          <Star className="w-5 h-5 fill-yellow-400" />
          <span className="ml-1 text-gray-700">{(provider.avgRating || 0).toFixed(1)}/5</span>
        </div>
      </div>

      <p className="text-gray-700"><strong>Location:</strong> {provider.locality}, {provider.district}</p>
      {provider.availableTime && <p className="text-gray-700"><strong>Available:</strong> {provider.availableTime}</p>}
      {provider.phone && <p className="text-gray-700"><strong>Contact:</strong> {provider.phone}</p>}

      {/* Recommend & Call Buttons */}
      <div className="flex mt-4 gap-2">
        <button
          onClick={handleRecommend}
          className={`w-1/2 flex items-center justify-center py-2 rounded font-medium transition ${
            hasRecommended ? "bg-yellow-400 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          <ThumbsUp className="w-5 h-5 mr-2" /> Recommend ({provider.recommendCount || 0})
        </button>

        <button
          onClick={handleRateReview}
          className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
        >
          ⭐ Rate & Review
        </button>
      </div>

      {/* Reviews Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">User Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b py-3">
              <div className="flex items-center mb-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-800 text-sm">{rev.comment}</p>
              {rev.tags?.length > 0 && (
                <div className="flex flex-wrap mt-1">
                  {rev.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1 mb-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {rev.userName || "Anonymous"} — {new Date(rev.timestamp?.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProviderDetails;
