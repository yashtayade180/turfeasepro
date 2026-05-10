import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui';
import { 
  MapPinIcon, 
  CalendarIcon, 
  CreditCardIcon,
  UserGroupIcon,
  StarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: MapPinIcon,
      title: 'Location-Based Search',
      description: 'Find turfs near you with our advanced geolocation search and filtering options',
      color: 'primary'
    },
    {
      icon: CalendarIcon,
      title: 'Easy Booking',
      description: 'Book turfs instantly with our simple and secure booking system',
      color: 'secondary'
    },
    {
      icon: CreditCardIcon,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options',
      color: 'accent'
    },
    {
      icon: UserGroupIcon,
      title: 'Team Management',
      description: 'Create and manage teams, invite players, and organize matches',
      color: 'primary'
    },
    {
      icon: StarIcon,
      title: 'Reviews & Ratings',
      description: 'Read authentic reviews and rate your experience at different turfs',
      color: 'secondary'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verified Partners',
      description: 'All turf partners are verified to ensure quality and safety standards',
      color: 'accent'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Sign Up',
      description: 'Create your account as user or partner in seconds',
      icon: UserGroupIcon
    },
    {
      step: '02',
      title: 'Find Turf',
      description: 'Search for available turfs in your area with filters',
      icon: MapPinIcon
    },
    {
      step: '03',
      title: 'Book Slot',
      description: 'Select your preferred time slot and book instantly',
      icon: CalendarIcon
    },
    {
      step: '04',
      title: 'Play & Enjoy',
      description: 'Show up and enjoy your game with friends!',
      icon: StarIcon
    }
  ];

  const stats = [
    { number: '500+', label: 'Turfs Listed' },
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Bookings Made' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-primary-900/20"></div>
        </div>
        <Container size="xl" className="relative z-10">
          <div className="py-20 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
                Find and Book the
                <span className="block text-accent-400">Perfect Turf</span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl mb-8 max-w-3xl mx-auto text-primary-100 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Connect with turf owners and book your favorite sports facilities instantly
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Button
                  size="lg"
                  as={Link}
                  to="/turfs"
                  className="bg-white text-primary-600 hover:bg-neutral-50 shadow-strong"
                >
                  Find Turfs
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  as={Link}
                  to="/register"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </Container>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-white" viewBox="0 0 1440 64" fill="none">
            <path d="M0 32L60 26.7C120 21 240 11 360 16C480 21 600 43 720 48C840 53 960 43 1080 37.3C1200 32 1320 32 1380 32L1440 32V64H1380C1320 64 1200 64 1080 64C960 64 840 64 720 64C600 64 480 64 360 64C240 64 120 64 60 64H0V32Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <Container size="lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-neutral-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <Container size="lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose TurfEasePro?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Everything you need to find, book, and manage your turf experience in one platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="default"
                padding="lg"
                interactive
                className="group hover:shadow-medium transition-all duration-300"
              >
                <CardContent className="text-center">
                  <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <Container size="lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Get started in 4 simple steps and enjoy your game
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary-200 transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <Container size="lg" className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users and partners on TurfEasePro and experience the future of turf booking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              as={Link}
              to="/register"
              className="bg-white text-primary-600 hover:bg-neutral-50 shadow-strong"
            >
              Register Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              as={Link}
              to="/turfs"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              Browse Turfs
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;