import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen hidden md:block">
      <div className="p-4">
        <Link to="/" className="text-xl font-bold text-white">
          PlantG
        </Link>
      </div>
      <nav className="mt-8">
        <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Dashboard
        </div>
        <Link
          to="/dashboard"
          className={`flex items-center py-3 px-4 ${
            isActive('/dashboard') && !isActive('/dashboard/analysis') && !isActive('/dashboard/history')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Overview
        </Link>
        <Link
          to="/dashboard/analysis"
          className={`flex items-center py-3 px-4 ${
            isActive('/dashboard/analysis')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Plant Analysis
        </Link>
        <Link
          to="/dashboard/history"
          className={`flex items-center py-3 px-4 ${
            isActive('/dashboard/history')
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          History
        </Link>
        <div className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Account
        </div>
        <Link
          to="/profile"
          className="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          Profile
        </Link>
        <Link
          to="/settings"
          className="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          Settings
        </Link>
        <div className="px-4 pt-6">
          <button
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
            onClick={() => console.log('Logout')}
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar 