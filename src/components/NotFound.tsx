import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-6">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8 text-center">Sorry, the page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Home className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;