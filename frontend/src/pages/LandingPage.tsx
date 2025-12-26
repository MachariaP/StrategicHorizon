import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Vision & Theme',
      description: 'Define your yearly "North Star" statement and theme to guide your journey',
    },
    {
      icon: '🎪',
      title: 'Goals',
      description: 'Set specific, measurable milestones with comprehensive status tracking',
    },
    {
      icon: '📈',
      title: 'KPIs',
      description: 'Track Key Performance Indicators linked directly to your goals',
    },
    {
      icon: '⚖️',
      title: 'Non-Negotiables',
      description: 'Establish daily and weekly boundaries that keep you on track',
    },
    {
      icon: '⚙️',
      title: 'Systems',
      description: 'Build recurring processes and habits that drive consistent progress',
    },
    {
      icon: '👥',
      title: 'People',
      description: 'Maintain a directory of mentors, partners, and supporters',
    },
    {
      icon: '🚀',
      title: 'Executions',
      description: 'Plan your monthly roadmap from January to December',
    },
    {
      icon: '🛡️',
      title: 'Obstacles',
      description: 'Identify risks and create mitigation strategies through pre-mortem analysis',
    },
    {
      icon: '🔄',
      title: 'Quarterly Reflections',
      description: 'Review and pivot with structured Q1-Q4 reflection modules',
    },
    {
      icon: '📊',
      title: 'Dashboard',
      description: 'Get a comprehensive overview of all your planning elements at a glance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🌟</span>
              <span className="text-2xl font-bold text-white">Strategic Horizon</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-purple-200 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-medium shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Transform Your Vision Into
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Strategic Reality
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              A comprehensive strategic planning platform that helps you move from high-level vision 
              to monthly execution through a structured, proven framework.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Start Planning for 2026 🚀
              </Link>
              <Link
                to="/login"
                className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Sign In to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything You Need to Plan 2026
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              10 powerful modules designed to transform your vision into actionable monthly executions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-purple-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Strategic Horizon?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Structured Framework</h3>
                    <p className="text-purple-200">
                      Follow a proven methodology that takes you from vision to execution
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
                    <p className="text-purple-200">
                      Monitor your KPIs, goals, and executions with beautiful visualizations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Quarterly Reflections</h3>
                    <p className="text-purple-200">
                      Review, learn, and pivot every quarter to stay aligned with your vision
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Risk Management</h3>
                    <p className="text-purple-200">
                      Identify obstacles early and plan mitigation strategies proactively
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="bg-white/10 rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white text-lg font-semibold">Vision 2026</span>
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-purple-200 italic text-lg">
                  "Transform ideas into impactful reality through strategic execution"
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Launch Product</span>
                    <span className="text-green-400">✓</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Grow User Base</span>
                    <span className="text-yellow-400">75%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Build Team</span>
                    <span className="text-blue-400">45%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Plan Your Best Year Yet?
          </h2>
          <p className="text-xl text-purple-200 mb-10">
            Join thousands of strategic thinkers who are turning their vision into reality
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl"
          >
            Start Your Strategic Journey 🌟
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-200">
            © 2026 Strategic Horizon. Transform your vision into strategic reality.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
