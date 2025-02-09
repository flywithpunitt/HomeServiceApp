import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const innovativeFeatures = [
    {
      title: 'AI Service Matcher',
      description: 'Intelligent algorithm matches you with the perfect service provider based on your home\'s unique needs and your preferences.',
      icon: '🤖',
      color: 'bg-gradient-to-r from-purple-600 to-indigo-600'
    },
    {
      title: 'Eco-Service Credits',
      description: 'Earn sustainability credits for choosing eco-friendly services and green service providers.',
      icon: '🌿',
      color: 'bg-gradient-to-r from-green-600 to-emerald-600'
    },
    {
      title: 'Community Guardian Network',
      description: 'Verified service providers undergo comprehensive background checks and community endorsements.',
      icon: '🛡️',
      color: 'bg-gradient-to-r from-blue-600 to-cyan-600'
    },
    {
      title: 'Predictive Maintenance',
      description: 'AI-powered analytics predict potential home maintenance issues before they become critical.',
      icon: '🔮',
      color: 'bg-gradient-to-r from-orange-600 to-red-600'
    }
  ];

  const serviceCategories = [
    {
      name: 'Home Cleaning',
      description: 'Transformative cleanliness tailored to your lifestyle',
      icon: '🧹',
      background: 'bg-gradient-to-br from-blue-500 to-blue-700'
    },
    {
      name: 'Home Cooking',
      description: 'Culinary experiences crafted in your personal kitchen',
      icon: '👨‍🍳',
      background: 'bg-gradient-to-br from-green-500 to-green-700'
    },
    {
      name: 'Plumbing Services',
      description: 'Precision solutions for your home\'s vital systems',
      icon: '🚿',
      background: 'bg-gradient-to-br from-indigo-500 to-indigo-700'
    },
    {
      name: 'Electrical Services',
      description: 'Powering your home with expert, safe solutions',
      icon: '⚡',
      background: 'bg-gradient-to-br from-purple-500 to-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cinematic Feel */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        {/* Particle-like Background Effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-white rounded-full opacity-10"
              style={{
                width: `${Math.random() * 10}px`,
                height: `${Math.random() * 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 3}s infinite`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Reimagining <br />
              <span className="text-yellow-300">Home Services</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 leading-relaxed">
              Where Technology Meets Home Care - Personalized, Intelligent, Seamless
            </p>
            <div className="space-x-4">
              <Link 
                to="/register" 
                className="px-10 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
              >
                Join Now
              </Link>
              <Link 
                to="/login" 
                className="px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-700 transition duration-300 inline-block"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Innovative Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Revolutionary Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {innovativeFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`relative group overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 ${
                activeFeature === index ? 'scale-105 shadow-2xl' : ''
              }`}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className={`absolute inset-0 ${feature.color} opacity-90`}></div>
              <div className="relative z-10 p-6 text-white">
                <div className="text-6xl mb-4 opacity-80">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-16 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Our Core Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCategories.map((service, index) => (
            <div 
              key={index} 
              className={`relative group overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105`}
            >
              <div className={`absolute inset-0 ${service.background} opacity-80`}></div>
              <div className="relative z-10 p-6 text-white h-full flex flex-col">
                <div className="text-6xl mb-4 opacity-80">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                <p className="text-sm mb-4 opacity-90 flex-grow">{service.description}</p>
                <Link 
                  to="/register" 
                  className="mt-4 inline-block bg-white text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300 self-start"
                >
                  Book Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CoderCraftes</h3>
              <p className="text-gray-400">Transforming Home Services Through Innovation</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-gray-300 hover:text-white">Register</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-white">Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">📧 info@codercraftes.com</p>
              <p className="text-gray-300">📞 +91-9798075389</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2024 CoderCraftes. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Styles for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default Home;