import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Send,
  CreditCard,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      {/* --- NEWSLETTER SECTION --- */}
      <div className="bg-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              Join our food circle
            </h3>
            <p className="text-gray-400">
              Get exclusive offers and menu updates sent to your inbox.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-l-xl focus:outline-none focus:border-orange-500 w-full md:w-80 transition-colors"
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-r-xl font-bold transition-colors flex items-center">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN LINKS SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Socials */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-extrabold text-white mb-1">
                Amit<span className="text-orange-500">Food</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mt-4">
                Authentic flavors delivered to your doorstep. We use 100% fresh
                ingredients, handmade with love and care for every order.
              </p>
            </div>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={20} />} href="#" />
              <SocialIcon icon={<Twitter size={20} />} href="#" />
              <SocialIcon
                icon={<Instagram size={20} />}
                href="https://www.instagram.com/annu_amit_990/"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={14} /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={14} /> Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={14} /> My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={14} /> Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-500 shrink-0 mt-1" size={20} />
                <span>
                  Telo bahiyartand, Telo,
                  <br /> Bokaro, IN 828403
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-orange-500 shrink-0" size={20} />
                <span>+91 8789732094</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-orange-500 shrink-0" size={20} />
                <span className="break-all">amitfoodproduct8789@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Opening Hours</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="text-white font-medium">
                  9:00 AM - 8:00 PM
                </span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-white font-medium">
                  10:00 AM - 7:00 PM
                </span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-orange-500 font-bold">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Amit Food Product. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4 grayscale opacity-50">
            {/* Payment Icons (Simulated) */}
            <div className="h-6 w-10 bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold">
              UPI
            </div>
            <div className="h-6 w-10 bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold">
              VISA
            </div>
            <div className="h-6 w-10 bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold">
              RuPay
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Component for Social Icons
const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-all transform hover:-translate-y-1"
  >
    {icon}
  </a>
);

export default Footer;
