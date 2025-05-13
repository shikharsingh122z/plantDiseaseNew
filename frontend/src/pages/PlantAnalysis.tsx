import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCloudUploadAlt, FaCamera, FaLeaf } from 'react-icons/fa'

const PlantAnalysis = () => {
  const [activeTab, setActiveTab] = useState('main') // 'main' or 'kids'
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      
      // Reset results
      setResult(null)
    }
  }

  // Handle analysis submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    
    setIsAnalyzing(true)
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Example result data
      const demoResult = {
        disease: 'Tomato Late Blight',
        confidence: 97.5,
        description: 'Late blight is a devastating disease caused by the fungus-like oomycete pathogen Phytophthora infestans. It can rapidly destroy tomato plants, especially in cool, wet conditions.',
        symptoms: [
          'Dark, water-soaked spots on leaves',
          'White, fuzzy growth on the undersides of leaves',
          'Brown lesions on stems',
          'Firm, dark, greasy-looking spots on fruits'
        ],
        treatments: [
          'Remove and destroy affected plant parts',
          'Apply copper-based fungicide as a preventative measure',
          'Ensure good air circulation around plants',
          'Water at the base of plants, avoiding wet foliage',
          'Rotate crops yearly'
        ]
      }
      
      setResult(demoResult)
      setIsAnalyzing(false)
    }, 2000)
  }

  // Reset the analysis
  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Tab Switcher */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container">
          <div className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'main' 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('main')}
            >
              Plant Disease Analysis
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'kids' 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('kids')}
            >
              Kids Learning Zone
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'main' ? (
        // Main Plant Analysis Interface
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Plant Disease Analysis
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Upload a photo of your plant, and our AI will analyze it to identify diseases and provide treatment recommendations.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                {!result ? (
                  <div className="p-8">
                    <form onSubmit={handleSubmit}>
                      {!preview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                          <div className="flex justify-center mb-4">
                            <FaCloudUploadAlt size={48} color="#94a3b8" />
                          </div>
                          <p className="text-gray-600 mb-4">
                            Drag and drop an image here, or click to select a file
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <div className="flex gap-4 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="btn bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 cursor-pointer"
                            >
                              Select Image
                            </label>
                            <button
                              type="button"
                              className="btn btn-outline px-6 py-2"
                              onClick={() => {
                                // Activate device camera
                                const input = document.getElementById('file-upload') as HTMLInputElement
                                input.click()
                              }}
                            >
                              <span className="flex items-center">
                                <FaCamera size={16} />
                                <span className="ml-2">Take Photo</span>
                              </span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-6">
                            <div className="max-h-96 overflow-hidden rounded-lg">
                              <img 
                                src={preview} 
                                alt="Plant preview" 
                                className="w-full object-contain"
                              />
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={handleReset}
                              className="btn btn-outline px-6 py-2"
                            >
                              Choose Different Image
                            </button>
                            <button
                              type="submit"
                              className="btn bg-primary-500 hover:bg-primary-600 text-white px-8 py-2"
                              disabled={isAnalyzing}
                            >
                              {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <div className="rounded-lg overflow-hidden mb-4">
                          <img 
                            src={preview!} 
                            alt="Analyzed plant" 
                            className="w-full object-contain"
                          />
                        </div>
                        <div className="bg-primary-50 rounded-lg p-4 text-center">
                          <h3 className="font-semibold text-primary-700">Diagnosis</h3>
                          <p className="text-2xl font-bold text-primary-800 mb-1">{result.disease}</p>
                          <div className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                            {result.confidence}% Confidence
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Analysis Results</h2>
                        
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                          <p className="text-gray-700">{result.description}</p>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2 text-gray-900">Symptoms</h3>
                          <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            {result.symptoms.map((symptom: string, index: number) => (
                              <li key={index}>{symptom}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-900">Recommended Treatments</h3>
                          <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            {result.treatments.map((treatment: string, index: number) => (
                              <li key={index}>{treatment}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                      <button
                        onClick={handleReset}
                        className="btn btn-outline px-6 py-2"
                      >
                        Analyze Another Plant
                      </button>
                      <button
                        className="btn bg-accent-500 hover:bg-accent-600 text-white px-6 py-2"
                      >
                        Save Analysis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Kids Learning Zone
        <section className="py-12 bg-gradient-to-br from-primary-50 to-white">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  <span className="text-primary-600">Kids</span> Learning Zone
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Learn about plant health and how to identify common plant problems in a fun way!
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                    Learn About Plant Health
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Just like people, plants can get sick too! Learning how to spot when a plant isn't feeling well is an important skill that can help you become a great gardener.
                  </p>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="font-semibold text-lg mb-3 text-primary-600">
                      Signs a Plant Might Be Sick:
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="mt-1 mr-2 flex-shrink-0 text-primary-500">
                          <FaLeaf size={16} color="#2d882d" />
                        </div>
                        <span>Yellow or brown spots on leaves</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-2 flex-shrink-0 text-primary-500">
                          <FaLeaf size={16} color="#2d882d" />
                        </div>
                        <span>Wilting or drooping leaves even when watered</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-2 flex-shrink-0 text-primary-500">
                          <FaLeaf size={16} color="#2d882d" />
                        </div>
                        <span>White powdery substance on leaves</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mt-1 mr-2 flex-shrink-0 text-primary-500">
                          <FaLeaf size={16} color="#2d882d" />
                        </div>
                        <span>Holes or chewed parts of leaves</span>
                      </li>
                    </ul>
                  </div>
                  
                  <button className="btn bg-primary-500 hover:bg-primary-600 text-white px-6 py-2">
                    Start Learning Activities
                  </button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <img 
                      src="/images/children/child2.jpg" 
                      alt="Child learning about plants"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://source.unsplash.com/random/600x600/?child,plant,learning&sig=1"
                      }}
                    />
                  </div>
                  
                  <div className="absolute -bottom-8 -right-8 w-1/2 h-1/2 bg-accent-100 rounded-3xl -z-10"></div>
                  <div className="absolute -top-8 -left-8 w-24 h-24 bg-secondary-100 rounded-full -z-10"></div>
                </motion.div>
              </div>
              
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
                    Plant Detective Game
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Healthy Plant",
                        image: "https://source.unsplash.com/random/300x300/?healthy,plant",
                        description: "This plant has bright green leaves, stands tall, and looks strong!"
                      },
                      {
                        title: "Sick Plant",
                        image: "https://source.unsplash.com/random/300x300/?wilted,plant",
                        description: "This plant has yellow leaves and is drooping. It needs help!"
                      },
                      {
                        title: "Your Turn!",
                        image: "https://source.unsplash.com/random/300x300/?child,gardening",
                        description: "Can you spot the differences? Try to identify healthy vs. sick plants!"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.2 }}
                        className="bg-gray-50 rounded-lg overflow-hidden"
                      >
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 italic mb-4">
                      "By learning to identify plant problems early, you can help plants stay healthy and grow strong!"
                    </p>
                    <button className="btn bg-primary-500 hover:bg-primary-600 text-white px-8 py-3">
                      Start Plant Detective Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default PlantAnalysis 