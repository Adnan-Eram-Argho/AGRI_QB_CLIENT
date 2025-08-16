/**
 * Home page component
 * 
 * Environment Variables:
 * - None
 */

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">SAU Economics Question Bank</h1>
        <p className="text-xl text-gray-400 mb-8">
          A platform for SAU Economics students to share and access past exam questions
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/courses"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
          >
            Browse Questions
          </Link>
          <Link
            to="/upload"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
          >
            Upload Questions
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
          <p className="text-gray-400">
            Share past exam questions with your peers in just a few clicks.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
          <p className="text-gray-400">
            Find questions by course, year, exam type, and more.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
          <p className="text-gray-400">
            All questions are reviewed and approved by administrators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;