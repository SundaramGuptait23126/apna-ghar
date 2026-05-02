import { Search, ChevronDown, Sparkles, MapPin, Calculator, Menu, User, Home, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Navbar */}
      <div className="bg-[#002f6c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-[#ff4f4f] p-1.5 rounded-md">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ApnaGhar</span>
            </Link>

            <div className="flex items-center gap-4">
              {user && user.role === 'admin' && (
                <Link to="/admin" className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-gray-200 border border-yellow-400 rounded-md px-3 py-1.5 bg-yellow-400/20 text-yellow-400 transition-colors">
                  <Shield className="h-4 w-4" /> Admin Panel
                </Link>
              )}
              
              <button className="hidden sm:block text-sm font-medium hover:text-gray-200 border border-white/30 rounded-md px-3 py-1.5 bg-white/10 transition-colors">
                Post Property <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded ml-1 font-bold">FREE</span>
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </div>
                  <button onClick={() => { onLogout(); navigate('/login'); }} className="text-sm font-medium text-red-300 hover:text-red-400 flex items-center gap-1">
                    <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                  <User className="h-5 w-5" />
                  <span className="font-medium text-sm">Login/Register</span>
                </Link>
              )}
              
              <div className="sm:hidden flex items-center">
                <Menu className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="border-b border-gray-200 bg-white hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 h-12 items-center text-sm font-medium text-gray-700">
            <Link to="/" className="flex items-center gap-1 cursor-pointer hover:text-[#ff4f4f]">
              Buy <ChevronDown className="h-4 w-4" />
            </Link>
            <Link to="/" className="flex items-center gap-1 cursor-pointer hover:text-[#ff4f4f]">
              Rent <ChevronDown className="h-4 w-4" />
            </Link>
            <Link to="/" className="flex items-center gap-1 cursor-pointer hover:text-[#ff4f4f] text-[#002f6c] border-b-2 border-[#002f6c] h-full">
              Commercial <ChevronDown className="h-4 w-4" />
            </Link>
            <Link to="/" className="cursor-pointer hover:text-[#ff4f4f]">
              Plots/Land
            </Link>
            
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            
            <div className="flex items-center gap-1 cursor-pointer text-[#002f6c] hover:text-[#ff4f4f]">
              <Sparkles className="h-4 w-4" />
              AI Insights <span className="bg-[#ff4f4f] text-white text-[9px] px-1.5 py-0.5 rounded ml-1 font-bold">NEW</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#ff4f4f]">
              <Calculator className="h-4 w-4" />
              EMI Calculator
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#ff4f4f]">
              <MapPin className="h-4 w-4" />
              Map View
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
