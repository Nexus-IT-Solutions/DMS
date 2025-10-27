import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 px-4 py-8">
  <div className="bg-gray-900/90 rounded-2xl shadow-2xl p-8 md:p-16 flex flex-col items-center max-w-lg w-full border border-gray-800 backdrop-blur-md">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-teal-500/20 mb-6">
          <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-6xl font-extrabold text-teal-400 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-2 text-center">
          Page Not Found
        </h2>
        <p className="text-gray-300 dark:text-gray-400 text-center mb-8 leading-relaxed">
          Oops! The page you are looking for does not exist or has been moved.
          <br />
          Please check the URL or navigate to one of our main pages.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            to="/"
            className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
      <footer className="mt-8 text-gray-400 dark:text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()} Disability Management System
      </footer>
    </div>
  );
};

export default PageNotFound;
