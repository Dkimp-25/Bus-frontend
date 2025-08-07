import { Box, VStack, HStack, Text, Badge, Button, Divider, Icon, Tooltip, useDisclosure } from '@chakra-ui/react';
import { FaSnowflake, FaPlug, FaWifi, FaWater, FaPhone, FaFirstAid, FaInfoCircle, FaClock, FaBus } from 'react-icons/fa';

const AvailableBuses = ({ bus, onSelectBus, bookedSeatsCount }) => {
  const { isOpen, onToggle } = useDisclosure();

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // If it's already in HH:mm format, just return or format to AM/PM
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      const [hour, minute] = timeString.split(':');
      const date = new Date();
      date.setHours(Number(hour), Number(minute));
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    // Try parsing as ISO string
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    // Fallback: return as-is
    return timeString;
  };

  const amenityColors = {
    hasAC: "blue.500",
    hasCharging: "green.500",
    hasWifi: "purple.500",
    hasWater: "cyan.500",
    hasEmergencyContact: "red.500",
    hasFirstAid: "pink.500"
  };

  const AmenityIcon = ({ icon, label, isAvailable, colorKey }) => (
    <Tooltip label={label}>
      <Box opacity={isAvailable ? 1 : 0.3}>
        <Icon 
          as={icon} 
          color={isAvailable ? amenityColors[colorKey] : "gray.400"} 
          w={5} 
          h={5} 
        />
      </Box>
    </Tooltip>
  );

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      mb={4}
      bg="white"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={4}>
        {/* Bus Header */}
        <HStack justify="space-between" wrap="wrap">
          <VStack align="start" spacing={1}>
            <Text fontSize="xl" fontWeight="bold">{bus.busName}</Text>
            <HStack spacing={2}>
              <Badge colorScheme="red">{bus.busType}</Badge>
            </HStack>
          </VStack>
          <VStack align="end" spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color="red.600">₹{bus.price}</Text>
            <Text fontSize="sm" color="gray.600">{bus.totalSeats - (bookedSeatsCount || 0)} seats left</Text>
          </VStack>
        </HStack>

        {/* Bus Number */}
        <HStack>
          <Icon as={FaBus} color="gray.500" />
          <Text color="gray.600">Bus No: {bus.busNumber}</Text>
        </HStack>

        {/* Time and Duration */}
        <HStack justify="space-between">
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold">{formatTime(bus.departureTime)}</Text>
            <Text fontSize="sm" color="gray.600">{bus.source}</Text>
          </VStack>
          <VStack align="center" spacing={0}>
            <Icon as={FaClock} color="gray.400" />
            <Text fontSize="sm" color="gray.600">{bus.journeyDuration}</Text>
          </VStack>
          <VStack align="end" spacing={0}>
            <Text fontSize="lg" fontWeight="bold">{formatTime(bus.arrivalTime)}</Text>
            <Text fontSize="sm" color="gray.600">{bus.destination}</Text>
          </VStack>
        </HStack>

        {/* Amenities */}
        <HStack spacing={4} justify="center">
          <AmenityIcon icon={FaSnowflake} label="AC" isAvailable={bus.amenities?.hasAC} colorKey="hasAC" />
          <AmenityIcon icon={FaPlug} label="Charging Point" isAvailable={bus.amenities?.hasCharging} colorKey="hasCharging" />
          <AmenityIcon icon={FaWifi} label="WiFi" isAvailable={bus.amenities?.hasWifi} colorKey="hasWifi" />
          <AmenityIcon icon={FaWater} label="Water Bottle" isAvailable={bus.amenities?.hasWater} colorKey="hasWater" />
          <AmenityIcon icon={FaPhone} label="Emergency Contact" isAvailable={bus.amenities?.hasEmergencyContact} colorKey="hasEmergencyContact" />
          <AmenityIcon icon={FaFirstAid} label="First Aid" isAvailable={bus.amenities?.hasFirstAid} colorKey="hasFirstAid" />
        </HStack>

        <Divider />

        {/* Actions */}
        <HStack justify="space-between" align="center">
          <Button
            leftIcon={<FaInfoCircle />}
            variant="ghost"
            size="sm"
            onClick={onToggle}
          >
            View Details
          </Button>
          <Button
            colorScheme="red"
            onClick={() => onSelectBus(bus)}
            isDisabled={bus.availableSeats === 0}
          >
            Select Seats
          </Button>
        </HStack>

        {/* Expandable Details */}
        {isOpen && (
          <VStack align="stretch" spacing={4} pt={2}>
            <Divider />
            <Box>
              <Text fontWeight="bold" mb={2}>Boarding Points:</Text>
              <VStack align="start" spacing={1}>
                {bus.boardingPoints?.map(point => (
                  <HStack key={point.id} spacing={4}>
                    <Text color="gray.600" fontSize="sm">{point.time}</Text>
                    <Text fontSize="sm">{point.name}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>Dropping Points:</Text>
              <VStack align="start" spacing={1}>
                {bus.droppingPoints?.map(point => (
                  <HStack key={point.id} spacing={4}>
                    <Text color="gray.600" fontSize="sm">{point.time}</Text>
                    <Text fontSize="sm">{point.name}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
            {bus.description && (
              <Box>
                <Text fontWeight="bold" mb={2}>Bus Description:</Text>
                <Text color="gray.600">{bus.description}</Text>
              </Box>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default AvailableBuses; 