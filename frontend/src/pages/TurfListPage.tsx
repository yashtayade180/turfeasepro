import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Grid } from '../components/ui';
import { 
  MapPinIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface Turf {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  sport: string;
  available: boolean;
  description: string;
  amenities: string[];
}

const TurfListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - in real app this would come from API
  const mockTurfs: Turf[] = [
    {
      id: '1',
      name: 'Green Valley Football Turf',
      location: 'Downtown, City Center',
      price: 80,
      rating: 4.8,
      image: '/api/placeholder/400/300',
      sport: 'Football',
      available: true,
      description: 'Premium football turf with professional lighting',
      amenities: ['Floodlights', 'Changing Rooms', 'Parking', 'Refreshments']
    },
    {
      id: '2',
      name: 'Elite Cricket Ground',
      location: 'Suburbs, West Side',
      price: 120,
      rating: 4.6,
      image: '/api/placeholder/400/300',
      sport: 'Cricket',
      available: true,
      description: 'International standard cricket pitch',
      amenities: ['Pavilion', 'Practice Nets', 'Scoreboard', 'Commentary Box']
    },
    {
      id: '3',
      name: 'Sunset Basketball Court',
      location: 'Riverside, North End',
      price: 60,
      rating: 4.5,
      image: '/api/placeholder/400/300',
      sport: 'Basketball',
      available: false,
      description: 'Outdoor basketball court with evening lighting',
      amenities: ['LED Lighting', 'Seating', 'Water Fountain']
    },
    {
      id: '4',
      name: 'Tennis Pro Academy',
      location: 'Uptown, East Side',
      price: 100,
      rating: 4.9,
      image: '/api/placeholder/400/300',
      sport: 'Tennis',
      available: true,
      description: 'Professional tennis courts with coaching available',
      amenities: ['Clay Courts', 'Coaching', 'Equipment Rental', 'Pro Shop']
    },
    {
      id: '5',
      name: 'Multi-Sport Complex',
      location: 'Central District',
      price: 90,
      rating: 4.7,
      image: '/api/placeholder/400/300',
      sport: 'Multi-Sport',
      available: true,
      description: 'Versatile venue for multiple sports',
      amenities: ['Multiple Courts', 'Gym', 'Cafe', 'Lockers']
    },
    {
      id: '6',
      name: 'Badminton Hall',
      location: 'Shopping District',
      price: 50,
      rating: 4.4,
      image: '/api/placeholder/400/300',
      sport: 'Badminton',
      available: true,
      description: 'Air-conditioned badminton courts',
      amenities: ['AC', 'Wooden Courts', 'Shuttle Rental', 'Coaching']
    }
  ];

  const sports = ['all', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Multi-Sport'];

  const filteredAndSortedTurfs = useMemo(() => {
    let filtered = mockTurfs.filter(turf => {
      const matchesSearch = turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           turf.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSport = selectedSport === 'all' || turf.sport === selectedSport;
      const matchesPrice = turf.price >= priceRange.min && turf.price <= priceRange.max;
      
      return matchesSearch && matchesSport && matchesPrice;
    });

    // Sort turfs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedSport, priceRange, sortBy]);

  const TurfCard: React.FC<{ turf: Turf }> = ({ turf }) => (
    <Card variant="default" padding="none" interactive className="overflow-hidden group">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <p className="text-primary-600 font-medium">Turf Image</p>
          </div>
        </div>
        {!turf.available && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-medium rounded-full">
              Unavailable
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-xs font-medium rounded-full">
            {turf.sport}
          </span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
              {turf.name}
            </h3>
            <div className="flex items-center text-neutral-600 text-sm">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {turf.location}
            </div>
          </div>
          <div className="flex items-center bg-accent-50 px-2 py-1 rounded-lg">
            <StarIcon className="w-4 h-4 text-accent-500 mr-1" />
            <span className="text-sm font-medium text-accent-700">{turf.rating}</span>
          </div>
        </div>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {turf.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {turf.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md"
            >
              {amenity}
            </span>
          ))}
          {turf.amenities.length > 3 && (
            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md">
              +{turf.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 text-neutral-400 mr-1" />
            <span className="text-lg font-semibold text-neutral-900">
              ${turf.price}
            </span>
            <span className="text-sm text-neutral-600 ml-1">/hour</span>
          </div>
          <Button
            size="sm"
            as={Link}
            to={`/turfs/${turf.id}`}
            disabled={!turf.available}
          >
            {turf.available ? 'View Details' : 'Unavailable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <Container size="xl" className="py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
                Find Your Perfect Turf
              </h1>
              <p className="text-neutral-600 mt-1">
                Discover and book the best sports facilities in your area
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container size="xl" className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0`}>
            <Card padding="lg" className="lg:sticky lg:top-24">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Search
                  </label>
                  <Input
                    placeholder="Search turfs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                  />
                </div>

                {/* Sport Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sport Type
                  </label>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {sports.map(sport => (
                      <option key={sport} value={sport}>
                        {sport === 'all' ? 'All Sports' : sport}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price Range ($/hour)
                  </label>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min || ''}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max || ''}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000 }))}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSport('all');
                    setPriceRange({ min: 0, max: 1000 });
                    setSortBy('rating');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-600">
                Showing <span className="font-medium text-neutral-900">{filteredAndSortedTurfs.length}</span> turfs
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">View:</span>
                <Button variant="ghost" size="sm" className="px-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" className="px-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Turf Grid */}
            {filteredAndSortedTurfs.length > 0 ? (
              <Grid cols={1} sm={2} xl={3} gap="lg">
                {filteredAndSortedTurfs.map(turf => (
                  <TurfCard key={turf.id} turf={turf} />
                ))}
              </Grid>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FunnelIcon className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  No turfs found
                </h3>
                <p className="text-neutral-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedSport('all');
                  setPriceRange({ min: 0, max: 1000 });
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TurfListPage;