import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUpload, FaHistory, FaLeaf, FaChartBar, FaCalendarAlt } from 'react-icons/fa'

const Dashboard = () => {
  // Mock data for recent analyses
  const recentAnalyses = [
    {
      id: 1,
      plantName: 'Tomato Plant',
      disease: 'Late Blight',
      date: 'May 10, 2023',
      confidence: 96.8,
      status: 'Severe'
    },
    {
      id: 2,
      plantName: 'Rose Bush',
      disease: 'Black Spot',
      date: 'May 5, 2023',
      confidence: 94.5,
      status: 'Moderate'
    },
    {
      id: 3,
      plantName: 'Apple Tree',
      disease: 'Apple Scab',
      date: 'April 28, 2023',
      confidence: 98.2,
      status: 'Mild'
    }
  ]

  // Mock data for statistics
  const statistics = [
    { label: 'Total Analyses', value: 24, icon: <FaLeaf size={20} color="#2d882d" /> },
    { label: 'Detected Diseases', value: 18, icon: <FaChartBar size={20} color="#2d882d" /> },
    { label: 'Days Active', value: 30, icon: <FaCalendarAlt size={20} color="#2d882d" /> }
  ]

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="container py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back! Here's an overview of your plant health monitoring.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <Link
                to="/analysis"
                className="btn bg-primary-500 hover:bg-primary-600 text-white"
              >
                <div className="flex items-center">
                  <FaUpload size={16} />
                  <span className="ml-2">New Analysis</span>
                </div>
              </Link>
              <Link
                to="/history"
                className="btn btn-outline"
              >
                <div className="flex items-center">
                  <FaHistory size={16} />
                  <span className="ml-2">View History</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Analyses */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden mb-10">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Recent Analyses</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Plant</th>
                    <th className="px-6 py-3 text-left">Disease</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Confidence</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAnalyses.map((analysis) => (
                    <tr key={analysis.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{analysis.plantName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{analysis.disease}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{analysis.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{analysis.confidence}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${analysis.status === 'Severe' ? 'bg-red-100 text-red-800' : 
                          analysis.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}
                        >
                          {analysis.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a href="#" className="text-primary-600 hover:text-primary-900">View Details</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 text-center">
              <Link to="/history" className="text-primary-600 hover:text-primary-700 font-medium">
                View all analyses
              </Link>
            </div>
          </div>

          {/* Quick Help Box */}
          <div className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-4">
              Learn how to get the most accurate plant disease diagnoses with these tips:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Take clear, well-lit photos of the affected plant parts</li>
              <li>Include both healthy and infected areas in your photo for comparison</li>
              <li>Take multiple photos from different angles for better analysis</li>
              <li>Avoid shadows or glare that might obscure symptoms</li>
            </ul>
            <Link to="/features" className="text-primary-600 hover:text-primary-700 font-medium">
              Learn more about using PlantG effectively →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 