'use client'
import React from 'react';
import { Phone, Mail, GitHub, LinkedIn, YouTube, Instagram } from '@mui/icons-material';
import { toast } from 'react-toastify';
const handleSubscribe = (e) => {
  e.preventDefault();
  const email = e.target[0].value;

  // For now:
  console.log("Subscribed:", email);

  toast.success('email send successfully')
};


function Footer() {
  return (
    <footer className="mt-8 py-10 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Contact Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <a href="tel:+919865467888" className="flex justify-center sm:justify-start items-center text-gray-600 dark:text-gray-400 mb-2">
            <Phone fontSize="small" className="mr-2" />
            +91 98654 67888
          </a>
          <p className="flex justify-center sm:justify-start items-center text-gray-600 dark:text-gray-400">
            <Mail fontSize="small" className="mr-2" />
            <a
              href="mailto:support@crazyfashion.in"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              support@crazyfashion.in
            </a>
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a></li>
            <li><a href="/products" className="hover:text-blue-600 dark:hover:text-blue-400">Shop</a></li>
            
            <li><a href="/home" className="hover:text-blue-600 dark:hover:text-blue-400">Returns</a></li>
            
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="text-center sm:text-left flex flex-col items-center sm:items-start lg:items-center">
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 justify-center sm:justify-start lg:justify-center">
            <a href="https://github.com/sam-553" aria-label="GitHub">
              <GitHub className="text-gray-600 dark:text-gray-400 text-2xl hover:text-black dark:hover:text-white hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.linkedin.com/in/sameer-tiwari-a83337292" aria-label="LinkedIn">
              <LinkedIn className="text-gray-600 dark:text-gray-400 text-2xl hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-transform" />
            </a>
            
            <a href="https://www.instagram.com/sampandit553" aria-label="Instagram">
              <Instagram className="text-gray-600 dark:text-gray-400 text-2xl hover:text-pink-500 dark:hover:text-pink-400 hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="text-center sm:text-left">
  <h3 className="text-xl font-semibold mb-4">Subscribe</h3>
  <p className="text-gray-600 dark:text-gray-400 mb-2">
    Get updates on new arrivals and offers.
  </p>
  <form
    onSubmit={handleSubscribe}
    className="flex flex-col sm:flex-row items-center gap-2"
  >
    <input
      type="email"
      required
      placeholder="Your email"
      className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full sm:w-auto flex-1"
    />
    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition"
    >
      Subscribe
    </button>
  </form>
</div>

        
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 pt-6 border-t border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
        <p className="m-0 font-light">
          &copy; 2025 <strong>FashFiesta</strong>. All rights reserved. Designed to make you look bold, feel confident, and shop smarter.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
