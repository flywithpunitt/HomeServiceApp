import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Clock, ChevronLeft, Star } from 'lucide-react';

const services = [
  { id: 1, name: "Doctor", description: "Medical assistance", eta: "2 mins away", icon: "🩺", rating: 4.8 },
  { id: 2, name: "Electrician", description: "Wiring & repairs", eta: "3 mins away", icon: "🔧", rating: 4.6 },
  { id: 3, name: "Plumber", description: "Fixes & drains", eta: "4 mins away", icon: "🚿", rating: 4.7 },
  { id: 4, name: "Mechanic", description: "Vehicle repairs", eta: "5 mins away", icon: "🚗", rating: 4.5 },
  { id: 5, name: "Cook", description: "Home-cooked meals", eta: "6 mins away", icon: "👨‍🍳", rating: 4.9 },
  { id: 6, name: "Cleaning", description: "Home cleaning services", eta: "7 mins away", icon: "🧹", rating: 4.4 },
  { id: 7, name: "Laundry", description: "Wash & fold", eta: "8 mins away", icon: "🧺", rating: 4.3 },
  { id: 8, name: "Carpenter", description: "Wood work & repairs", eta: "9 mins away", icon: "🪚", rating: 4.7 }
];

const locations = [
  "Connaught Place", "Lajpat Nagar", "Karol Bagh", "Dwarka", "Nehru Place",
  "South Extension", "Greater Kailash", "Vasant Vihar", "Saket", "Noida Sector 62"
];

const FieldifyDashboard = () => {
  const [map, setMap] = useState(null);
  const [step, setStep] = useState('location');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [locationInput, setLocationInput] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const mapInstance = L.map("dashboard-map", {
      center: [28.6139, 77.2090],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapInstance);

    L.marker([28.6139, 77.2090]).addTo(mapInstance).bindPopup("Delhi, India").openPopup();

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  const handleLocationSearch = (input) => {
    setLocationInput(input);
    const filtered = locations.filter(location => 
      location.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationInput(location);
    setFilteredLocations(locations);
    setStep('services');
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep('booking');
  };

  const handleBookingConfirm = () => {
    setStep('confirmation');
  };

  const renderLocationSearch = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Find Services Near You
      </h2>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text"
          value={locationInput}
          placeholder="Enter your location"
          onChange={(e) => handleLocationSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {locationInput && filteredLocations.length > 0 && (
          <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
            {filteredLocations.map(location => (
              <div
                key={location}
                onClick={() => handleLocationSelect(location)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{location}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderServiceSelection = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Services</h2>
        <button
          onClick={() => setStep('location')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div 
            key={service.id}
            onClick={() => handleServiceSelect(service)}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{service.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{service.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{service.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-500">{service.eta}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setStep('services')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Confirm Booking</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-800">{selectedLocation}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-3xl">{selectedService.icon}</div>
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-medium text-gray-800">{selectedService.name}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedService.description}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleBookingConfirm}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="text-4xl">{selectedService.icon}</div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Confirmed!</h2>
      
      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Location</p>
          <p className="font-medium text-gray-800">{selectedLocation}</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Service</p>
          <p className="font-medium text-gray-800">{selectedService.name}</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-600">Status</p>
          <p className="font-medium text-blue-700">Searching for nearby provider...</p>
        </div>
      </div>

      <button 
        onClick={() => {
          setStep('location');
          setLocationInput('');
        }}
        className="w-full py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <div 
        id="dashboard-map" 
        className="w-full h-1/2 z-0"
      />
      <div className="w-full h-1/2 bg-gray-50 p-6 flex items-center justify-center relative">
        {step === 'location' && renderLocationSearch()}
        {step === 'services' && renderServiceSelection()}
        {step === 'booking' && renderBooking()}
        {step === 'confirmation' && renderConfirmation()}
      </div>
    </div>
  );
};

export default FieldifyDashboard;