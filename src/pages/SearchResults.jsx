import { useState, useEffect } from 'react';
import { Box, Container, SimpleGrid, Text, Badge, VStack, Heading, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, HStack, Tooltip, Collapse, Icon, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { FaSnowflake, FaPlug, FaWifi, FaWater, FaPhone, FaFirstAid, FaMapMarkerAlt, FaCity, FaCalendarAlt, FaBus } from 'react-icons/fa';
import SeatSelection from '../components/SeatSelection';
import { useLocation, useNavigate } from 'react-router-dom';
import AvailableBuses from '../components/AvailableBuses';
import API_BASE_URL from '../api';
import axios from 'axios';

const SearchResults = () => {
  const location = useLocation();
  const searchData = location.state || {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBus, setSelectedBus] = useState(null);
  const [expandedBus, setExpandedBus] = useState(null);
  const navigate = useNavigate();

  // Check for authentication
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      // Store the current search parameters in localStorage
      if (searchData.from || searchData.to || searchData.date) {
        localStorage.setItem('pendingSearch', JSON.stringify(searchData));
      }
      navigate('/client/login');
    } else if (localStorage.getItem('pendingSearch')) {
      // If there was a pending search, restore it
      const pendingSearch = JSON.parse(localStorage.getItem('pendingSearch'));
      localStorage.removeItem('pendingSearch');
      navigate('/search', { state: pendingSearch });
    }
  }, [navigate]);

  const [searchDataForm, setSearchDataForm] = useState({
    from: searchData.from || '',
    to: searchData.to || '',
    date: searchData.date || ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState('');
  const [bookedSeatsCounts, setBookedSeatsCounts] = useState({});

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // List of Tamil Nadu districts
  const tamilNaduDistricts = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ];

  const fetchBookedSeatsCounts = async (busesList, date) => {
    const counts = {};
    await Promise.all(
      busesList.map(async (bus) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/bookings/bus/${bus._id}/booked-seats`, {
            params: { date }
          });
          counts[bus._id] = response.data.bookedSeats.length;
        } catch {
          counts[bus._id] = 0;
        }
      })
    );
    setBookedSeatsCounts(counts);
  };

  const fetchBuses = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/buses`, {
        params: {
          source: params.from,
          destination: params.to,
          date: params.date
        }
      });
      setBuses(response.data);
      setHasSearched(true);
      // Fetch booked seat counts for each bus for the selected date
      if (params.date) {
        fetchBookedSeatsCounts(response.data, params.date);
      } else {
        setBookedSeatsCounts({});
      }
    } catch (error) {
      setError('Failed to fetch buses. Please try again.');
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchData.from && searchData.to) {
      fetchBuses(searchData);
    }
  }, []);

  // Format the journey date
  const formattedDate = searchData.date ? new Date(searchData.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    
    // Validate if the selected date is not before today
    if (selectedDate < today) {
      setDateError('Cannot select a date before today');
      setSearchDataForm({ ...searchDataForm, date: '' });
    } else {
      setDateError('');
      setSearchDataForm({ ...searchDataForm, date: selectedDate });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchDataForm.from || !searchDataForm.to || !searchDataForm.date) {
      return;
    }
    fetchBuses(searchDataForm);
  };

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    onOpen();
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Main Heading */}
        <Box textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            fontWeight="700"
            mb={4}
            color="red.600"
          >
            Search Your Bus
          </Heading>
          <Text
            fontSize="lg"
            color="gray.600"
            mb={6}
          >
            Find the perfect bus for your journey with DK Bus Travels
          </Text>
        </Box>

        {/* Search Form */}
        <Box
          bg="white"
          p={{ base: 6, md: 8 }}
          borderRadius="lg"
          boxShadow="lg"
        >
          <form onSubmit={handleSearch}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>
                  <HStack spacing={2}>
                    <Icon as={FaMapMarkerAlt} color="red.500" />
                    <Text>From</Text>
                  </HStack>
                </FormLabel>
                <Select
                  placeholder="Select source city"
                  value={searchDataForm.from}
                  onChange={(e) => setSearchDataForm({ ...searchDataForm, from: e.target.value })}
                  size="lg"
                  icon={<Icon as={FaBus} />}
                >
                  {tamilNaduDistricts.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>
                  <HStack spacing={2}>
                    <Icon as={FaMapMarkerAlt} color="red.500" />
                    <Text>To</Text>
                  </HStack>
                </FormLabel>
                <Select
                  placeholder="Select destination city"
                  value={searchDataForm.to}
                  onChange={(e) => setSearchDataForm({ ...searchDataForm, to: e.target.value })}
                  size="lg"
                  icon={<Icon as={FaBus} />}
                >
                  {tamilNaduDistricts.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={!!dateError}>
                <FormLabel>
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} color="red.500" />
                    <Text>Date</Text>
                  </HStack>
                </FormLabel>
                <Input
                  type="date"
                  value={searchDataForm.date}
                  onChange={handleDateChange}
                  size="lg"
                  min={today}
                  bg="white"
                  _hover={{ borderColor: 'red.400' }}
                  _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px #E53E3E' }}
                />
                {dateError && <Text color="red.500" fontSize="sm" mt={2}>{dateError}</Text>}
              </FormControl>

              <Button
                type="submit"
                colorScheme="red"
                size="lg"
                width="100%"
                fontSize="lg"
                mt={4}
              >
                Search Buses
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Search Results */}
        {hasSearched && (
          <Box>
            <Heading size="lg" mb={6}>Available Buses</Heading>
            <Text color="gray.600" mb={4}>
              Showing buses from {searchDataForm.from} to {searchDataForm.to} on {searchDataForm.date}
            </Text>
            
            {loading && (
              <Box textAlign="center" py={10}>
                <Text>Loading available buses...</Text>
              </Box>
            )}
            
            {error && (
              <Box bg="red.50" p={4} borderRadius="md" mb={4}>
                <Text color="red.500">{error}</Text>
              </Box>
            )}
            
            {!loading && !error && buses.length === 0 && (
              <Box textAlign="center" py={10}>
                <Text>No buses found for this route. Please try different dates or locations.</Text>
              </Box>
            )}
            
            {!loading && !error && buses.length > 0 && (
              <VStack spacing={4} align="stretch">
                {buses.map((bus) => (
                  <AvailableBuses
                    key={bus._id}
                    bus={bus}
                    onSelectBus={handleSelectBus}
                    bookedSeatsCount={bookedSeatsCounts[bus._id] || 0}
                  />
                ))}
              </VStack>
            )}
          </Box>
        )}
      </VStack>

      {/* Seat Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Your Seats</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedBus && <SeatSelection bus={selectedBus} onClose={onClose} searchData={searchDataForm} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SearchResults;