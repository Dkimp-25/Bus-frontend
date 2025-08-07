import { Box, SimpleGrid, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, VStack, HStack, Icon, useToast } from '@chakra-ui/react';
import PassengerDetails from './PassengerDetails';
import Payment from './Payment';
import { FaChair, FaBed } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../api';
import axios from 'axios';

const SeatSelection = ({ bus, onClose, searchData }) => {
  console.log('SeatSelection searchData:', searchData);
  const { isOpen: isPassengerModalOpen, onOpen: openPassengerModal, onClose: closePassengerModal } = useDisclosure();
  const { isOpen: isPaymentModalOpen, onOpen: openPaymentModal, onClose: closePaymentModal } = useDisclosure();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingBookedSeats, setLoadingBookedSeats] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setLoadingBookedSeats(true);
        const response = await axios.get(`${API_BASE_URL}/bookings/bus/${bus._id}/booked-seats`, {
          params: { date: searchData?.date }
        });
        setBookedSeats(response.data.bookedSeats.map(Number));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch booked seats',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingBookedSeats(false);
      }
    };
    fetchBookedSeats();
  }, [bus._id, toast, searchData?.date]);

  // Generate seats based on bus type and available seats
  const generateSeats = () => {
    const seats = [];
    const totalSeats = bus.totalSeats;
    const isCombo = bus.busType.toLowerCase().includes('combo');
    const isSeater = bus.busType.toLowerCase().includes('seater');

    if (isCombo) {
      // Generate lower deck seater seats (24 seats in 2x2 configuration)
      for (let i = 1; i <= 24; i++) {
        seats.push({
          id: i,
          number: i,
          type: 'seater',
          deck: 'lower',
          isBooked: bookedSeats.includes(i),
          isSelected: false
        });
      }
      // Generate upper deck sleeper berths (12 berths)
      for (let i = 1; i <= 12; i++) {
        seats.push({
          id: i + 24,
          number: i,
          type: 'sleeper',
          deck: 'upper',
          isBooked: bookedSeats.includes(i + 24),
          isSelected: false
        });
      }
      return { seats, isCombo, isSeater: false };
    }

    // For regular buses (either seater or sleeper)
    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        id: i,
        number: i,
        type: isSeater ? 'seater' : 'sleeper',
        deck: 'single',
        isBooked: bookedSeats.includes(i),
        isSelected: false
      });
    }
    return { seats, isCombo: false, isSeater };
  };

  const { seats, isSeater, isCombo } = generateSeats();

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    const updatedSeats = seats.map(s => {
      if (s.id === seat.id) {
        return { ...s, isSelected: !s.isSelected };
      }
      return s;
    });
    setSelectedSeats(updatedSeats.filter(s => s.isSelected).map(s => s.number));
  };

  const handlePassengerDetailsSubmit = (details) => {
    setPassengerDetails(details);
    closePassengerModal();
    openPaymentModal();
  };

  const renderSeat = (seat) => (
    <Box
      key={seat.id}
      as="button"
      p={2}
      borderWidth={1}
      borderRadius="md"
      bg={seat.isBooked ? "gray.100" : seat.isSelected ? "green.100" : "white"}
      onClick={() => handleSeatClick(seat)}
      cursor={seat.isBooked ? "not-allowed" : "pointer"}
      _hover={seat.isBooked ? {} : { bg: "green.50" }}
      opacity={seat.isBooked ? 0.5 : 1}
    >
      <Icon
        as={seat.type === 'sleeper' ? FaBed : FaChair}
        color={seat.isBooked ? "gray.400" : seat.isSelected ? "green.500" : "gray.600"}
      />
      <Text fontSize="sm" mt={1}>
        {seat.number}
      </Text>
    </Box>
  );

  if (loadingBookedSeats) {
    return (
      <Box p={4} textAlign="center">
        <Text>Loading seat map...</Text>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Select Your Seat - {bus.busName}
      </Text>
      
      {isCombo ? (
        <Box>
          <Text mb={2} fontWeight="semibold">Lower Deck - Seater</Text>
          <Box maxW="fit-content" mx="auto" mb={6}>
            <HStack spacing={4} alignItems="flex-start">
              {/* Left side seats */}
              <VStack spacing={3}>
                {Array.from({ length: 6 }).map((_, rowIndex) => (
                  <HStack key={`left-${rowIndex}`} spacing={2}>
                    {seats
                      .filter(seat => seat.type === 'seater')
                      .slice(rowIndex * 4, rowIndex * 4 + 2)
                      .map(renderSeat)}
                  </HStack>
                ))}
              </VStack>
              
              {/* Aisle */}
              <Box w="4px" h="100%" bg="gray.200" />
              
              {/* Right side seats */}
              <VStack spacing={3}>
                {Array.from({ length: 6 }).map((_, rowIndex) => (
                  <HStack key={`right-${rowIndex}`} spacing={2}>
                    {seats
                      .filter(seat => seat.type === 'seater')
                      .slice(rowIndex * 4 + 2, rowIndex * 4 + 4)
                      .map(renderSeat)}
                  </HStack>
                ))}
              </VStack>
            </HStack>
          </Box>

          <Text mb={2} fontWeight="semibold">Upper Deck - Sleeper</Text>
          <SimpleGrid columns={3} spacing={4}>
            {seats
              .filter(seat => seat.type === 'sleeper')
              .map(renderSeat)}
          </SimpleGrid>
        </Box>
      ) : isSeater ? (
        // Seater Layout (2-2 configuration)
        <Box maxW="fit-content" mx="auto">
          <HStack spacing={4} alignItems="flex-start">
            {/* Left side seats */}
            <VStack spacing={3}>
              {Array.from({ length: Math.ceil(seats.length / 4) }).map((_, rowIndex) => (
                <HStack key={`left-${rowIndex}`} spacing={2}>
                  {seats
                    .slice(rowIndex * 2, rowIndex * 2 + 2)
                    .map(renderSeat)}
                </HStack>
              ))}
            </VStack>
            {/* Aisle */}
            <Box w="4px" h="100%" bg="gray.200" />
            {/* Right side seats */}
            <VStack spacing={3}>
              {Array.from({ length: Math.ceil(seats.length / 4) }).map((_, rowIndex) => (
                <HStack key={`right-${rowIndex}`} spacing={2}>
                  {seats
                    .slice(Math.floor(seats.length / 2) + rowIndex * 2, Math.floor(seats.length / 2) + rowIndex * 2 + 2)
                    .map(renderSeat)}
                </HStack>
              ))}
            </VStack>
          </HStack>
        </Box>
      ) : (
        // Sleeper Layout
        <Box>
          <Text mb={2}>Upper Berth</Text>
          <SimpleGrid columns={6} spacing={4} mb={6}>
            {seats.slice(0, Math.floor(seats.length / 2)).map(renderSeat)}
          </SimpleGrid>
          <Text mb={2}>Lower Berth</Text>
          <SimpleGrid columns={6} spacing={4}>
            {seats.slice(Math.floor(seats.length / 2)).map(renderSeat)}
          </SimpleGrid>
        </Box>
      )}

      <HStack justify="flex-end" mt={6} spacing={4}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          colorScheme="red"
          onClick={openPassengerModal}
          isDisabled={selectedSeats.length === 0}
        >
          Confirm Selection
        </Button>
      </HStack>

      {/* Passenger Details Modal */}
      <Modal isOpen={isPassengerModalOpen} onClose={closePassengerModal} size="xl">
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalCloseButton />
          <ModalBody p={0}>
            <PassengerDetails
              selectedSeats={selectedSeats}
              bus={bus}
              onSubmit={handlePassengerDetailsSubmit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Payment Modal */}
      {passengerDetails && (
        <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Payment Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Payment
                passengerDetails={passengerDetails}
                selectedSeats={selectedSeats}
                bus={bus}
                date={searchData?.date}
                onClose={() => {
                  closePaymentModal();
                  onClose();
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default SeatSelection;