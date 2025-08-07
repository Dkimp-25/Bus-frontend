import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Icon,
  Divider,
  Grid,
  GridItem,
  Radio,
  RadioGroup,
  Stack,
  Badge,
  Heading,
  SimpleGrid
} from '@chakra-ui/react';
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBusAlt,
  FaLocationArrow,
  FaMapPin,
  FaMale,
  FaFemale,
  FaWheelchair
} from 'react-icons/fa';
import { useState } from 'react';

const PassengerDetails = ({ selectedSeats, bus, onSubmit }) => {
  const toast = useToast();
  const [passengers, setPassengers] = useState(
    selectedSeats.map(seat => ({
      seatNumber: seat,
      name: '',
      age: '',
      gender: 'male',
      phone: '',
      email: ''
    }))
  );
  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = () => {
    // Validate all fields are filled
    const isValid = passengers.every(p => 
      p.name && p.age && p.gender && p.phone && p.email
    ) && boardingPoint && droppingPoint;

    if (!isValid) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all passenger details and select boarding/dropping points.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setIsLoading(true);
    try {
      onSubmit({ passengers, boardingPoint, droppingPoint });
      toast({
        title: 'Success',
        description: 'Passenger details submitted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred while submitting passenger details.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="lg" color="red.600" mb={2}>
            Passenger Details
          </Heading>
          <Text color="gray.600">
            Fill in the details for {selectedSeats.length} selected seat(s)
          </Text>
        </Box>

        <Divider />

        {/* Boarding & Dropping Points */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>
                <HStack>
                  <Icon as={FaLocationArrow} color="green.500" />
                  <Text>Boarding Point</Text>
                </HStack>
              </FormLabel>
              <Select
                placeholder="Select boarding point"
                value={boardingPoint}
                onChange={(e) => setBoardingPoint(e.target.value)}
                icon={<FaBusAlt />}
              >
                {bus.boardingPoints.map(point => (
                  <option key={`boarding-${point.id}`} value={point.id}>
                    {point.name} - {point.time}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>
                <HStack>
                  <Icon as={FaMapPin} color="red.500" />
                  <Text>Dropping Point</Text>
                </HStack>
              </FormLabel>
              <Select
                placeholder="Select dropping point"
                value={droppingPoint}
                onChange={(e) => setDroppingPoint(e.target.value)}
                icon={<FaMapMarkerAlt />}
              >
                {bus.droppingPoints.map(point => (
                  <option key={`dropping-${point.id}`} value={point.id}>
                    {point.name} - {point.time}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>
        </Grid>

        {/* Passenger Forms */}
        {passengers.map((passenger, index) => (
          <Box
            key={passenger.seatNumber}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.200"
            _hover={{ borderColor: "red.200" }}
          >
            <VStack spacing={4}>
              <HStack width="100%" justify="space-between">
                <Badge colorScheme="red" p={2} borderRadius="md">
                  <HStack>
                    <Icon as={FaBusAlt} />
                    <Text>Seat {passenger.seatNumber}</Text>
                  </HStack>
                </Badge>
                <Text color="gray.500">Passenger {index + 1}</Text>
              </HStack>

              <SimpleGrid columns={2} spacing={4} width="100%">
                <FormControl isRequired>
                  <FormLabel>
                    <HStack>
                      <Icon as={FaUser} color="blue.500" />
                      <Text>Full Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    placeholder="Enter full name"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Age</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter age"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>
                    <HStack>
                      <Icon as={FaPhoneAlt} color="green.500" />
                      <Text>Phone Number</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={passenger.phone}
                    onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>
                    <HStack>
                      <Icon as={FaEnvelope} color="purple.500" />
                      <Text>Email</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={passenger.email}
                    onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Gender</FormLabel>
                  <HStack>
                    <Select
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    >
                      <option key={`male-${index}`} value="male">Male</option>
                      <option key={`female-${index}`} value="female">Female</option>
                      <option key={`other-${index}`} value="other">Other</option>
                    </Select>
                    <Icon
                      as={
                        passenger.gender === 'male'
                          ? FaMale
                          : passenger.gender === 'female'
                          ? FaFemale
                          : FaWheelchair
                      }
                      color={
                        passenger.gender === 'male'
                          ? 'blue.400'
                          : passenger.gender === 'female'
                          ? 'pink.400'
                          : 'purple.400'
                      }
                      boxSize={5}
                    />
                  </HStack>
                </FormControl>
              </SimpleGrid>
            </VStack>
          </Box>
        ))}

        {/* Submit Button */}
        <Button
          colorScheme="red"
          size="lg"
          onClick={handleSubmit}
          leftIcon={<FaBusAlt />}
          isLoading={isLoading}
        >
          Proceed to Payment
        </Button>
      </VStack>
    </Box>
  );
};

export default PassengerDetails;