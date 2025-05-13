import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PlantG</h3>
            <p className="text-gray-300">
              Plant disease detection made easy with machine learning and expert analysis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-300 hover:text-primary-300">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-300">
                  Plant Disease Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-300">
                  Treatment Options
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-300">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300">Email: info@plantg.com</p>
            <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} PlantG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 