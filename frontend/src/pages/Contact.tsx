import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserCircle, FaGithub, FaLinkedin } from 'react-icons/fa'

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log(formState)
    alert('Thank you for your message. We will get back to you shortly!')
    setFormState({ name: '', email: '', subject: '', message: '' })
  }

  // Team members contact information
  const teamContacts = [
    {
      name: "Shikhar",
      role: "Lead Developer",
      email: "shikhar@plantg.com",
      image: "/images/team/shikhar.jpg",
      github: "https://github.com/shikhar",
      linkedin: "https://linkedin.com/in/shikhar"
    },
    {
      name: "Shiva",
      role: "Backend Core Developer",
      email: "shiva@plantg.com",
      image: "/images/team/shiva.jpg",
      github: "https://github.com/shiva",
      linkedin: "https://linkedin.com/in/shiva"
    },
    {
      name: "Yash",
      role: "Python Developer",
      email: "yash@plantg.com",
      image: "/images/team/yash.jpg",
      github: "https://github.com/yash",
      linkedin: "https://linkedin.com/in/yash"
    },
    {
      name: "Sahil",
      role: "UI Developer",
      email: "sahil@plantg.com",
      image: "/images/team/sahil.jpg",
      github: "https://github.com/sahil",
      linkedin: "https://linkedin.com/in/sahil"
    }
  ]

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl mb-0 font-light max-w-3xl mx-auto text-white/90">
              Have questions about PlantG? We're here to help!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Contact Information</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FaEnvelope size={20} color="#2d882d" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@plantg.com</p>
                    <p className="text-gray-600">info@plantg.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FaPhone size={20} color="#2d882d" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt size={20} color="#2d882d" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">123 Green Street</p>
                    <p className="text-gray-600">Tech Park, Innovation District</p>
                    <p className="text-gray-600">New Delhi, India 110001</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">Meet Our Team</h3>
                <div className="grid grid-cols-2 gap-4">
                  {teamContacts.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name}&background=2d882d&color=fff&size=256`
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-xs text-primary-600">{member.role}</p>
                        <div className="flex space-x-2 mt-1">
                          <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-primary-600">
                            <FaEnvelope size={14} />
                          </a>
                          <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                            <FaGithub size={14} />
                          </a>
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                            <FaLinkedin size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserCircle size={18} color="#64748b" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope size={18} color="#64748b" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="select"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Partnerships">Partnerships</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    className="input"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full btn bg-primary-500 hover:bg-primary-600 text-white shadow-md py-3"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-96 bg-gray-200">
                {/* Replace with actual map component or embed Google Maps */}
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">Interactive Map Goes Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact 