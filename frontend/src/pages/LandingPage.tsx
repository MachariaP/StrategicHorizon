// src/pages/LandingPage.tsx - Fixed version
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animatedTitle, setAnimatedTitle] = useState('');

  const features = [
    {
      icon: '🎯',
      title: 'Vision & Theme',
      description: 'Define your yearly "North Star" statement and theme to guide your journey',
      color: 'from-purple-500 to-pink-500',
      delay: 0
    },
    {
      icon: '🎪',
      title: 'Goals',
      description: 'Set specific, measurable milestones with comprehensive status tracking',
      color: 'from-blue-500 to-cyan-500',
      delay: 100
    },
    {
      icon: '📈',
      title: 'KPIs',
      description: 'Track Key Performance Indicators linked directly to your goals',
      color: 'from-green-500 to-emerald-500',
      delay: 200
    },
    {
      icon: '⚖️',
      title: 'Non-Negotiables',
      description: 'Establish daily and weekly boundaries that keep you on track',
      color: 'from-yellow-500 to-orange-500',
      delay: 300
    },
    {
      icon: '⚙️',
      title: 'Systems',
      description: 'Build recurring processes and habits that drive consistent progress',
      color: 'from-red-500 to-pink-500',
      delay: 400
    },
    {
      icon: '👥',
      title: 'People',
      description: 'Maintain a directory of mentors, partners, and supporters',
      color: 'from-indigo-500 to-purple-500',
      delay: 500
    },
    {
      icon: '🚀',
      title: 'Executions',
      description: 'Plan your monthly roadmap from January to December',
      color: 'from-pink-500 to-rose-500',
      delay: 600
    },
    {
      icon: '🛡️',
      title: 'Obstacles',
      description: 'Identify risks and create mitigation strategies through pre-mortem analysis',
      color: 'from-gray-500 to-blue-500',
      delay: 700
    },
    {
      icon: '🔄',
      title: 'Quarterly Reflections',
      description: 'Review and pivot with structured Q1-Q4 reflection modules',
      color: 'from-teal-500 to-cyan-500',
      delay: 800
    },
    {
      icon: '📊',
      title: 'Dashboard',
      description: 'Get a comprehensive overview of all your planning elements at a glance',
      color: 'from-violet-500 to-purple-500',
      delay: 900
    },
  ];

  const animatedText = "Strategic Reality";

  useEffect(() => {
    // Mouse move effect for interactive background
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animated title effect
    let i = 0;
    const typeWriter = () => {
      if (i < animatedText.length) {
        setAnimatedTitle(animatedText.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    const timeout = setTimeout(() => {
      typeWriter();
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, section: string) => {
    e.preventDefault();
    console.log(`Navigating to ${section} section`);
    // Add smooth scroll logic here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/80 to-gray-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`,
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 animate-pulse" />
                <span className="text-3xl relative z-10">🌟</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Strategic Horizon
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium group"
              >
                <span className="group-hover:translate-x-1 transition-transform inline-block">Sign In</span>
              </Link>
              <Link
                to="/register"
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-x" />
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-purple-700 group-hover:to-pink-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform group-hover:scale-105 font-medium shadow-2xl">
                  <span className="flex items-center space-x-2">
                    <span>Get Started</span>
                    <span className="group-hover:translate-x-1 transition-transform">🚀</span>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            <div className="mb-8">
              <span className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-purple-500/30">
                🎯 Plan Your Best Year Yet • 2026 Edition
              </span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
              <span className="block">Transform Your</span>
              <span className="block">Vision Into</span>
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-xl opacity-50 animate-pulse" />
                <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient-text">
                  {animatedTitle}
                  <span className="animate-pulse">|</span>
                </span>
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-purple-200/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              The ultimate strategic planning platform that bridges the gap between visionary thinking 
              and <span className="text-white font-semibold">tangible monthly execution</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/register"
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-x rounded-full" />
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform group-hover:scale-105 shadow-2xl">
                  <span className="flex items-center space-x-3">
                    <span>Start Planning 2026</span>
                    <span className="group-hover:rotate-12 transition-transform">✨</span>
                  </span>
                </div>
              </Link>
              
              <button
                onClick={() => window.open('https://example.com/demo', '_blank')}
                className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-5 rounded-full text-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                <span className="flex items-center space-x-3">
                  <span>Watch Demo</span>
                  <span className="group-hover:translate-x-2 transition-transform">▶️</span>
                </span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { label: 'Active Planners', value: '10K+' },
                { label: 'Goals Achieved', value: '50K+' },
                { label: 'Success Rate', value: '94%' },
                { label: 'Satisfaction', value: '4.9★' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-purple-200/80 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 relative">
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Your Complete
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Strategic Toolkit
              </span>
            </h2>
            <p className="text-xl text-purple-200/90 max-w-2xl mx-auto font-light">
              10 interconnected modules designed to transform your vision into actionable monthly executions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full">
                  <div className="relative">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500`} />
                    <div className="relative text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-purple-200/80 leading-relaxed font-light">
                    {feature.description}
                  </p>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-sm text-purple-300">
                      <span className="mr-2">→</span>
                      <span>Explore module</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Dashboard Preview */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-white mb-8">
                Visualize Your Progress in
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                  Real-Time
                </span>
              </h2>
              
              <div className="space-y-8">
                {[
                  {
                    title: 'Smart Goal Tracking',
                    description: 'AI-powered insights and predictive analytics for your goals',
                    icon: '📊',
                    progress: 85
                  },
                  {
                    title: 'KPI Dashboards',
                    description: 'Real-time metrics with beautiful visualizations',
                    icon: '📈',
                    progress: 92
                  },
                  {
                    title: 'Team Collaboration',
                    description: 'Share progress and align with your team',
                    icon: '👥',
                    progress: 78
                  },
                  {
                    title: 'Quarterly Reviews',
                    description: 'Automated insights and reflection prompts',
                    icon: '🔄',
                    progress: 95
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl transform group-hover:rotate-12 transition-transform">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                          <p className="text-purple-200/80 text-sm mt-1">{item.description}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Animated Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-2xl font-bold text-white">2026 Dashboard</div>
                    <div className="text-purple-300">Strategic Horizon</div>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
                
                {/* Animated Chart */}
                <div className="mb-8">
                  <div className="flex items-end justify-between h-40 space-x-2">
                    {[30, 45, 65, 80, 75, 90, 85, 95, 85, 90, 95, 100].map((height, idx) => (
                      <div
                        key={idx}
                        className="relative flex-1 group"
                      >
                        <div
                          className={`w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-500 ease-out hover:opacity-80`}
                          style={{ height: `${height}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-purple-300">Goals Completed</div>
                    <div className="text-2xl font-bold text-white">42/50</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-purple-300">Current Streak</div>
                    <div className="text-2xl font-bold text-white">68 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Trusted by Visionaries
            </h2>
            <p className="text-xl text-purple-200/90 max-w-2xl mx-auto font-light">
              Join thousands of strategic thinkers transforming their ambitions into achievements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Strategic Horizon transformed how we plan our year. The quarterly reflection module alone has increased our team's productivity by 40%.",
                author: "Sarah Chen",
                role: "CEO, TechVision Inc",
                avatar: "👩‍💼"
              },
              {
                quote: "From vision to execution, this platform provides the perfect framework. Our goal completion rate went from 60% to 94% in one year.",
                author: "Marcus Rivera",
                role: "Product Director",
                avatar: "👨‍💻"
              },
              {
                quote: "The obstacle pre-mortem feature helped us avoid major pitfalls. It's like having a strategic co-pilot for your entire year.",
                author: "Elena Rodriguez",
                role: "Startup Founder",
                avatar: "👩‍🚀"
              }
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-purple-500/50 transition-all duration-500 h-full">
                  <div className="text-4xl mb-4">❝</div>
                  <p className="text-lg text-white/90 mb-8 italic leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold text-white">{testimonial.author}</div>
                      <div className="text-purple-300 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 rounded-full blur-3xl" />
            <h2 className="relative text-6xl font-bold text-white mb-6">
              Your Best Year
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-text">
                Starts Now
              </span>
            </h2>
          </div>
          
          <p className="text-2xl text-purple-200/90 mb-12 max-w-2xl mx-auto font-light">
            Don't just plan your year—master it. Join Strategic Horizon today and transform your vision into reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/register"
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-x rounded-full" />
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-16 py-6 rounded-full text-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform group-hover:scale-110 shadow-2xl">
                <span className="flex items-center space-x-4">
                  <span>Start Free Trial</span>
                  <span className="group-hover:translate-x-3 transition-transform duration-300">🚀</span>
                </span>
              </div>
            </Link>
            
            <div className="text-white/80">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <span className="text-3xl">🌟</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Strategic Horizon
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={(e) => handleNavigation(e, 'privacy')}
                className="text-purple-300 hover:text-white transition-colors"
              >
                Privacy
              </button>
              <button 
                onClick={(e) => handleNavigation(e, 'terms')}
                className="text-purple-300 hover:text-white transition-colors"
              >
                Terms
              </button>
              <button 
                onClick={(e) => handleNavigation(e, 'contact')}
                className="text-purple-300 hover:text-white transition-colors"
              >
                Contact
              </button>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-white transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-purple-300/80">
              © 2026 Strategic Horizon. Transform your vision into strategic reality. 
              <span className="block text-sm text-purple-400/60 mt-2">
                Made with ❤️ for visionaries and executors
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Add CSS animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 2s linear infinite;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;