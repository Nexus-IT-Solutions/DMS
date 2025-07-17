import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8">
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-16 flex flex-col items-center max-w-lg w-full border border-gray-700">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-900/30 mb-6">
          <AlertTriangle className="text-teal-400 w-12 h-12" />
        </div>
        <h1 className="text-6xl font-extrabold text-teal-400 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-2 text-center">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Oops! The page you are looking for does not exist or has been moved.
          <br />
          Please check the URL or return to the homepage.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-200"
        >
          Go to Home
        </Link>
      </div>
      <footer className="mt-8 text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()} Disability Management System
      </footer>
    </div>
  );
};

export default PageNotFound;
