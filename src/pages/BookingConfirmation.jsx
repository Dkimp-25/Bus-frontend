import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaCheckCircle, FaBus, FaUser, FaTicketAlt, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';

const BookingConfirmation = () => {
  const location = useLocation();
  console.log('BookingConfirmation location.state:', location.state);
  const { passengerDetails, selectedSeats, bus, totalAmount, paymentMethod, date } = location.state || {};
  console.log('BookingConfirmation passengerDetails:', passengerDetails);
  console.log('BookingConfirmation bus:', bus);
  const navigate = useNavigate();

  // Generate a random booking reference number
  const bookingReference = `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const handlePrintTicket = () => {
    window.print();
  };

  const handleBookAnother = () => {
    navigate('/');
  };

  if (!bus || !passengerDetails) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={4} align="center">
          <Text>Booking information not found.</Text>
          <Button colorScheme="red" onClick={handleBookAnother}>
            Book a New Trip
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={4} align="center">
          <Icon as={FaCheckCircle} w={16} h={16} color="green.500" />
          <Heading size="lg" textAlign="center">Booking Confirmed!</Heading>
          <Text fontSize="lg" color="gray.600">Booking Reference: {bookingReference}</Text>
        </VStack>

        <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
          <VStack spacing={6} align="stretch">
            <HStack>
              <Icon as={FaBus} color="red.500" />
              <Heading size="md">Bus Details</Heading>
            </HStack>
            <VStack spacing={2} align="stretch" pl={6}>
              <Text><strong>Bus Name:</strong> {bus.busName}</Text>
              <Text><strong>Bus Type:</strong> {bus.busType}</Text>
              <Text><strong>Source:</strong> {bus.source || location.state?.source}</Text>
              <Text><strong>Destination:</strong> {bus.destination || location.state?.destination}</Text>
              <Text><strong>Journey Date:</strong> {date || 'Not specified'}</Text>
              <Text><strong>Departure:</strong> {bus.departureTime}</Text>
              <Text><strong>Arrival:</strong> {bus.arrivalTime}</Text>
            </VStack>

            <Divider />

            <HStack>
              <Icon as={FaUser} color="red.500" />
              <Heading size="md">Passenger Details</Heading>
            </HStack>
            <VStack spacing={2} align="stretch" pl={6}>
              <Text><strong>Name:</strong> {passengerDetails.passengers[0].name}</Text>
              <Text><strong>Age:</strong> {passengerDetails.passengers[0].age}</Text>
              <Text><strong>Gender:</strong> {passengerDetails.passengers[0].gender}</Text>
              <Text><strong>Email:</strong> {passengerDetails.passengers[0].email}</Text>
              <Text><strong>Phone:</strong> {passengerDetails.passengers[0].phone}</Text>
            </VStack>

            <Divider />

            <HStack>
              <Icon as={FaTicketAlt} color="red.500" />
              <Heading size="md">Booking Details</Heading>
            </HStack>
            <VStack spacing={2} align="stretch" pl={6}>
              <Text><strong>Selected Seat/Seats:</strong> {selectedSeats.join(', ')}</Text>
              <Text><strong>Number of Seats:</strong> {selectedSeats.length}</Text>
              <Text><strong>Price per Seat:</strong> ₹{bus.price}</Text>
              <Text><strong>Total Amount:</strong> ₹{totalAmount}</Text>
            </VStack>

            <Divider />

            <HStack>
              <Icon as={FaMapMarkerAlt} color="red.500" />
              <Heading size="md">Boarding & Dropping Points</Heading>
            </HStack>
            <VStack spacing={2} align="stretch" pl={6}>
              <Text><strong>Boarding Point:</strong> {passengerDetails.boardingPoint?.split(' - ')[0] || 'Not specified'}</Text>
              <Text><strong>Boarding Time:</strong> {passengerDetails.boardingPoint?.split(' - ')[1] || 'Not specified'}</Text>
              <Text><strong>Dropping Point:</strong> {passengerDetails.droppingPoint?.split(' - ')[0] || 'Not specified'}</Text>
              <Text><strong>Dropping Time:</strong> {passengerDetails.droppingPoint?.split(' - ')[1] || 'Not specified'}</Text>
            </VStack>

            <Divider />

            <HStack>
              <Icon as={FaCreditCard} color="red.500" />
              <Heading size="md">Payment Details</Heading>
            </HStack>
            <VStack spacing={2} align="stretch" pl={6}>
              <Text><strong>Payment Method:</strong> {paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}</Text>
              <Text><strong>Payment Status:</strong> Successful</Text>
            </VStack>
          </VStack>
        </Box>

        <HStack spacing={4} justify="center">
          <Button colorScheme="red" onClick={handlePrintTicket}>
            Print Ticket
          </Button>
          <Button variant="outline" colorScheme="red" onClick={handleBookAnother}>
            Book Another Trip
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default BookingConfirmation;