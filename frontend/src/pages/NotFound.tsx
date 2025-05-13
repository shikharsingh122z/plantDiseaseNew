import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome, FaLeaf } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="pt-20 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="container">
        <div className="max-w-xl mx-auto text-center p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 text-primary-500">
              <FaLeaf size={64} />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">404</h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="btn bg-primary-500 hover:bg-primary-600 text-white px-8 py-3"
              >
                <div className="flex items-center justify-center">
                  <FaHome size={16} />
                  <span className="ml-2">Return Home</span>
                </div>
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline px-8 py-3"
              >
                Contact Support
              </Link>
            </div>
            
            <div className="mt-16">
              <p className="text-gray-500">
                Looking for a plant diagnosis?
              </p>
              <Link
                to="/analysis"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Go to Plant Analysis →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NotFound 