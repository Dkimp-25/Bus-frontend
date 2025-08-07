import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Link, Button, Menu, MenuButton, MenuList, MenuItem, Icon, Text, HStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaUser, FaBus, FaTicketAlt, FaSignInAlt, FaUserShield } from 'react-icons/fa';

const MainLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box bg="red.600" color="white" py={4} width="100%">
        <Container maxW="1200px" mx="auto">
          <Flex justify="space-between" align="center">
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <HStack spacing={2}>
                <Icon as={FaBus} boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold">
                  DK Bus Travels
                </Text>
              </HStack>
            </Link>

            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/search"
                leftIcon={<FaBus />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'red.500' }}
              >
                Search Buses
              </Button>

              {user ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/bookings"
                    leftIcon={<FaTicketAlt />}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'red.500' }}
                  >
                    My Bookings
                  </Button>

                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<FaUser />}
                      variant="outline"
                      color="white"
                      _hover={{ bg: 'red.500' }}
                      _active={{ bg: 'red.500' }}
                    >
                      {user.name || 'User'}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={handleLogout} icon={<FaSignInAlt />} color="red.600">
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FaUser />}
                    variant="outline"
                    color="white"
                    _hover={{ bg: 'red.500' }}
                    _active={{ bg: 'red.500' }}
                  >
                    Login
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to="/client/login" icon={<FaUser />} color="red.600">
                      Client Login
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/admin/login" icon={<FaUserShield />} color="red.600">
                      Admin Login
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container
        maxW="1200px"
        mt={{ base: 4, md: 8 }}
        mb={{ base: 4, md: 6 }}
        flex="1"
        display="flex"
        flexDirection="column"
        px={{ base: 4, md: 8 }}
        mx="auto"
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;