import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  HStack
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaUserShield } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    securityCode: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email: formData.email,
        password: formData.password,
        securityCode: 'Dkimp@2005'
      });

      if (response.data) {
        localStorage.setItem('admin', JSON.stringify(response.data));
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setErrors({
        email: error.response?.data?.message || 'Invalid credentials',
        password: error.response?.data?.message || 'Invalid credentials'
      });
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Box
        py={{ base: '8', sm: '12' }}
        px={{ base: '4', sm: '10' }}
        bg="white"
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <VStack spacing="8">
          <Heading size="lg">Admin Login</Heading>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing="6" align="stretch">
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Security Code</FormLabel>
                <InputGroup>
                  <Input
                    type={showSecurityCode ? 'text' : 'password'}
                    value={formData.securityCode}
                    onChange={(e) => setFormData({ ...formData, securityCode: e.target.value })}
                    placeholder="Enter security code"
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => setShowSecurityCode(!showSecurityCode)}
                      size="sm"
                      aria-label={showSecurityCode ? 'Hide security code' : 'Show security code'}
                    >
                      {showSecurityCode ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="red"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                width="100%"
                leftIcon={<FaUserShield />}
              >
                Login as Admin
              </Button>
            </VStack>
          </form>

          <Text textAlign="center">
            Don't have an admin account?{' '}
            <Link as={RouterLink} to="/admin/signup" color="red.500" fontWeight="semibold">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default AdminLogin; 