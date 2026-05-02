import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    title: '', location: '', price: '', pricePerSqFt: '', area: '', 
    image: '', type: 'Buy', tags: '', verified: false, aiEstimate: '', postedBy: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchProperties();
    }
  }, [user, navigate]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/properties');
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags' && typeof formData[key] === 'string') {
          payload.append(key, JSON.stringify(formData[key].split(',').map(t => t.trim())));
        } else {
          payload.append(key, formData[key]);
        }
      });
      await axios.post('http://localhost:5000/properties', payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchProperties();
      setFormData({
        title: '', location: '', price: '', pricePerSqFt: '', area: '', 
        image: '', type: 'Buy', tags: '', verified: false, aiEstimate: '', postedBy: ''
      });
      alert('Property Added successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding property');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProperties();
    } catch (err) {
      alert('Error deleting property');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#002f6c] mb-8">Admin Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Property</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input required name="title" value={formData.title} onChange={handleInputChange} placeholder="Title (e.g. Office Space in Lajpat Nagar)" className="border p-2 rounded" />
          <input required name="location" value={formData.location} onChange={handleInputChange} placeholder="Location (e.g. Lajpat Nagar, Delhi)" className="border p-2 rounded" />
          <input required name="price" value={formData.price} onChange={handleInputChange} placeholder="Price (e.g. ₹6.3 Cr)" className="border p-2 rounded" />
          <input name="pricePerSqFt" value={formData.pricePerSqFt} onChange={handleInputChange} placeholder="Price per Sq.Ft" className="border p-2 rounded" />
          <input name="area" value={formData.area} onChange={handleInputChange} placeholder="Area (e.g. 2,127 sq.ft)" className="border p-2 rounded" />
          <input type="file" name="image" onChange={handleInputChange} accept="image/*" className="border p-2 rounded" />
          <select name="type" value={formData.type} onChange={handleInputChange} className="border p-2 rounded">
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
            <option value="Commercial">Commercial</option>
            <option value="Plots">Plots/Land</option>
          </select>
          <input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Tags (comma separated e.g. Sale, Ready To Move)" className="border p-2 rounded" />
          <input name="aiEstimate" value={formData.aiEstimate} onChange={handleInputChange} placeholder="AI Estimate (e.g. ₹7.3 Cr)" className="border p-2 rounded" />
          <input name="postedBy" value={formData.postedBy} onChange={handleInputChange} placeholder="Posted By (e.g. Owner)" className="border p-2 rounded" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="verified" checked={formData.verified} onChange={handleInputChange} />
            Verified Property
          </label>
          <div className="md:col-span-2 lg:col-span-3">
            <button type="submit" className="bg-[#ff4f4f] text-white px-6 py-2 rounded hover:bg-red-600 transition">Add Property</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Manage Properties ({properties.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
