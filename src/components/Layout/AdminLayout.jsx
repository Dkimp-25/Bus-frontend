import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Text,
  Link,
  Icon
} from '@chakra-ui/react';
import { AddIcon, TimeIcon, LockIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaUser, FaUserShield, FaBus, FaSignInAlt } from 'react-icons/fa';
import AddBus from '../admin/AddBus';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const admin = JSON.parse(localStorage.getItem('admin'));

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box as="nav" bg="red.600" boxShadow="md" py={4} width="100%">
        <Container maxW="1200px" mx="auto">
          <Flex align="center" justify="space-between">
            <Link as={RouterLink} to="/admin/dashboard" _hover={{ textDecoration: 'none' }}>
              <HStack spacing={2}>
                <Icon as={FaBus} boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold">
              DK Bus Travels - Admin
                </Text>
              </HStack>
            </Link>
            <Flex gap={4}>
              {admin ? (
                <>
              <Button
                leftIcon={<AddIcon />}
                variant="ghost"
                color="white"
                onClick={onOpen}
                _hover={{ bg: 'red.700' }}
              >
                Add Bus
              </Button>
              <Button
                leftIcon={<TimeIcon />}
                variant="ghost"
                color="white"
                onClick={() => navigate('/admin/booking-history')}
                _hover={{ bg: 'red.700' }}
              >
                Booking History
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
                      {admin.username || 'Admin'}
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
                    <MenuItem onClick={() => navigate('/client/login')} icon={<FaUser />} color="red.600">
                      Client Login
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/admin/login')} icon={<FaUserShield />} color="red.600">
                      Admin Login
                    </MenuItem>
                </MenuList>
              </Menu>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Add Bus Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent maxW="1200px">
          <ModalHeader>Add New Bus</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <AddBus onSuccess={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

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
        <Outlet context={{ openAddBusModal: onOpen }} />
      </Container>
    </Box>
  );
};

export default AdminLayout; 