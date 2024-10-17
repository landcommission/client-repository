import React from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  Users,
  FileText,
  Globe,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Database,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const QuickLinks = () => {
  const links = [
    { icon: Landmark, text: "About NLC", url: "https://landcommission.go.ke/about-us/" },
    { icon: Users, text: "Public Access", url: "https://landcommission.go.ke/public-access/" },
    { icon: FileText, text: "Forms & Downloads", url: "https://landcommission.go.ke/forms-downloads/" },
    { icon: Globe, text: "Land Management", url: "https://landcommission.go.ke/land-management/" },
    { icon: ExternalLink, text: "NLC Website", url: "https://landcommission.go.ke" },
    { icon: Database, text: "NRF Repository", url: "https://repository.nrf.go.ke/home" },
    { icon: Database, text: "KIPPRA Repository", url: "https://kippra.or.ke/repository/" },
  ];

  const socialLinks = [
    { icon: Facebook, text: "Facebook", url: "https://web.facebook.com/nationallandcommission/?_rdc=1&_rdr" },
    { icon: Twitter, text: "Twitter", url: "https://x.com/nlc_kenya" },
    { icon: Instagram, text: "Instagram", url: "https://www.instagram.com/nationallandcommissionkenya_/" },
    { icon: Youtube, text: "YouTube", url: "https://www.youtube.com/channel/UCITF1VOJC--kzsiBLw7xIjw" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "316 Upperhill Chambers, 2nd Ngong Avenue, Nairobi" },
    { icon: Phone, text: "0111042800" },
    { icon: Mail, text: "info@landcommission.go.ke" },
  ];

  return (
    <div className="p-4 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-green-700">Quick Access</h3>
          <div className="grid grid-cols-2 gap-2">
            {links.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 bg-green-50 rounded-md hover:bg-green-100 transition duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <link.icon className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-xs text-green-700">{link.text}</span>
              </motion.a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2 text-green-700">Connect with Us</h3>
          <div className="flex space-x-2 mb-4">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-50 rounded-full hover:bg-green-100 transition duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <link.icon className="w-4 h-4 text-green-600" />
              </motion.a>
            ))}
          </div>
          <h3 className="text-sm font-semibold mb-2 text-green-700">Contact Us</h3>
          <div className="space-y-1">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start">
                <info.icon className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-green-700">{info.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;