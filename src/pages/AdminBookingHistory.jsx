import { useEffect, useState } from 'react';
import API_BASE_URL from '../api';
import axios from 'axios';
import { Box, Heading, VStack, Text, HStack } from '@chakra-ui/react';
import { FaBus, FaUser, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaChair, FaEnvelope } from 'react-icons/fa';

const AdminBookingHistory = () => {
  const [bookings, setBookings] = useState([]);

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

  return (
    <Box maxW="900px" mx="auto" py={8}>
      <Heading mb={6}>All Bookings (Admin)</Heading>
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
                  <FaEnvelope color="#3182CE" />
                  <Text><b>User:</b> {booking.user?.email || 'N/A'}</Text>
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
              </VStack>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default AdminBookingHistory; 