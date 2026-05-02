import { Heart, MapPin, Maximize, ShieldCheck, TrendingUp, User } from 'lucide-react';

const PropertyCard = ({ property }) => {
  let tags = [];
  try {
    tags = typeof property.tags === 'string' ? JSON.parse(property.tags) : (property.tags || []);
  } catch (e) {
    tags = [];
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-64 overflow-hidden shrink-0">
        <img 
          src={property.image ? (property.image.startsWith('/uploads') ? `http://localhost:5000${property.image}` : property.image) : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-12">
          {tags.map((tag, idx) => (
            <span key={idx} className={`px-2 py-1 text-xs font-semibold rounded-md shadow-sm ${tag.toLowerCase() === 'sale' || tag.toLowerCase() === 'buy' ? 'bg-[#ff4f4f] text-white' : 'bg-green-600 text-white'}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-sm">
          <Heart className="h-5 w-5" />
        </button>

        {/* AI Insight Badge */}
        {property.aiEstimate && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <TrendingUp className="h-4 w-4 text-[#002f6c]" />
            <span className="text-xs font-bold text-gray-800">85% Match</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-[#002f6c] transition-colors">{property.title}</h3>
          {Boolean(property.verified) && (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs whitespace-nowrap shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 mb-4 text-sm">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">{property.price}</div>
            <div className="text-sm text-gray-500">{property.pricePerSqFt}</div>
          </div>
          {property.aiEstimate && (
            <div className="flex items-center gap-1 text-xs text-[#002f6c] font-medium bg-blue-50 px-2 py-1 rounded shrink-0">
              <SparklesIcon className="h-3.5 w-3.5" />
              AI Est: {property.aiEstimate}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Maximize className="h-4 w-4 text-gray-400" />
              <span className="truncate">{property.area}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4 text-gray-400" />
              <span className="truncate">{property.postedBy}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Posted {property.postedAgo}</span>
            <button className="text-[#002f6c] font-semibold hover:text-[#ff4f4f] transition-colors">Contact Agent</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);

export default PropertyCard;
