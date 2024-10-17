import React from "react";
import { Link } from "react-router-dom";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const linkGroups = [
    {
      title: "Services",
      links: [
        { name: "Land Registration", url: "/services/registration" },
        { name: "Dispute Resolution", url: "/services/disputes" },
        { name: "Land Use Planning", url: "/services/planning" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Policies & Laws", url: "/resources/policies" },
        { name: "Publications", url: "/resources/publications" },
        { name: "FAQs", url: "/faqs" },
      ],
    },
    {
      title: "About NLC",
      links: [
        { name: "Our Mandate", url: "/about/mandate" },
        { name: "Leadership", url: "/about/leadership" },
        { name: "Careers", url: "/careers" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { name: "About NLC", url: "https://landcommission.go.ke/about-us/" },
        { name: "Public Access", url: "https://landcommission.go.ke/public-access/" },
        { name: "Forms & Downloads", url: "https://landcommission.go.ke/forms-downloads/" },
        { name: "Land Management", url: "https://landcommission.go.ke/land-management/" },
        { name: "NRF Repository", url: "https://repository.nrf.go.ke/home" },
        { name: "KIPPRA Repository", url: "https://kippra.or.ke/repository/" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaXTwitter />, url: "https://twitter.com/NLC_Kenya" },
    { icon: <FaFacebookF />, url: "https://www.facebook.com/NationalLandCommission" },
    { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/company/national-land-commission-kenya" },
    { icon: <FaYoutube />, url: "https://www.youtube.com/channel/UCNLHgFQ8H4ctuWE4Fd9Y4xQ" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/nationallandcommissionkenya_/" },
  ];

  return (
    <footer className="bg-green-700 text-white mt-6">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/images/gok.png"
                alt="NLC Logo"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-bold">
                National Land Commission
              </span>
            </Link>
            <p className="mt-2 text-xs text-green-200">
              Guardians of Kenya's Land Resources
            </p>
            <div className="mt-3 flex space-x-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-200 hover:text-white transition duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {linkGroups.map((group, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold mb-2 text-green-200">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-xs hover:text-green-300 transition duration-300"
                      target={link.url.startsWith('http') ? "_blank" : "_self"}
                      rel={link.url.startsWith('http') ? "noopener noreferrer" : ""}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-green-600 text-center text-xs text-green-200">
          <p>
            &copy; {currentYear} National Land Commission of Kenya. All rights
            reserved.
          </p>
          <div className="mt-1 space-x-4">
            <Link to="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact Us
            </Link>
          </div>
          <div className="mt-2 text-[10px] text-green-300">
            Developed by Joshua Nyamasege | <a href="mailto:joshuamaeba@gmail.com" className="hover:underline">joshuamaeba@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;