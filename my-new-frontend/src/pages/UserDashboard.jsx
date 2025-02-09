import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Clock, ChevronLeft, Star, XCircle, Grid } from 'lucide-react';
import axios from 'axios';

const UserDashboard = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [step, setStep] = useState('dashboard');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendedLocations, setRecommendedLocations] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Fetch Services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/services', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const processedServices = (Array.isArray(response.data) ? response.data : response.data.services || [])
          .map(service => ({
            _id: service._id || service.id,
            name: service.name,
            category: service.category,
            description: service.description,
            price: service.price,
            rating: {
              average: service.rating?.average || 0,
              count: service.rating?.count || 0
            }
          }));

        setServices(processedServices);
        setFilteredServices(processedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
  
    fetchServices();
  }, []);

  // Initialize Map
  useEffect(() => {
    const mapInstance = L.map(mapRef.current, {
      center: [28.6139, 77.2090], // Default to Delhi
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Fetch Locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (locationInput.length > 2) {
        try {
          const response = await axios.get('http://localhost:5000/api/locations/recommendations', {
            params: { query: locationInput }
          });
          
          const locations = Array.isArray(response.data) 
            ? response.data 
            : response.data.locations || [];
          
          setRecommendedLocations(locations);
        } catch (error) {
          console.error('Error fetching locations:', error);
          setRecommendedLocations([
            { id: 1, name: "Connaught Place", area: "Central Delhi", coordinates: [77.209, 28.6139] },
            { id: 2, name: "Lajpat Nagar", area: "South Delhi", coordinates: [77.239, 28.5721] },
            { id: 3, name: "Karol Bagh", area: "West Delhi", coordinates: [77.185, 28.6504] }
          ]);
        }
      }
    };

    fetchLocations();
  }, [locationInput]);

  // Fetch Providers
  useEffect(() => {
    const fetchProviders = async () => {
      if (selectedService && selectedLocation) {
        try {
          const response = await axios.get('http://localhost:5000/api/providers', {
            params: {
              serviceId: selectedService._id,
              locationId: selectedLocation.id
            }
          });
          
          const processedProviders = (Array.isArray(response.data) ? response.data : response.data.providers || [])
            .map(provider => ({
              _id: provider._id || provider.id,
              name: provider.name,
              experience: provider.experience,
              rating: provider.rating || 0,
              price: provider.price
            }));

          setProviders(processedProviders);
        } catch (error) {
          console.error('Error fetching providers:', error);
        }
      }
    };

    fetchProviders();
  }, [selectedService, selectedLocation]);

  // Icon mapping for services
  const getServiceIcon = (category) => {
    const icons = {
      'cleaning': '🧹',
      'cooking': '👨‍🍳',
      'plumbing': '🚿',
      'electrical': '⚡',
      'default': '🔧'
    };
    return icons[category?.toLowerCase()] || icons['default'];
  };

  // Location Selection Handler
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationInput(location.name);
    setRecommendedLocations([]);
    setStep('providers');

    // Update map
    if (map) {
      map.setView(location.coordinates, 12);
      L.marker(location.coordinates)
        .addTo(map)
        .bindPopup(location.name)
        .openPopup();
    }
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="h-full flex flex-col justify-center items-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Home Services Dashboard
        </h1>
        <button 
          onClick={() => setStep('services')}
          className="bg-blue-600 text-white px-8 py-3 rounded-full flex items-center justify-center mx-auto space-x-2 hover:bg-blue-700 transition duration-300"
        >
          <Grid className="mr-2" />
          View All Services
        </button>
      </div>
    </div>
  );

  // Render Services
  const renderServices = () => (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Services</h2>
        <button 
          onClick={() => setStep('dashboard')}
          className="text-gray-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(service => (
          <div 
            key={service._id}
            onClick={() => {
              setSelectedService(service);
              setStep('location');
            }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">
                {getServiceIcon(service.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{service.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {service.rating?.average || 0}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-500">
                    Starting from ₹{service.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Location Search
  const renderLocationSearch = () => (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 w-[420px] max-w-[90%]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Select Location</h2>
        <button 
          onClick={() => setStep('services')}
          className="text-gray-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="relative mb-4">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Enter your location"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {recommendedLocations.length > 0 && (
        <div className="space-y-2">
          {recommendedLocations.map(location => (
            <div 
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              className="p-3 bg-gray-100 rounded-xl hover:bg-blue-100 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{location.name}</p>
                  <p className="text-sm text-gray-600">{location.area}</p>
                </div>
                <MapPin className="text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Providers
  const renderProviders = () => (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedService.name} Providers
        </h2>
        <button 
          onClick={() => setStep('location')}
          className="text-gray-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map(provider => (
          <div 
            key={provider._id}
            onClick={() => {
              setSelectedProvider(provider);
              setStep('booking');
            }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">👨‍🔧</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{provider.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{provider.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{provider.experience} experience</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-500">₹{provider.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Booking Confirmation
  const renderBooking = () => (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Confirm Booking</h2>
        <button 
          onClick={() => setStep('providers')}
          className="text-gray-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Service Details</h3>
          <div className="flex items-center">
            <div className="text-3xl mr-4">{getServiceIcon(selectedService.category)}</div>
            <div>
              <p className="font-medium">{selectedService.name}</p>
              <p className="text-sm text-gray-600">{selectedService.description}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Provider Details</h3>
          <div className="flex items-center">
            <div className="text-3xl mr-4">👨‍🔧</div>
            <div>
              <p className="font-medium">{selectedProvider.name}</p>
              <p className="text-sm text-gray-600">{selectedProvider.experience} experience</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <p>{selectedLocation.name}</p>
        </div>
        <button 
          onClick={() => {
            // Implement booking logic
            alert('Booking Confirmed!');
            setStep('dashboard');
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <div 
        ref={mapRef}
        id="dashboard-map" 
        className="w-full h-[40vh] z-0 bg-blue-100"
      />
      <div className="w-full h-[60vh] bg-gray-50 p-0 flex items-center justify-center relative">
        {step === 'dashboard' && renderDashboard()}
        {step === 'services' && renderServices()}
        {step === 'location' && renderLocationSearch()}
        {step === 'providers' && renderProviders()}
        {step === 'booking' && renderBooking()}
      </div>
    </div>
  )};


  export default UserDashboard;
