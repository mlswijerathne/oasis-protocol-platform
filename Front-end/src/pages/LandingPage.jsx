import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, Trophy, Code, Lock, Zap } from 'lucide-react';
import MatrixBackground from '../components/MatrixBackground';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixBackground />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              OASIS PROTOCOL
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/team/login" className="hover:text-cyan-400 transition-colors">Team Portal</Link>
            <Link to="/admin/login" className="hover:text-cyan-400 transition-colors">Admin</Link>
            <Link to="/leaderboard" className="hover:text-cyan-400 transition-colors">Leaderboard</Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
              THE OASIS
            </span>
            <br />
            <span className="text-white">HAS GONE</span>
            <br />
            <span className="bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
              DARK
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed"
          >
            In 2045, the OASIS has been encrypted. Only the most skilled hackers can decode the layers of security 
            and unlock the final Builder Challenge to restore the virtual world to its former glory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-4"
          >
            <div className="text-lg mb-8">
              <span className="text-yellow-400 font-semibold">Your team is the last hope.</span>
              <br />
              <span className="text-cyan-400">Crack the layers of security, rebuild the platform, and restore the OASIS.</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/team/register" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                Start Your Mission
              </Link>
              <Link 
                to="/team/login" 
                className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-400 hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                Access Portal
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent"
          >
            Master the Challenge
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "Algorithmic Challenges",
                description: "Solve complex coding problems to unlock flags and progress through layers of security.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Lock,
                title: "Security Protocols",
                description: "Navigate through encrypted barriers using your coding skills and logical thinking.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Zap,
                title: "Buildathon Phase",
                description: "Build real solutions and submit your code to unlock the final challenge.",
                color: "from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "∞", label: "Possibilities" },
              { number: "2045", label: "Year of Crisis" },
              { number: "1", label: "Master Key" },
              { number: "?", label: "Time Left" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Ready to </span>
            <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              Crack the Code
            </span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the elite hackers attempting to restore the OASIS and save the virtual world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/team/register" 
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
            >
              Join the Resistance
            </Link>
            <Link 
              to="/admin/login" 
              className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-600 hover:text-white transition-all duration-300"
            >
              Admin Access
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>&copy; 2045 OASIS Protocol. The future depends on your code.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
