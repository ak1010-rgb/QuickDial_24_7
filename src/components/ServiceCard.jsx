import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Star, ThumbsUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ uid, name, service, locality, district, availableTime, phone }) => {
  const [recommendCount, setRecommendCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);
  const [hasRecommended, setHasRecommended] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u || null));

    if (uid) {
      const fetchData = async () => {
        const ref = doc(db, 'providers', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setRecommendCount(data.recommendCount || 0);
          setRating(data.avgRating || 0); // avgRating field from Firestore
        }
      };
      fetchData();
    }

    return () => unsubscribeAuth();
  }, [uid]);

  const handleRecommend = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.warning("Please login to recommend a provider.");
      return;
    }
    if (hasRecommended) {
      toast.info("You already recommended this provider.");
      return;
    }

    try {
      const ref = doc(db, 'providers', uid);
      await updateDoc(ref, { recommendCount: increment(1) });
      setRecommendCount((prev) => prev + 1);
      setHasRecommended(true);
      toast.success("Thanks for recommending!");
    } catch (err) {
      toast.error("Failed to recommend. Try again.");
    }
  };

  const handleRateReview = (e) => {
    e.stopPropagation();
    navigate(`/review/${uid}`);
  };

  const handleCardClick = () => {
    navigate(`/provider/${uid}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border rounded-lg p-4 shadow-md bg-white flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-blue-700">{name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="w-5 h-5 fill-yellow-400" />
            <span className="ml-1 text-gray-700 text-sm">{rating.toFixed(1)}/5</span>
          </div>
        </div>

        <p className="text-gray-700 mb-1"><strong>Service:</strong> {service}</p>
        <p className="text-gray-700 mb-1"><strong>Location:</strong> {locality}, {district}</p>
        {availableTime && (
          <p className="text-gray-700 mb-1"><strong>Available:</strong> {availableTime}</p>
        )}
        {phone && (
          <p className="text-gray-700 mb-2"><strong>Contact:</strong> {phone}</p>
        )}

        {/* 👍 Recommend Section */}
        <div className="flex items-center text-yellow-600 mt-2">
          <ThumbsUp
            className={`w-5 h-5 cursor-pointer ${hasRecommended ? 'fill-yellow-400' : 'stroke-yellow-500'}`}
            onClick={handleRecommend}
          />
          <span className="ml-2 text-sm text-gray-700">
            Recommended by {recommendCount} users
          </span>
        </div>
      </div>

      {/* Buttons row */}
      <div className="flex mt-3 gap-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="w-1/2 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded font-medium transition"
          >
            📞 Call Now
          </a>
        )}
        <button
          onClick={handleRateReview}
          className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded font-medium transition"
        >
          ⭐ Rate & Review
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
