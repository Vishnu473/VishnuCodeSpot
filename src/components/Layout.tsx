import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Settings } from 'lucide-react';
// import { useTheme } from '../Context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">

      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold">Vishnu's Code Spot</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <Link to="/" className="px-3 py-2 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </Link>
                  <Link to="/admin" className="px-3 py-2 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                </div>
              </div>
            </div>

            {/* <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button> */}
          </div>
        </div>

        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 py-3 space-y-1">
            <Link to="/" className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link to="/admin" className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} DevBlog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;