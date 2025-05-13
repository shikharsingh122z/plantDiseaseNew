import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaMicroscope, 
  FaBookOpen, 
  FaCloudUploadAlt, 
  FaDatabase, 
  FaMobileAlt, 
  FaChartLine,
  FaUsers,
  FaLaptopCode,
  FaGraduationCap,
  FaLeaf
} from 'react-icons/fa'

const Features = () => {
  // Features for the main app
  const mainFeatures = [
    {
      icon: <FaMicroscope size={24} color="#2d882d" />,
      title: "Advanced Disease Detection",
      description: "Our AI-powered system can identify over 50 plant diseases with over 98% accuracy."
    },
    {
      icon: <FaBookOpen size={24} color="#2d882d" />,
      title: "Detailed Information",
      description: "Get comprehensive information about the disease, including causes, symptoms, and progression."
    },
    {
      icon: <FaCloudUploadAlt size={24} color="#2d882d" />,
      title: "Simple Upload Process",
      description: "Easily upload photos directly from your phone or computer for instant analysis."
    },
    {
      icon: <FaDatabase size={24} color="#2d882d" />,
      title: "History Tracking",
      description: "Keep a record of all your plant analyses and track the health of your garden over time."
    },
    {
      icon: <FaMobileAlt size={24} color="#2d882d" />,
      title: "Mobile Friendly",
      description: "Use our platform on any device, whether you're in the field or at home."
    },
    {
      icon: <FaChartLine size={24} color="#2d882d" />,
      title: "Treatment Recommendations",
      description: "Receive personalized treatment plans based on the disease, plant type, and severity."
    }
  ]

  // Educational features for children
  const educationalFeatures = [
    {
      icon: <FaGraduationCap size={24} color="#2d882d" />,
      title: "Interactive Learning",
      description: "Engaging activities that teach children about plants, their importance, and how to care for them."
    },
    {
      icon: <FaUsers size={24} color="#2d882d" />,
      title: "Age-Appropriate Content",
      description: "Content tailored for different age groups, ensuring understanding and engagement at every level."
    },
    {
      icon: <FaLaptopCode size={24} color="#2d882d" />,
      title: "Digital Garden Simulator",
      description: "Virtual gardening environment where children can learn about plant growth and care without risk."
    },
    {
      icon: <FaLeaf size={24} color="#2d882d" />,
      title: "Plant Identification Quizzes",
      description: "Fun quizzes to help children identify common plants and recognize signs of health or disease."
    }
  ]

  return (
    <div className="pt-20 bg-white">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features
            </h1>
            <p className="text-xl md:text-2xl mb-0 font-light max-w-3xl mx-auto text-white/90">
              Everything you need to identify and treat plant diseases effectively
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Powerful Plant Disease Detection
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              PlantG combines cutting-edge AI technology with a user-friendly interface to provide the most accurate plant disease detection available.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-8"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Features Section with Children Avatars */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary-50 rounded-l-[100px] -z-10"></div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Educational Features for <span className="text-primary-600">Kids</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our dedicated educational platform helps children learn about plants, agriculture, and environmental science in a fun and interactive way.
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {educationalFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Link
                to="/contact"
                className="btn bg-primary-500 hover:bg-primary-600 text-white shadow-md px-8 py-3"
              >
                Learn More About Our Educational Program
              </Link>
            </motion.div>
            
            {/* Children Avatars Collage */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-white p-4 rounded-3xl shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square row-span-2 rounded-2xl overflow-hidden shadow-md"
                  >
                    <img 
                      src="/images/children/child1.jpg" 
                      alt="Child learning about plants"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://source.unsplash.com/random/600x600/?child,garden,learning&sig=1"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <span className="text-white text-lg font-medium">Hands-on Learning</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-square rounded-2xl overflow-hidden shadow-md"
                  >
                    <img 
                      src="/images/children/child2.jpg" 
                      alt="Child identifying plants"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://source.unsplash.com/random/300x300/?child,plant,education&sig=2"
                      }}
                    />
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-square rounded-2xl overflow-hidden shadow-md"
                  >
                    <img 
                      src="/images/children/child3.jpg" 
                      alt="Child using tablet"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://source.unsplash.com/random/300x300/?child,ipad,learning&sig=3"
                      }}
                    />
                  </motion.div>
                </div>
                
                <div className="mt-4 bg-primary-50 rounded-xl p-4 text-center">
                  <blockquote className="text-primary-700 italic text-lg">
                    "Teaching children about plant health today creates environmental stewards for tomorrow."
                  </blockquote>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-secondary-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-accent-500 rounded-full opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to experience PlantG?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl mb-10 max-w-3xl mx-auto text-white/90"
          >
            Join our growing community today and start protecting your plants.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3">
              Sign Up Now
            </Link>
            <Link to="/login" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3">
              Log In
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Features 