import { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Stack,
  Divider,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Badge,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tooltip
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaCreditCard,
  FaRupeeSign,
  FaUser,
  FaCalendarAlt,
  FaLock,
  FaMobile,
  FaUniversity,
  FaShieldAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaQrcode,
  FaCheckCircle
} from 'react-icons/fa';
import { SiPhonepe, SiGooglepay, SiPaytm } from 'react-icons/si';
import API_BASE_URL from '../api';
import axios from 'axios';

const Payment = ({ passengerDetails, selectedSeats, bus, onClose, date }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: ''
  });

  const totalAmount = selectedSeats.length * bus.price;

  const handlePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        toast({
          title: "Error",
          description: "Please login to continue with booking",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const bookingData = {
        user: user._id,
        bus: bus._id,
        seats: selectedSeats,
        totalAmount: totalAmount,
        journeyDate: date,
        passengerDetails,
        boardingPoint: passengerDetails.boardingPoint,
        droppingPoint: passengerDetails.droppingPoint,
        paymentMethod
      };

      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
      
      if (response.data) {
        toast({
          title: "Booking Successful",
          description: "Your booking has been confirmed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        navigate('/booking-confirmation', {
          state: {
            passengerDetails,
            selectedSeats,
            bus,
            totalAmount,
            paymentMethod,
            date
          }
        });
      }
    } catch (error) {
      console.error('Booking error:', error, error.response?.data);
      toast({
        title: "Booking Failed",
        description: error.response?.data?.message || error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <Box
            p={6}
            borderWidth={1}
            borderRadius="xl"
            bg="white"
            boxShadow="lg"
            _hover={{ boxShadow: "xl" }}
            transition="all 0.2s"
          >
            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Card Number</FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaCreditCard} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    maxLength={19}
                    fontSize="lg"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                  />
                  <InputRightElement width="4.5rem">
                    <HStack spacing={1}>
                      <Icon as={FaCcVisa} boxSize="6" color="blue.500" />
                      <Icon as={FaCcMastercard} boxSize="6" color="red.500" />
                      <Icon as={FaCcAmex} boxSize="6" color="blue.400" />
                    </HStack>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="medium">Card Holder Name</FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaUser} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter card holder name"
                    value={paymentDetails.cardHolder}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardHolder: e.target.value })}
                    fontSize="lg"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                  />
                </InputGroup>
              </FormControl>

              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontWeight="medium">Expiry Date</FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaCalendarAlt} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                      maxLength={5}
                      fontSize="lg"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="medium">CVV</FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      placeholder="***"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      maxLength={3}
                      fontSize="lg"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                    />
                    <InputRightElement>
                      <Tooltip label="3-digit security code on the back of your card" placement="top">
                        <Box>
                          <Icon as={FaShieldAlt} color="gray.400" />
                        </Box>
                      </Tooltip>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </VStack>
          </Box>
        );

      case 'upi':
        return (
          <VStack spacing={6} align="stretch">
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                cursor="pointer"
                _hover={{ shadow: 'md', borderColor: 'green.500' }}
                onClick={() => setPaymentDetails({ ...paymentDetails, upiId: '@phonepe' })}
              >
                <VStack>
                  <Icon as={SiPhonepe} w={8} h={8} color="purple.600" />
                  <Text fontSize="sm">PhonePe</Text>
                </VStack>
              </Box>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                cursor="pointer"
                _hover={{ shadow: 'md', borderColor: 'green.500' }}
                onClick={() => setPaymentDetails({ ...paymentDetails, upiId: '@googlepay' })}
              >
                <VStack>
                  <Icon as={SiGooglepay} w={8} h={8} color="blue.500" />
                  <Text fontSize="sm">Google Pay</Text>
                </VStack>
              </Box>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                cursor="pointer"
                _hover={{ shadow: 'md', borderColor: 'green.500' }}
                onClick={() => setPaymentDetails({ ...paymentDetails, upiId: '@paytm' })}
              >
                <VStack>
                  <Icon as={SiPaytm} w={8} h={8} color="blue.600" />
                  <Text fontSize="sm">Paytm</Text>
                </VStack>
              </Box>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                cursor="pointer"
                _hover={{ shadow: 'md', borderColor: 'green.500' }}
              >
                <VStack>
                  <Icon as={FaQrcode} w={8} h={8} color="gray.600" />
                  <Text fontSize="sm">Scan QR</Text>
                </VStack>
              </Box>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel>UPI ID</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaMobile} color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="username@upi"
                  value={paymentDetails.upiId}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                />
                <InputRightElement>
                  <Icon as={FaCheckCircle} color="green.500" />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </VStack>
        );

      case 'netbanking':
        return (
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
              {[
                { name: 'State Bank of India', value: 'sbi', icon: '🏦' },
                { name: 'HDFC Bank', value: 'hdfc', icon: '🏦' },
                { name: 'ICICI Bank', value: 'icici', icon: '🏦' },
                { name: 'Axis Bank', value: 'axis', icon: '🏦' },
                { name: 'Kotak Bank', value: 'kotak', icon: '🏦' },
                { name: 'Yes Bank', value: 'yes', icon: '🏦' }
              ].map((bank) => (
                <Box
                  key={bank.value}
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  cursor="pointer"
                  onClick={() => setPaymentDetails({ ...paymentDetails, bankName: bank.value })}
                  bg={paymentDetails.bankName === bank.value ? 'green.50' : 'white'}
                  borderColor={paymentDetails.bankName === bank.value ? 'green.500' : 'gray.200'}
                  _hover={{ shadow: 'md' }}
                >
                  <VStack>
                    <Text fontSize="xl">{bank.icon}</Text>
                    <Text fontSize="sm" textAlign="center">{bank.name}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Booking Summary */}
        <Box
          p={4}
          borderRadius="lg"
          bg="gray.50"
          borderWidth={1}
          borderColor="gray.200"
        >
          <VStack spacing={3} align="stretch">
            <Heading size="md" color="gray.700">Booking Summary</Heading>
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text color="gray.600" fontSize="sm">Bus</Text>
                <Text fontWeight="bold">{bus.busName}</Text>
              </Box>
              <Box>
                <Text color="gray.600" fontSize="sm">Seats</Text>
                <HStack spacing={2}>
                  {selectedSeats.map(seat => (
                    <Badge key={seat} colorScheme="red">{seat}</Badge>
                  ))}
                </HStack>
              </Box>
              <Box>
                <Text color="gray.600" fontSize="sm">Passenger</Text>
                <Text fontWeight="bold">{passengerDetails.passengers[0].name}</Text>
              </Box>
              <Box>
                <Text color="gray.600" fontSize="sm">Amount</Text>
                <HStack>
                  <Icon as={FaRupeeSign} />
                  <Text fontWeight="bold" fontSize="xl" color="red.500">{totalAmount}</Text>
                </HStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        <Divider />

        {/* Payment Method Selection */}
        <Box>
          <Heading size="md" mb={4}>Select Payment Method</Heading>
          <RadioGroup value={paymentMethod} onChange={setPaymentMethod} mb={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                cursor="pointer"
                bg={paymentMethod === 'card' ? 'red.50' : 'white'}
                borderColor={paymentMethod === 'card' ? 'red.500' : 'gray.200'}
                onClick={() => setPaymentMethod('card')}
                _hover={{ shadow: 'md' }}
              >
                <Radio value="card" w="100%">
                  <HStack>
                    <Icon as={FaCreditCard} color="red.500" />
                    <Text>Credit/Debit Card</Text>
                  </HStack>
                </Radio>
              </Box>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                cursor="pointer"
                bg={paymentMethod === 'upi' ? 'red.50' : 'white'}
                borderColor={paymentMethod === 'upi' ? 'red.500' : 'gray.200'}
                onClick={() => setPaymentMethod('upi')}
                _hover={{ shadow: 'md' }}
              >
                <Radio value="upi" w="100%">
                  <HStack>
                    <Icon as={FaMobile} color="red.500" />
                    <Text>UPI Payment</Text>
                  </HStack>
                </Radio>
              </Box>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                cursor="pointer"
                bg={paymentMethod === 'netbanking' ? 'red.50' : 'white'}
                borderColor={paymentMethod === 'netbanking' ? 'red.500' : 'gray.200'}
                onClick={() => setPaymentMethod('netbanking')}
                _hover={{ shadow: 'md' }}
              >
                <Radio value="netbanking" w="100%">
                  <HStack>
                    <Icon as={FaUniversity} color="red.500" />
                    <Text>Net Banking</Text>
                  </HStack>
                </Radio>
              </Box>
            </SimpleGrid>
          </RadioGroup>
        </Box>

        {/* Payment Form */}
        <Box
          p={6}
          borderWidth={1}
          borderRadius="lg"
          borderColor="gray.200"
          bg="white"
        >
          {renderPaymentForm()}
        </Box>

        {/* Security Note */}
        <HStack spacing={2} justify="center" color="gray.600" fontSize="sm">
          <Icon as={FaShieldAlt} />
          <Text>Your payment information is secure and encrypted</Text>
        </HStack>

        {/* Action Buttons */}
        <HStack spacing={4} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            size="lg"
            onClick={handlePayment}
            isLoading={isLoading}
            loadingText="Processing Payment"
            leftIcon={<FaRupeeSign />}
          >
            Pay ₹{totalAmount}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Payment;