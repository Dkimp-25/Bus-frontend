import {
  Box,
  Flex,
  Heading,
  Button,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Divider,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  Tooltip,
  Input
} from '@chakra-ui/react';
import { FaBus, FaUsers, FaTicketAlt, FaRupeeSign, FaChartLine, FaChair, FaBed } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api';

const Dashboard = () => {
  const { openAddBusModal } = useOutletContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBus, setSelectedBus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [busBookings, setBusBookings] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loadingSeats, setLoadingSeats] = useState(false);

  const [stats, setStats] = useState({
    totalBuses: 0,
    totalUsers: 0,
    bookingsToday: 0,
    revenueToday: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all buses with fresh data
        const busesRes = await axios.get(`${API_BASE_URL}/buses`, {
          params: {
            timestamp: new Date().getTime() // Add timestamp to prevent caching
          }
        });
        const busesData = busesRes.data;
        setBuses(busesData);
        
        // Fetch all users
        const usersRes = await axios.get(`${API_BASE_URL}/users`);
        const usersData = usersRes.data;
        
        // Fetch all bookings with seat numbers
        const bookingsRes = await axios.get(`${API_BASE_URL}/bookings`);
        const bookingsData = bookingsRes.data;
        setBookings(bookingsData);

        // Organize bookings by busId
        const bookingsByBus = {};
        bookingsData.forEach(booking => {
          if (!bookingsByBus[booking.busId]) {
            bookingsByBus[booking.busId] = [];
          }
          if (booking.seatNumbers && Array.isArray(booking.seatNumbers)) {
            bookingsByBus[booking.busId].push(...booking.seatNumbers);
          }
        });
        setBusBookings(bookingsByBus);

        // Calculate stats
        const today = new Date().toISOString().slice(0, 10);
        let bookingsToday = 0;
        let revenueToday = 0;
        let totalBookings = bookingsData.length;
        let totalRevenue = 0;
        
        bookingsData.forEach(b => {
          const bookingDate = new Date(b.bookingDate).toISOString().slice(0, 10);
          if (bookingDate === today) {
            bookingsToday += 1;
            revenueToday += b.totalAmount || 0;
          }
          totalRevenue += b.totalAmount || 0;
        });

        setStats({
          totalBuses: busesData.length,
          totalUsers: usersData.length || 0,
          bookingsToday,
          revenueToday,
          totalBookings,
          totalRevenue,
        });

        console.log('Total users fetched:', usersData.length);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchStats();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchBookedSeatsForBus = async (bus, date) => {
    setLoadingSeats(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/bus/${bus._id}/booked-seats`, {
        params: { date }
      });
      const { bookedSeats } = response.data;
      setSelectedBus({
        ...bus,
        bookedSeats: bookedSeats.map(seat => seat.toString())
      });
    } catch (error) {
      setSelectedBus({
        ...bus,
        bookedSeats: []
      });
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleBusClick = (bus) => {
    setSelectedDate(new Date().toISOString().slice(0, 10));
    fetchBookedSeatsForBus(bus, new Date().toISOString().slice(0, 10));
    onOpen();
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (selectedBus) {
      fetchBookedSeatsForBus(selectedBus, date);
    }
  };

  const getBookedSeatsForBus = (busId) => {
    if (selectedBus && selectedBus._id === busId) {
      const bookedSeats = selectedBus.bookedSeats || [];
      console.log('Current booked seats for bus:', busId, bookedSeats);
      return bookedSeats;
    }
    return [];
  };

  const renderSeat = (seatNumber, isBooked) => {
    const seatStr = seatNumber.toString();
    return (
      <Tooltip 
        label={`Seat ${seatNumber}${isBooked ? ' (Booked)' : ' (Available)'}`} 
        key={seatNumber}
        hasArrow
      >
        <Box
          p={2}
          borderWidth={1}
          borderRadius="md"
          bg={isBooked ? "red.400" : "transparent"}
          borderColor={isBooked ? "red.500" : "gray.200"}
          cursor="default"
          opacity={isBooked ? 1 : 0.7}
          _hover={{
            bg: isBooked ? "red.400" : "transparent",
            borderColor: isBooked ? "red.500" : "gray.300"
          }}
        >
          <Icon
            as={selectedBus?.busType?.toLowerCase().includes('sleeper') ? FaBed : FaChair}
            color={isBooked ? "white" : "gray.200"}
          />
          <Text fontSize="sm" mt={1} color={isBooked ? "white" : "gray.200"}>
            {seatNumber}
          </Text>
        </Box>
      </Tooltip>
    );
  };

  const renderBusLayout = (bus, bookedSeats) => {
    console.log('Rendering layout with booked seats:', bookedSeats);
    const isSeater = bus.busType.toLowerCase().includes('seater');

    return (
      <Box maxW="fit-content" mx="auto">
        <HStack spacing={8} alignItems="flex-start">
          {/* Left side seats (1-16) */}
          <VStack spacing={3}>
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <HStack key={`left-${rowIndex}`} spacing={2}>
                {Array.from({ length: 2 }).map((_, seatIndex) => {
                  const seatNumber = rowIndex * 2 + seatIndex + 1;
                  return renderSeat(
                    seatNumber,
                    bookedSeats.includes(seatNumber.toString())
                  );
                })}
              </HStack>
            ))}
          </VStack>

          {/* Aisle */}
          <Box w="2px" h="100%" bg="gray.200" />

          {/* Right side seats (17-32) */}
          <VStack spacing={3}>
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <HStack key={`right-${rowIndex}`} spacing={2}>
                {Array.from({ length: 2 }).map((_, seatIndex) => {
                  const seatNumber = rowIndex * 2 + seatIndex + 17;
                  return renderSeat(
                    seatNumber,
                    bookedSeats.includes(seatNumber.toString())
                  );
                })}
              </HStack>
            ))}
          </VStack>
        </HStack>
      </Box>
    );
  };

  const statsArray = [
    { label: 'Total Buses', value: stats.totalBuses, icon: FaBus },
    { label: 'Total Users', value: stats.totalUsers, icon: FaUsers },
    { label: 'Total Bookings', value: stats.totalBookings, icon: FaTicketAlt },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: FaRupeeSign },
    { label: 'Bookings Today', value: stats.bookingsToday, icon: FaChartLine },
    { label: 'Revenue Today', value: `₹${stats.revenueToday}`, icon: FaRupeeSign },
  ];

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Admin Dashboard</Heading>
          <Button
            leftIcon={<Icon as={FaBus} />}
            colorScheme="red"
            onClick={openAddBusModal}
          >
            Add New Bus
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {statsArray.map((stat, index) => (
            <Box
              key={index}
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="md"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              <Stat>
                <HStack spacing={4}>
                  <Icon as={stat.icon} boxSize={8} color="red.500" />
                  <Box>
                    <StatLabel fontSize="lg">{stat.label}</StatLabel>
                    <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                  </Box>
                </HStack>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>

        {/* Buses List */}
        <Box mt={10}>
          <Heading size="md" mb={4} color="red.600">All Buses</Heading>
          <Divider mb={4} />
          {buses.length === 0 ? (
            <Text>No buses found.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {buses.map((bus) => (
                <Box
                  key={bus._id}
                  p={5}
                  borderWidth={1}
                  borderRadius="lg"
                  boxShadow="sm"
                  bg="white"
                  _hover={{ boxShadow: 'md', borderColor: 'red.400', cursor: 'pointer' }}
                  transition="all 0.2s"
                  onClick={() => handleBusClick(bus)}
                >
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <FaBus color="#E53E3E" />
                      <Text fontWeight="bold" fontSize="lg">{bus.busName}</Text>
                      <Badge colorScheme="red">{bus.busType}</Badge>
                    </HStack>
                    <Text color="gray.600"><b>Number:</b> {bus.busNumber}</Text>
                    <Text color="gray.600"><b>Route:</b> {bus.source} → {bus.destination}</Text>
                    <Text color="gray.600"><b>Departure:</b> {bus.departureTime} | <b>Arrival:</b> {bus.arrivalTime}</Text>
                    <Text color="gray.600">
                      <b>Seats:</b> {bus.totalSeats} | 
                      <b>Available:</b> {bus.availableSeats}
                    </Text>
                    <Text color="gray.600"><b>Price:</b> ₹{bus.price}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Seat Availability Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg="gray.800">
            <ModalHeader color="white">
              {selectedBus?.busName} - Seat Availability
              <Text fontSize="sm" color="gray.300" mt={1}>
                {selectedBus?.source} → {selectedBus?.destination}
              </Text>
              <Text fontSize="sm" color="gray.300" mt={1}>
                Available Seats: {selectedBus?.availableSeats} / {selectedBus?.totalSeats}
              </Text>
              <Box mt={3}>
                <Text color="gray.200" mb={1}>Select Date:</Text>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  maxW="200px"
                  bg="white"
                  color="black"
                  size="sm"
                />
              </Box>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody pb={6}>
              {selectedBus && (
                <VStack spacing={4}>
                  <HStack spacing={4} mb={4}>
                    <HStack>
                      <Box w="20px" h="20px" bg="transparent" borderWidth={1} borderColor="gray.200" borderRadius="md" />
                      <Text color="gray.200">Available</Text>
                    </HStack>
                    <HStack>
                      <Box w="20px" h="20px" bg="red.400" borderWidth={1} borderColor="red.500" borderRadius="md" />
                      <Text color="gray.200">Booked</Text>
                    </HStack>
                  </HStack>
                  {loadingSeats ? (
                    <Text color="gray.200">Loading seats...</Text>
                  ) : (
                    renderBusLayout(selectedBus, getBookedSeatsForBus(selectedBus._id))
                  )}
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Dashboard; 