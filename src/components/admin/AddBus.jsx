import {
  Box,
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Grid,
  GridItem,
  IconButton,
  Text,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaPlus, FaTrash, FaClock, FaSnowflake, FaPlug, FaWifi, FaWater, FaPhone, FaFirstAid } from 'react-icons/fa';
import API_BASE_URL from '../../api';
import axios from 'axios';

const AddBus = ({ onSuccess }) => {
  const toast = useToast();
  const [busDetails, setBusDetails] = useState({
    busName: '',
    busNumber: '',
    busType: '',
    totalSeats: 30,
    availableSeats: 30,
    price: '',
    seaterPrice: '',
    sleeperPrice: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    journeyDuration: '',
    description: '',
    amenities: {
      hasAC: false,
      hasCharging: false,
      hasWifi: false,
      hasWater: false,
      hasEmergencyContact: false,
      hasFirstAid: false
    }
  });

  const [boardingPoints, setBoardingPoints] = useState([
    { name: '', time: '', id: Date.now() }
  ]);

  const [droppingPoints, setDroppingPoints] = useState([
    { name: '', time: '', id: Date.now() }
  ]);

  const handleBusDetailsChange = (field, value) => {
    setBusDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setBusDetails(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const handleAddBoardingPoint = () => {
    setBoardingPoints(prev => [...prev, { name: '', time: '', id: Date.now() }]);
  };

  const handleAddDroppingPoint = () => {
    setDroppingPoints(prev => [...prev, { name: '', time: '', id: Date.now() }]);
  };

  const handleBoardingPointChange = (index, field, value) => {
    const updatedPoints = [...boardingPoints];
    updatedPoints[index][field] = value;
    setBoardingPoints(updatedPoints);
  };

  const handleDroppingPointChange = (index, field, value) => {
    const updatedPoints = [...droppingPoints];
    updatedPoints[index][field] = value;
    setDroppingPoints(updatedPoints);
  };

  const handleRemoveBoardingPoint = (index) => {
    setBoardingPoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveDroppingPoint = (index) => {
    setDroppingPoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!busDetails.busName || !busDetails.busNumber || !busDetails.source || 
        !busDetails.destination || !busDetails.departureTime || !busDetails.arrivalTime ||
        !busDetails.journeyDuration) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate boarding and dropping points
    if (boardingPoints.some(point => !point.name || !point.time) ||
        droppingPoints.some(point => !point.name || !point.time)) {
      toast({
        title: 'Incomplete Points',
        description: 'Please fill in all boarding and dropping point details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const busData = {
        ...busDetails,
        boardingPoints: boardingPoints.map(({ id, ...point }) => point),
        droppingPoints: droppingPoints.map(({ id, ...point }) => point),
      };
      await axios.post(`${API_BASE_URL}/buses`, busData);
      toast({
        title: 'Success',
        description: 'Bus added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setBusDetails({
        busName: '',
        busNumber: '',
        busType: '',
        totalSeats: 30,
        availableSeats: 30,
        price: '',
        seaterPrice: '',
        sleeperPrice: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        journeyDuration: '',
        description: '',
        amenities: {
          hasAC: false,
          hasCharging: false,
          hasWifi: false,
          hasWater: false,
          hasEmergencyContact: false,
          hasFirstAid: false
        }
      });
      setBoardingPoints([{ name: '', time: '', id: Date.now() }]);
      setDroppingPoints([{ name: '', time: '', id: Date.now() }]);

      // Close modal
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || error.message || 'Failed to add bus',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="red.600">Add New Bus</Heading>
        
        {/* Basic Bus Details */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Bus Name</FormLabel>
              <Input
                placeholder="Enter bus name"
                value={busDetails.busName}
                onChange={(e) => handleBusDetailsChange('busName', e.target.value)}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Bus Number</FormLabel>
              <Input
                placeholder="Enter bus number"
                value={busDetails.busNumber}
                onChange={(e) => handleBusDetailsChange('busNumber', e.target.value)}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Bus Type</FormLabel>
              <Select
                placeholder="Select bus type"
                value={busDetails.busType}
                onChange={(e) => handleBusDetailsChange('busType', e.target.value)}
              >
                <option value="AC Seater">AC Seater</option>
                <option value="Non AC Seater">Non AC Seater</option>
                <option value="AC Sleeper">AC Sleeper</option>
                <option value="Non AC Sleeper">Non AC Sleeper</option>
                <option value="Deluxe Combo">Deluxe Combo</option>
              </Select>
            </FormControl>
          </GridItem>

          {busDetails.busType === 'Deluxe Combo' ? (
            <>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Seater Price (₹)</FormLabel>
                  <NumberInput
                    min={0}
                    value={busDetails.seaterPrice}
                    onChange={(value) => handleBusDetailsChange('seaterPrice', value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Sleeper Price (₹)</FormLabel>
                  <NumberInput
                    min={0}
                    value={busDetails.sleeperPrice}
                    onChange={(value) => handleBusDetailsChange('sleeperPrice', value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
            </>
          ) : (
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Price per Seat (₹)</FormLabel>
                <NumberInput
                  min={0}
                  value={busDetails.price}
                  onChange={(value) => handleBusDetailsChange('price', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>
          )}

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Total Seats</FormLabel>
              <NumberInput
                min={1}
                max={60}
                value={busDetails.totalSeats}
                onChange={(value) => handleBusDetailsChange('totalSeats', value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Available Seats</FormLabel>
              <NumberInput
                min={1}
                max={60}
                value={busDetails.availableSeats}
                onChange={(value) => handleBusDetailsChange('availableSeats', value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Journey Duration</FormLabel>
              <Input
                placeholder="e.g., 8 hrs"
                value={busDetails.journeyDuration}
                onChange={(e) => handleBusDetailsChange('journeyDuration', e.target.value)}
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Divider />

        {/* Route Details */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Source</FormLabel>
              <Input
                placeholder="Enter source location"
                value={busDetails.source}
                onChange={(e) => handleBusDetailsChange('source', e.target.value)}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Destination</FormLabel>
              <Input
                placeholder="Enter destination location"
                value={busDetails.destination}
                onChange={(e) => handleBusDetailsChange('destination', e.target.value)}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Departure Time</FormLabel>
              <Input
                type="time"
                value={busDetails.departureTime}
                onChange={(e) => handleBusDetailsChange('departureTime', e.target.value)}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Arrival Time</FormLabel>
              <Input
                type="time"
                value={busDetails.arrivalTime}
                onChange={(e) => handleBusDetailsChange('arrivalTime', e.target.value)}
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Divider />

        {/* Amenities Section */}
        <Box>
          <Heading size="md" mb={4}>Amenities</Heading>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
            <GridItem>
              <HStack>
                <Switch
                  isChecked={busDetails.amenities.hasAC}
                  onChange={() => handleAmenityChange('hasAC')}
                  colorScheme="blue"
                />
                <Icon as={FaSnowflake} color="blue.500" />
                <Text>AC</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Switch
                  isChecked={busDetails.amenities.hasCharging}
                  onChange={() => handleAmenityChange('hasCharging')}
                  colorScheme="green"
                />
                <Icon as={FaPlug} color="green.500" />
                <Text>Charging Point</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Switch
                  isChecked={busDetails.amenities.hasWifi}
                  onChange={() => handleAmenityChange('hasWifi')}
                  colorScheme="purple"
                />
                <Icon as={FaWifi} color="purple.500" />
                <Text>WiFi</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Switch
                  isChecked={busDetails.amenities.hasWater}
                  onChange={() => handleAmenityChange('hasWater')}
                  colorScheme="cyan"
                />
                <Icon as={FaWater} color="cyan.500" />
                <Text>Water Bottle</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Switch
                  isChecked={busDetails.amenities.hasEmergencyContact}
                  onChange={() => handleAmenityChange('hasEmergencyContact')}
                  colorScheme="red"
                />
                <Icon as={FaPhone} color="red.500" />
                <Text>Emergency Contact</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Switch
                  isChecked={busDetails.amenities.hasFirstAid}
                  onChange={() => handleAmenityChange('hasFirstAid')}
                  colorScheme="pink"
                />
                <Icon as={FaFirstAid} color="pink.500" />
                <Text>First Aid</Text>
              </HStack>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Boarding Points */}
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Heading size="md">Boarding Points</Heading>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="green"
              size="sm"
              onClick={handleAddBoardingPoint}
            >
              Add Point
            </Button>
          </HStack>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Point Name</Th>
                <Th>Time</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardingPoints.map((point, index) => (
                <Tr key={point.id}>
                  <Td>
                    <Input
                      placeholder="Enter point name"
                      value={point.name}
                      onChange={(e) => handleBoardingPointChange(index, 'name', e.target.value)}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="time"
                      value={point.time}
                      onChange={(e) => handleBoardingPointChange(index, 'time', e.target.value)}
                    />
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveBoardingPoint(index)}
                      isDisabled={boardingPoints.length === 1}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>

        <Divider />

        {/* Dropping Points */}
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Heading size="md">Dropping Points</Heading>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="green"
              size="sm"
              onClick={handleAddDroppingPoint}
            >
              Add Point
            </Button>
          </HStack>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Point Name</Th>
                <Th>Time</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {droppingPoints.map((point, index) => (
                <Tr key={point.id}>
                  <Td>
                    <Input
                      placeholder="Enter point name"
                      value={point.name}
                      onChange={(e) => handleDroppingPointChange(index, 'name', e.target.value)}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="time"
                      value={point.time}
                      onChange={(e) => handleDroppingPointChange(index, 'time', e.target.value)}
                    />
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveDroppingPoint(index)}
                      isDisabled={droppingPoints.length === 1}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>

        <Divider />

        {/* Description */}
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            placeholder="Enter bus description (optional)"
            value={busDetails.description}
            onChange={(e) => handleBusDetailsChange('description', e.target.value)}
          />
        </FormControl>

        {/* Submit Button */}
        <Button
          colorScheme="red"
          size="lg"
          onClick={handleSubmit}
        >
          Add Bus
        </Button>
      </VStack>
    </Box>
  );
};

export default AddBus; 