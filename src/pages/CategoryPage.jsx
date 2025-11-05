import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { providers as defaultProviders } from '../data/providers';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-');

const CategoryPage = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allProviders, setAllProviders] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const fetchProviders = async () => {
      try {
        // 🔹 Live Firestore listener
        unsubscribe = onSnapshot(collection(db, 'providers'), (snapshot) => {
          const firebaseProviders = snapshot.docs.map((doc) => ({
            ...doc.data(),
            slug: slugify(doc.data().service || '')
          }));

          const staticProvidersWithSlug = defaultProviders.map((p) => ({
            ...p,
            slug: slugify(p.service || '')
          }));

          setAllProviders([...staticProvidersWithSlug, ...firebaseProviders]);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching Firestore data:", err);
        // 🔹 Fallback to local providers if Firestore fails
        const staticProvidersWithSlug = defaultProviders.map((p) => ({
          ...p,
          slug: slugify(p.service || '')
        }));
        setAllProviders(staticProvidersWithSlug);
        setLoading(false);
      }
    };

    fetchProviders();

    // cleanup on unmount
    return () => unsubscribe && unsubscribe();
  }, []);

  const searchLower = searchTerm.toLowerCase();

  const states = [...new Set(allProviders.map((p) => p.state).filter(Boolean))];
  const districts = [...new Set(
    allProviders
      .filter((p) => p.state === selectedState)
      .map((p) => p.district)
      .filter(Boolean)
  )];

  const filtered = allProviders.filter((p) =>
    p.slug === slugify(category || '') &&
    (selectedState === '' || p.state === selectedState) &&
    (selectedDistrict === '' || p.district === selectedDistrict) &&
    (
      p.name?.toLowerCase().includes(searchLower) ||
      p.service?.toLowerCase().includes(searchLower) ||
      p.state?.toLowerCase().includes(searchLower) ||
      p.district?.toLowerCase().includes(searchLower) ||
      p.locality?.toLowerCase().includes(searchLower)
    )
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 capitalize text-center text-blue-600 tracking-wide">
        {category} Services
      </h2>

      {/* 🔹 State and District Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center justify-center">
        <select
          className="border px-4 py-2 rounded"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedDistrict('');
          }}
        >
          <option value="">All States</option>
          {states.map((state, i) => (
            <option key={i} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedState}
        >
          <option value="">All Districts</option>
          {districts.map((district, i) => (
            <option key={i} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* 🔍 Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 🧾 Results */}
      {loading ? (
        <p className="text-center text-gray-500">Loading providers...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((p, index) => <ServiceCard key={index} {...p} />)
          ) : (
            <p className="text-center col-span-full text-gray-600">
              No providers found with selected filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
