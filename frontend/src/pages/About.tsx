import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'

const About = () => {
  const teamMembers = [
    {
      name: "Shikhar",
      role: "Lead Developer",
      bio: "Leading the development of PlantG with expertise in full-stack development and AI integration.",
      image: "/images/team/shikhar.jpg", // Will use a placeholder if image doesn't exist
      social: {
        linkedin: "https://www.linkedin.com/in/shikhar-pratap-singh-09a9b322a/",
        github: "https://github.com/cratesium",
        email: "shikhar@plantg.com"
      }
    },
    {
      name: "Shiva",
      role: "Backend Core Developer",
      bio: "Building robust backend systems and APIs to support PlantG's plant disease detection capabilities.",
      image: "/images/team/shiva.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/shiva-sharma-30b254273/",
        github: "https://github.com/shiva",
        email: "shiva@plantg.com"
      }
    },
    {
      name: "Yash",
      role: "Python Developer",
      bio: "Leading the development of machine learning models for accurate plant disease identification.",
      image: "/images/team/yash.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/sh3yash/",
        github: "https://github.com/sh3yash",
        email: "yash@plantg.com"
      }
    },
    {
      name: "Sahil",
      role: "UI Developer",
      bio: "Creating beautiful and intuitive user interfaces to make plant disease detection accessible to everyone.",
      image: "/images/team/sahil.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/sahil-chaudhary-2b4a9922a/",
        github: "https://github.com/sahil",
        email: "sahil@plantg.com"
      }
    }
  ];

  return (
    <div className="pt-20 bg-white">
      {/* Header Section */}
      <section className="py-16 bg-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-leaf-scattered"></div>
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Our <span className="text-primary-600">Mission</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-700 font-light max-w-3xl mx-auto">
              At PlantG, we're committed to helping farmers, gardeners, and plant enthusiasts identify and treat plant diseases quickly and effectively.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              The talented individuals behind PlantG's plant disease detection technology.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card overflow-visible flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 -mt-10 mb-4 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name}&background=2d882d&color=fff&size=256`
                    }}
                  />
                </div>
                <div className="p-6 pt-0">
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-4 mt-auto pt-4 border-t border-gray-100">
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                      <FaLinkedin size={20} />
                    </a>
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                      <FaGithub size={20} />
                    </a>
                    <a href={`mailto:${member.social.email}`} className="text-gray-500 hover:text-red-500">
                      <FaEnvelope size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Vision Section with Children Avatars */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Growing a Healthier <span className="text-primary-600">Future</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                PlantG is more than just a tool—it's a movement to create a sustainable future where plants thrive and people prosper. Our vision extends to educating the next generation about plant health and sustainable agriculture.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                By introducing children to the wonders of plants and technology, we're nurturing tomorrow's agricultural innovators and environmental stewards.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Education", "Sustainability", "Innovation", "Accessibility"].map((value, i) => (
                  <span key={i} className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                    {value}
                  </span>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={`/images/children/child${num}.jpg`}
                    alt={`Child learning about plants ${num}`}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://source.unsplash.com/random/300x300/?child,plant,education&sig=${num}`
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Join Us Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Join Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl mb-10 max-w-3xl mx-auto text-white/90"
          >
            Together, we can build a world where plant diseases are easily identifiable and treatable.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3">
              Get Started
            </a>
            <a href="/contact" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3">
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About 