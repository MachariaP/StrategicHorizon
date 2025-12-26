import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define features outside component to prevent recreation on each render
const FEATURES = [
  {
    icon: '🎯',
    title: 'Vision & Theme',
    description: 'Define your yearly "North Star" statement and theme to guide your journey',
    gradient: 'from-blue-500 to-purple-600',
    bgGradient: 'from-blue-500/20 to-purple-600/20',
  },
  {
    icon: '🎪',
    title: 'Goals',
    description: 'Set specific, measurable milestones with comprehensive status tracking',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-500/20 to-pink-600/20',
  },
  {
    icon: '📈',
    title: 'KPIs',
    description: 'Track Key Performance Indicators linked directly to your goals',
    gradient: 'from-green-500 to-teal-600',
    bgGradient: 'from-green-500/20 to-teal-600/20',
  },
  {
    icon: '⚖️',
    title: 'Non-Negotiables',
    description: 'Establish daily and weekly boundaries that keep you on track',
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-500/20 to-red-600/20',
  },
  {
    icon: '⚙️',
    title: 'Systems',
    description: 'Build recurring processes and habits that drive consistent progress',
    gradient: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-500/20 to-blue-600/20',
  },
  {
    icon: '👥',
    title: 'People',
    description: 'Maintain a directory of mentors, partners, and supporters',
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-500/20 to-rose-600/20',
  },
  {
    icon: '🚀',
    title: 'Executions',
    description: 'Plan your monthly roadmap from January to December',
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-500/20 to-purple-600/20',
  },
  {
    icon: '🛡️',
    title: 'Obstacles',
    description: 'Identify risks and create mitigation strategies through pre-mortem analysis',
    gradient: 'from-yellow-500 to-orange-600',
    bgGradient: 'from-yellow-500/20 to-orange-600/20',
  },
  {
    icon: '🔄',
    title: 'Quarterly Reflections',
    description: 'Review and pivot with structured Q1-Q4 reflection modules',
    gradient: 'from-teal-500 to-green-600',
    bgGradient: 'from-teal-500/20 to-green-600/20',
  },
  {
    icon: '📊',
    title: 'Dashboard',
    description: 'Get a comprehensive overview of all your planning elements at a glance',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-500/20 to-purple-600/20',
  },
];

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % FEATURES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/10 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl animate-pulse">🌟</span>
              <span className="text-xl sm:text-2xl font-bold text-white">Strategic Horizon</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10 animate-slide-down">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="text-white hover:text-purple-200 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Enhanced Animation */}
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <div className="inline-block mb-4">
              <span className="text-6xl sm:text-8xl animate-float">🌟</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight px-4">
              Transform Your Vision Into
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient">
                Strategic Reality
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              A comprehensive strategic planning platform that helps you move from high-level vision 
              to monthly execution through a structured, proven framework.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
              >
                Start Planning for 2026 🚀
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Sign In to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Carousel Section */}
      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Modules
            </h2>
            <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto">
              Interactive showcase of powerful planning tools
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
                {FEATURES.map((feature, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide
                        ? 'opacity-100 translate-x-0 scale-100'
                        : index < currentSlide
                        ? 'opacity-0 -translate-x-full scale-95'
                        : 'opacity-0 translate-x-full scale-95'
                    }`}
                  >
                    <div className={`h-full bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12 flex flex-col justify-center items-center text-center`}>
                      <div className={`text-6xl sm:text-8xl md:text-9xl mb-6 sm:mb-8 animate-bounce-slow bg-gradient-to-br ${feature.gradient} rounded-3xl p-6 sm:p-8 shadow-2xl`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                        {feature.title}
                      </h3>
                      <p className="text-lg sm:text-xl md:text-2xl text-purple-100 max-w-2xl leading-relaxed">
                        {feature.description}
                      </p>
                      <div className={`mt-6 sm:mt-8 inline-block bg-gradient-to-r ${feature.gradient} text-white px-6 py-3 rounded-full font-semibold shadow-lg opacity-75 cursor-default`}>
                        Feature Showcase
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 sm:p-4 rounded-full transition-all hover:scale-110 border border-white/20 shadow-lg"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 sm:p-4 rounded-full transition-all hover:scale-110 border border-white/20 shadow-lg"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 sm:mt-8 gap-2 flex-wrap px-4">
              {FEATURES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 sm:w-12 bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'w-2 sm:w-3 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Plan 2026
            </h2>
            <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto">
              10 powerful modules designed to transform your vision into actionable monthly executions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.bgGradient} backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:scale-105 hover:shadow-2xl group feature-card`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`text-4xl sm:text-5xl mb-4 bg-gradient-to-br ${feature.gradient} rounded-xl p-4 inline-block group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-purple-200 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section with Enhanced Visuals */}
      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why Strategic Horizon?
              </h2>
              <div className="space-y-6">
                {[
                  { icon: '✓', title: 'Structured Framework', desc: 'Follow a proven methodology that takes you from vision to execution' },
                  { icon: '✓', title: 'Track Progress', desc: 'Monitor your KPIs, goals, and executions with beautiful visualizations' },
                  { icon: '✓', title: 'Quarterly Reflections', desc: 'Review, learn, and pivot every quarter to stay aligned with your vision' },
                  { icon: '✓', title: 'Risk Management', desc: 'Identify obstacles early and plan mitigation strategies proactively' }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform shadow-lg">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-purple-200 text-sm sm:text-base">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all hover:scale-105 shadow-2xl">
                <div className="bg-white/10 rounded-2xl p-6 sm:p-8 mb-6 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white text-base sm:text-lg font-semibold">Vision 2026</span>
                    <span className="text-2xl sm:text-3xl">🎯</span>
                  </div>
                  <p className="text-purple-200 italic text-base sm:text-lg">
                    "Transform ideas into impactful reality through strategic execution"
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Launch Product', progress: 100, color: 'from-green-500 to-emerald-500', status: '✓' },
                    { label: 'Grow User Base', progress: 75, color: 'from-yellow-500 to-orange-500', status: '75%' },
                    { label: 'Build Team', progress: 45, color: 'from-blue-500 to-purple-500', status: '45%' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium text-sm sm:text-base">{item.label}</span>
                        <span className={`${item.progress === 100 ? 'text-green-400' : item.progress >= 70 ? 'text-yellow-400' : 'text-blue-400'} font-semibold`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-1000 ease-out animate-progress`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Enhanced Design */}
      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse-slow mb-6">
            <span className="text-5xl sm:text-6xl">🚀</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Plan Your Best Year Yet?
          </h2>
          <p className="text-lg sm:text-xl text-purple-200 mb-8 sm:mb-10">
            Join thousands of strategic thinkers who are turning their vision into reality
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
          >
            Start Your Strategic Journey 🌟
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌟</span>
              <span className="text-lg font-semibold text-white">Strategic Horizon</span>
            </div>
            <p className="text-purple-200 text-sm text-center sm:text-left">
              © 2026 Strategic Horizon. Transform your vision into strategic reality.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
