import React from "react";
import { Link } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";

const Footer = () => {
  return (
    <footer className="bg-[#0B132B] text-gray-300 font-sans mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-500 fill-current" viewBox="0 0 24 24">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h6v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
              </svg>
              <span className="text-xl font-bold text-white tracking-tight">NexCart</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Elevating your everyday through curated, premium essentials. Designed for the modern style.
            </p>
          </div>

          {/* Column 1: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">COMPANY</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Jobs</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">RESOURCES</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Support</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Gift Cards</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Insights</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">LEGAL</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} NexCart. All Rights Reserved.</p>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
            <LanguageIcon sx={{ fontSize: 18 }} />
            <span>United States (USD)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

