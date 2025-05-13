import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFilter, FaSearch, FaDownload, FaTrash } from 'react-icons/fa'

const History = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Mock data for analysis history
  const historyItems = [
    {
      id: 1,
      plantName: 'Tomato Plant',
      disease: 'Late Blight',
      date: 'May 10, 2023',
      status: 'Severe',
      imageSrc: 'https://source.unsplash.com/random/100x100/?tomato,disease'
    },
    {
      id: 2,
      plantName: 'Rose Bush',
      disease: 'Black Spot',
      date: 'May 5, 2023',
      status: 'Moderate',
      imageSrc: 'https://source.unsplash.com/random/100x100/?rose,disease'
    },
    {
      id: 3,
      plantName: 'Apple Tree',
      disease: 'Apple Scab',
      date: 'April 28, 2023',
      status: 'Mild',
      imageSrc: 'https://source.unsplash.com/random/100x100/?apple,disease'
    },
    {
      id: 4,
      plantName: 'Bell Pepper',
      disease: 'Bacterial Spot',
      date: 'April 15, 2023',
      status: 'Severe',
      imageSrc: 'https://source.unsplash.com/random/100x100/?pepper,disease'
    },
    {
      id: 5,
      plantName: 'Cucumber',
      disease: 'Healthy',
      date: 'April 10, 2023',
      status: 'Healthy',
      imageSrc: 'https://source.unsplash.com/random/100x100/?cucumber,plant'
    },
    {
      id: 6,
      plantName: 'Strawberry',
      disease: 'Leaf Spot',
      date: 'April 5, 2023',
      status: 'Moderate',
      imageSrc: 'https://source.unsplash.com/random/100x100/?strawberry,disease'
    },
    {
      id: 7,
      plantName: 'Potato Plant',
      disease: 'Early Blight',
      date: 'March 28, 2023',
      status: 'Severe',
      imageSrc: 'https://source.unsplash.com/random/100x100/?potato,disease'
    },
    {
      id: 8,
      plantName: 'Sunflower',
      disease: 'Healthy',
      date: 'March 20, 2023',
      status: 'Healthy',
      imageSrc: 'https://source.unsplash.com/random/100x100/?sunflower,plant'
    }
  ]

  // Filter and search functionality
  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.plantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.disease.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'healthy' && item.status === 'Healthy') ||
                          (filterStatus === 'severe' && item.status === 'Severe') ||
                          (filterStatus === 'moderate' && item.status === 'Moderate') ||
                          (filterStatus === 'mild' && item.status === 'Mild')
    
    return matchesSearch && matchesFilter
  })

  // Toggle select item
  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  // Delete selected items
  const deleteSelectedItems = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      // In a real app, you would call an API to delete these items
      console.log('Deleting items:', selectedItems)
      alert('Items deleted successfully!')
      setSelectedItems([])
    }
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="container py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h1>
              <p className="text-gray-600">
                View and manage your past plant disease analyses
              </p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/analysis" className="btn bg-primary-500 hover:bg-primary-600 text-white">
                New Analysis
              </Link>
              {selectedItems.length > 0 && (
                <button
                  onClick={deleteSelectedItems}
                  className="btn bg-red-500 hover:bg-red-600 text-white flex items-center"
                >
                  <div className="flex items-center">
                    <FaTrash size={14} />
                    <span className="ml-2">Delete ({selectedItems.length})</span>
                  </div>
                </button>
              )}
              {selectedItems.length > 0 && (
                <button className="btn btn-outline flex items-center">
                  <div className="flex items-center">
                    <FaDownload size={14} />
                    <span className="ml-2">Export</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch size={16} color="#64748b" />
              </div>
              <input
                type="text"
                placeholder="Search by plant name or disease..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  className="select pl-10 pr-10 appearance-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="healthy">Healthy</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter size={16} color="#64748b" />
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Items Grid */}
          {filteredItems.length > 0 ? (
            <div>
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="checkbox mr-3"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedItems.length > 0 
                        ? `Selected ${selectedItems.length} of ${filteredItems.length}` 
                        : `${filteredItems.length} items`}
                    </span>
                  </div>
                </div>

                <div>
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <div className="p-4 flex items-center">
                        <input
                          type="checkbox"
                          className="checkbox mr-3"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                        />
                        <div className="hidden sm:block w-16 h-16 rounded overflow-hidden mr-4 bg-gray-100">
                          <img
                            src={item.imageSrc}
                            alt={item.plantName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/100?text=Plant"
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {item.plantName}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${item.status === 'Severe' ? 'bg-red-100 text-red-800' : 
                              item.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                              item.status === 'Mild' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'}`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
                            <span className="mr-4">{item.disease}</span>
                            <span className="text-gray-400">Analyzed on {item.date}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/history/${item.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pagination Placeholder */}
              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredItems.length} of {historyItems.length} analyses
                </p>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-outline px-4 py-1" disabled>
                    Previous
                  </button>
                  <button className="btn btn-sm bg-primary-50 text-primary-600 border border-primary-100 px-3 py-1">
                    1
                  </button>
                  <button className="btn btn-sm btn-outline px-4 py-1" disabled>
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-card p-16 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'No analyses match your search criteria. Try different keywords.' 
                  : 'You have no plant analyses yet.'}
              </p>
              <Link to="/analysis" className="btn bg-primary-500 hover:bg-primary-600 text-white px-6">
                Start a New Analysis
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History 