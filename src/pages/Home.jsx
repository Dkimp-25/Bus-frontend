import { Box, Container, Text, Button, VStack, Heading, SimpleGrid, Icon, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaBus, FaMapMarkedAlt, FaClock, FaUserShield } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="100%" centerContent>
      {/* Hero Section */}
      <Box textAlign="center" mb={{ base: 8, md: 12 }} w="100%" overflow="hidden">
        <Heading
          as="h1"
          size="2xl"
          fontWeight="700"
          mb={4}
          color="red.600"
          className="running-text-left"
        >
          DK Bus Travels
        </Heading>
        <Text
          fontSize="xl"
          color="gray.600"
          mx="auto"
          lineHeight="1.5"
          mb={8}
          maxW="800px"
          className="running-text-right"
        >
          Your trusted partner for comfortable and reliable bus travel across the country
        </Text>
        <Button
          colorScheme="red"
          size="lg"
          onClick={() => navigate('/search')}
          mb={4}
        >
          Search Buses
        </Button>
      </Box>

      {/* Features Section */}
      <Box w="100%" py={10}>
        <Heading as="h2" size="xl" textAlign="center" mb={8}>
          Why Choose DK Bus Travels?
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <Box textAlign="center" p={6} borderRadius="lg" boxShadow="md" bg="white" className="pop-up-box">
            <Icon as={FaBus} w={10} h={10} color="red.500" mb={4} />
            <Heading as="h3" size="md" mb={2}>Modern Fleet</Heading>
            <Text color="gray.600">Travel in comfort with our modern, well-maintained buses</Text>
          </Box>
          <Box textAlign="center" p={6} borderRadius="lg" boxShadow="md" bg="white" className="pop-up-box">
            <Icon as={FaMapMarkedAlt} w={10} h={10} color="red.500" mb={4} />
            <Heading as="h3" size="md" mb={2}>Extensive Network</Heading>
            <Text color="gray.600">Connect to hundreds of destinations across the country</Text>
          </Box>
          <Box textAlign="center" p={6} borderRadius="lg" boxShadow="md" bg="white" className="pop-up-box">
            <Icon as={FaClock} w={10} h={10} color="red.500" mb={4} />
            <Heading as="h3" size="md" mb={2}>Punctual Service</Heading>
            <Text color="gray.600">We value your time with our punctual departure and arrival</Text>
          </Box>
          <Box textAlign="center" p={6} borderRadius="lg" boxShadow="md" bg="white" className="pop-up-box">
            <Icon as={FaUserShield} w={10} h={10} color="red.500" mb={4} />
            <Heading as="h3" size="md" mb={2}>Safe Travel</Heading>
            <Text color="gray.600">Your safety is our top priority with experienced drivers</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Login/Signup Section */}
      <Box w="100%" py={10} textAlign="center">
        <Heading as="h2" size="xl" mb={6}>
          Join DK Bus Travels
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={8} maxW="800px" mx="auto">
          Create an account to book tickets, manage your bookings, and enjoy exclusive offers
        </Text>
        <HStack spacing={4} justify="center">
          <Button
            colorScheme="red"
            size="lg"
            onClick={() => navigate('/client/login')}
            px={8}
          >
            Client Login
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            size="lg"
            onClick={() => navigate('/client/signup')}
            px={8}
          >
            Client Signup
          </Button>
        </HStack>
        <Text mt={6} color="gray.500">
          Are you an admin?{' '}
          <Button
            variant="link"
            colorScheme="red"
            onClick={() => navigate('/admin/login')}
          >
            Login here
          </Button>
        </Text>
      </Box>

      {/* Contact Details Section */}
      <Box w="100%" py={10} bg="gray.50">
        <Container maxW="container.lg">
          <Heading as="h2" size="xl" textAlign="center" mb={8}>
            Contact Our Travel Agents
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
              <VStack align="start" spacing={3}>
                <Heading as="h3" size="md" color="red.600">
                  Main Office
                </Heading>
                <Text><strong>Address:</strong> 123 Bus Terminal Road, Chennai, Tamil Nadu - 600001</Text>
                <Text><strong>Phone:</strong> +91 98765 43210</Text>
                <Text><strong>Email:</strong> info@dkbustravels.com</Text>
                <Text><strong>Hours:</strong> 24/7 Customer Support</Text>
              </VStack>
            </Box>
            <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
              <VStack align="start" spacing={3}>
                <Heading as="h3" size="md" color="red.600">
                  Branch Office
                </Heading>
                <Text><strong>Address:</strong> 456 Transport Nagar, Coimbatore, Tamil Nadu - 641018</Text>
                <Text><strong>Phone:</strong> +91 98765 43211</Text>
                <Text><strong>Email:</strong> coimbatore@dkbustravels.com</Text>
                <Text><strong>Hours:</strong> Mon-Sat: 9:00 AM - 9:00 PM</Text>
              </VStack>
            </Box>
          </SimpleGrid>
          <Box textAlign="center" mt={8}>
            <Text fontSize="lg" fontWeight="bold" color="red.600">
              24/7 Emergency Helpline: 1800-123-4567 (Toll Free)
            </Text>
          </Box>
        </Container>
      </Box>
    </Container>
  );
};

export default Home;