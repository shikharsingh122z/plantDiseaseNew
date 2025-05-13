import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLeaf, FaSearch, FaClipboardCheck, FaGraduationCap, FaBrain, FaSmile, FaTools } from 'react-icons/fa'

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with background gradient and pattern */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 opacity-90"></div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Detect Plant Diseases with <span className="text-accent-200">Advanced AI</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 font-light max-w-3xl mx-auto">
              Upload an image of your plant and get instant analysis, diagnosis, and treatment recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-50 hover:shadow-lg px-8 py-3 text-base"
              >
                Get Started
              </Link>
              <Link
                to="/features"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-base"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative floating elements */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.2, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute top-1/3 left-10 w-24 h-24 bg-white/20 rounded-full blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 0.2, x: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute bottom-1/4 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl"
          />
        </div>
      </section>

      {/* Features Section with smooth animation */}
      <section className="py-20 bg-white relative">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Our plant disease detection process is simple, accurate, and designed to help you keep your plants healthy.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: <FaLeaf size={24} color="#2d882d" />,
                title: "Upload Photo",
                description: "Take a clear photo of your plant showing the affected area and upload it to our system.",
                delay: 0
              },
              {
                icon: <FaSearch size={24} color="#2d882d" />,
                title: "AI Analysis",
                description: "Our machine learning algorithm analyzes the image to identify the disease affecting your plant.",
                delay: 0.2
              },
              {
                icon: <FaClipboardCheck size={24} color="#2d882d" />,
                title: "Get Treatment",
                description: "Receive detailed information about the disease and recommended treatment options.",
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="card p-8 flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "98%", label: "Accuracy Rate" },
              { number: "50+", label: "Detectable Diseases" },
              { number: "20K+", label: "Users Worldwide" },
              { number: "100K+", label: "Plants Analyzed" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <p className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</p>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Section for Children */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-primary-50 rounded-r-[100px] -z-10 transform -translate-x-1/4"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Educating the <span className="text-primary-600">Next Generation</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                PlantG is committed to teaching children about plant health, sustainable agriculture, and environmental stewardship. Through interactive learning experiences, we're inspiring the next generation of plant enthusiasts and agricultural innovators.
              </p>
              
              <div className="grid grid-cols-2 gap-5 mb-8">
                {[
                  {
                    icon: <FaGraduationCap size={20} color="#2d882d" />,
                    title: "Interactive Learning",
                    description: "Fun, hands-on activities that teach the basics of plant care and disease identification."
                  },
                  {
                    icon: <FaBrain size={20} color="#2d882d" />,
                    title: "STEM Education",
                    description: "Combining biology, technology, and environmental science for a comprehensive learning experience."
                  },
                  {
                    icon: <FaSmile size={20} color="#2d882d" />,
                    title: "Kid-Friendly Interface",
                    description: "Age-appropriate tools and visuals designed specifically for young learners."
                  },
                  {
                    icon: <FaTools size={20} color="#2d882d" />,
                    title: "Practical Skills",
                    description: "Building real-world gardening and plant care skills that last a lifetime."
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link
                to="/features"
                className="btn bg-primary-500 hover:bg-primary-600 text-white shadow-md px-8 py-3"
              >
                Explore Educational Features
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent-500 rounded-3xl transform rotate-3 opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden p-6 border border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((num) => (
                      <motion.div
                        key={num}
                        whileHover={{ y: -5 }}
                        className="rounded-xl overflow-hidden shadow-md"
                      >
                        <img 
                          src={`/images/children/child${num}.jpg`}
                          alt={`Child learning about plants ${num}`}
                          className="w-full h-36 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://source.unsplash.com/random/300x300/?child,plant,education&sig=${num}`
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 text-center bg-primary-50 rounded-xl p-4">
                    <p className="text-primary-700 font-medium text-lg">
                      "Growing knowledge, nurturing minds."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              What Our Users Say
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "PlantG has transformed how I manage my garden. The instant disease detection has saved my tomatoes more than once!",
                name: "Sarah Johnson",
                title: "Home Gardener"
              },
              {
                quote: "As a professional farmer, I've tried many tools, but none match the accuracy and ease of use that PlantG provides.",
                name: "Michael Rodriguez",
                title: "Commercial Farmer"
              },
              {
                quote: "The treatment recommendations are practical and effective. It's like having a plant doctor in your pocket.",
                name: "Emily Chen",
                title: "Botanical Researcher"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-8"
              >
                <div className="mb-4 text-accent-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-50 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <svg width="500" height="500" viewBox="0 0 200 200">
            <path 
              fill="#2d882d" 
              d="M40,120 Q10,150 40,180 Q70,210 100,180 Q130,150 160,180 Q190,210 160,150 Q130,90 160,60 Q190,30 160,0 Q130,-30 100,0 Q70,30 40,0 Q10,-30 40,30 Q70,90 40,120 Z"
            />
          </svg>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
            >
              Ready to identify plant diseases?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl mb-10 text-gray-600 max-w-3xl mx-auto"
            >
              Join thousands of gardeners and farmers who trust PlantG to keep their plants healthy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                to="/login"
                className="btn bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 px-8 py-3 text-base"
              >
                Try It Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 