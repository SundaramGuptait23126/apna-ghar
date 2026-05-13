import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import PropertyCard from '../PropertyCard';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/properties/all`, {
        params: { 
          location: searchQuery || undefined, 
          // Note: map 'type' to our backend property filters if needed later
          // type: typeFilter === 'All' ? undefined : typeFilter 
        }
      });
      // Handle the new response structure
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Adding a debounce to search
    const delayDebounceFn = setTimeout(() => {
      fetchProperties();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, typeFilter]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar (Moved from Navbar to Home for better control) */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="relative w-full max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Enter Locality / Project / Landmark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-md border border-gray-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002f6c]"
          />
          <button 
            onClick={fetchProperties}
            className="absolute inset-y-1 right-1 px-4 bg-[#ff4f4f] text-white rounded hover:bg-red-600 transition flex items-center justify-center"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb & Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Properties for Sale</h1>
        <p className="text-gray-500 mt-1">Showing {properties.length} results based on your preferences</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {['All', 'Buy', 'Rent', 'Commercial', 'Plots'].map(type => (
            <button 
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                typeFilter === type 
                  ? 'bg-[#002f6c] text-white border-[#002f6c]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === 'All' ? 'All Properties' : type}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#002f6c]">
            <SlidersHorizontal className="h-4 w-4" />
            Sort By: Relevance
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#002f6c]">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="text-center py-20">Loading properties...</div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setTypeFilter('All'); }}
            className="mt-4 px-4 py-2 bg-[#002f6c] text-white rounded hover:bg-[#001f4c]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
};

export default Home;
