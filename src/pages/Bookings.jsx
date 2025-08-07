import { useEffect, useState } from 'react';
import API_BASE_URL from '../api';
import axios from 'axios';
import { Box, Heading, VStack, Text, HStack, Button, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { FaBus, FaUser, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaChair } from 'react-icons/fa';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refundInfo, setRefundInfo] = useState({ percent: 0, amount: 0 });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bookings`);
        setBookings(response.data);
      } catch (error) {
        // handle error
      }
    };
    fetchBookings();
  }, []);

  // Refund policy calculation
  const getRefundPolicy = (journeyDate, departureTime, totalAmount) => {
    if (!journeyDate || !departureTime) return { percent: 0, amount: 0 };

    // Combine journeyDate and departureTime into a single Date object
    const departureDateTime = new Date(`${journeyDate}T${departureTime}`);
    const now = new Date();

    // If the departure time is in the past, journey is completed
    if (departureDateTime < now) {
      return { percent: 0, amount: 0, isCompleted: true };
    }

    const diffHours = (departureDateTime - now) / (1000 * 60 * 60);

    let percent = 0;
    if (diffHours > 24) percent = 90;
    else if (diffHours > 12) percent = 50;
    else if (diffHours > 6) percent = 25;
    else percent = 0;

    return { percent, amount: Math.round((percent / 100) * totalAmount), isCompleted: false };
  };

  const handleCancelClick = (booking) => {
    const refund = getRefundPolicy(booking.journeyDate, booking.bus?.departureTime, booking.totalAmount);
    if (refund.isCompleted) {
      toast({
        title: 'Journey Completed',
        description: 'Cannot cancel a completed journey',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setSelectedBooking(booking);
    setRefundInfo(refund);
    onOpen();
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    try {
      await axios.delete(`${API_BASE_URL}/bookings/${selectedBooking._id}`);
      setBookings(bookings.filter(b => b._id !== selectedBooking._id));
      toast({
        title: 'Booking Cancelled',
        description: `Refund: ₹${refundInfo.amount} (${refundInfo.percent}%)`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: error.response?.data?.error || 'Could not cancel booking',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSelectedBooking(null);
      onClose();
    }
  };

  return (
    <Box maxW="800px" mx="auto" py={8}>
      <Heading mb={6}>My Bookings so far</Heading>
      <VStack spacing={4} align="stretch">
        {bookings.length === 0 ? (
          <Text>No bookings found.</Text>
        ) : (
          bookings.map((booking) => (
            <Box key={booking._id} p={6} borderWidth={1} borderRadius="xl" boxShadow="md" bg="white" _hover={{ boxShadow: 'lg', borderColor: 'red.400' }} transition="all 0.2s">
              <VStack align="stretch" spacing={3}>
                <HStack spacing={3} mb={2}>
                  <FaBus color="#E53E3E" size={24} />
                  <Heading size="md" color="red.600">{booking.bus?.busName || 'N/A'}</Heading>
                  <Text color="gray.500" fontWeight="bold">({booking.bus?.busType || 'N/A'})</Text>
                </HStack>
                <HStack spacing={4}>
                  <FaCalendarAlt color="#3182CE" />
                  <Text><b>Journey Date:</b> {booking.journeyDate || 'N/A'}</Text>
                  <FaChair color="#E53E3E" />
                  <Text><b>Seats:</b> {booking.seats?.join(', ')}</Text>
                </HStack>
                <HStack spacing={4}>
                  <FaUser color="#38A169" />
                  <Text><b>Passenger:</b> {booking.passengerDetails?.passengers?.[0]?.name || 'N/A'}</Text>
                </HStack>
                <HStack spacing={4}>
                  <FaMapMarkerAlt color="#D69E2E" />
                  <Text><b>Boarding:</b> {booking.boardingPoint || 'N/A'}</Text>
                  <FaMapMarkerAlt color="#805AD5" />
                  <Text><b>Dropping:</b> {booking.droppingPoint || 'N/A'}</Text>
                </HStack>
                <HStack spacing={4}>
                  <FaCreditCard color="#DD6B20" />
                  <Text><b>Payment Method:</b> {booking.paymentMethod || 'N/A'}</Text>
                  <Text><b>Total Amount:</b> <span style={{ color: '#E53E3E', fontWeight: 'bold' }}>₹{booking.totalAmount}</span></Text>
                </HStack>
                <HStack spacing={4}>
                  <Text><b>Status:</b> <span style={{ color: booking.status === 'confirmed' ? '#38A169' : '#E53E3E' }}>{booking.status}</span></Text>
                  <Text><b>Booked On:</b> {new Date(booking.bookingDate).toLocaleString()}</Text>
                </HStack>
                <Button colorScheme="red" variant="outline" mt={2} onClick={() => handleCancelClick(booking)}>
                  Cancel Booking
                </Button>
              </VStack>
            </Box>
          ))
        )}
      </VStack>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Booking</ModalHeader>
          <ModalBody>
            <Text mb={2}>Are you sure you want to cancel this booking?</Text>
            <Text mb={2}>Refund Policy:</Text>
            <ul style={{ marginLeft: 20, marginBottom: 10 }}>
              <li>Before 24 hours: <b>90%</b> refund</li>
              <li>12-24 hours: <b>50%</b> refund</li>
              <li>6-12 hours: <b>25%</b> refund</li>
              <li>Below 6 hours: <b>0%</b> refund</li>
            </ul>
            <Text><b>Refund Amount:</b> ₹{refundInfo.amount} ({refundInfo.percent}%)</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">No</Button>
            <Button colorScheme="red" onClick={handleConfirmCancel}>Yes, Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Bookings; 