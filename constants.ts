import { Product, User, UserRole, ApprovalStatus } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'TP-Link Archer AX73 AX5400 Dual-Band Gigabit Wi-Fi 6 Router',
    description: 'Gigabit Wi-Fi 6 Speed, Connect 200+ Devices, High-Power FEM, 6× Antennas, HomeShield.',
    price: 8999,
    category: 'Routers',
    stock: 45,
    image: 'https://m.media-amazon.com/images/I/71lzPkpQKuL._AC_UF1000,1000_QL80_.jpg',
    specs: { 'Speed': 'AX5400', 'Bands': 'Dual-Band', 'Ports': '4x Gigabit' }
  },
  {
    id: '2',
    name: 'D-Link DIR-615 Wireless N300 Router',
    description: 'Great for small homes. 300 Mbps speed, high-gain antennas for stable connection.',
    price: 999,
    category: 'Routers',
    stock: 120,
    image: 'https://www.multilink.in/product-images/DIR-615_Front.png/1886548000178886140/700x700',
    specs: { 'Speed': 'N300', 'Antennas': '2 External', 'Frequency': '2.4 GHz' }
  },
  {
    id: '3',
    name: 'Tenda N301 Wi-Fi Router',
    description: 'Easy setup, 300Mbps wireless speed ideal for interruption sensitive applications like HD video streaming.',
    price: 849,
    category: 'Routers',
    stock: 200,
    image: 'https://shop.broot.in/cdn/shop/products/TENDA_N301-N300_Wireless_Router_2.4_GHz_300_Mbps_580x.jpg?v=1755242068',
    specs: { 'Speed': '300 Mbps', 'Ports': '3 LAN, 1 WAN', 'Antennas': '2 Fixed' }
  },
  {
    id: '4',
    name: 'Asus RT-AX88U Pro AX6000 Dual Band WiFi 6 Router',
    description: '2.5G Port, Mobile Game Mode, AiMesh Support, Commercial-grade Security.',
    price: 22999,
    category: 'Routers',
    stock: 15,
    image: 'https://m.media-amazon.com/images/I/61gpbEsPY4L.jpg',
    specs: { 'Speed': 'AX6000', 'Processor': 'Quad-core', 'Gaming': 'Yes' }
  },
  {
    id: '5',
    name: 'Linksys Hydra Pro 6E Tri-Band Mesh WiFi 6E Router',
    description: 'Unleash the speed of 6GHz band for ultra-fast streaming and gaming.',
    price: 34999,
    category: 'Routers',
    stock: 8,
    image: 'https://m.media-amazon.com/images/I/41p1NkDRJmL.jpg',
    specs: { 'Bands': 'Tri-Band', 'Tech': 'WiFi 6E', 'Coverage': '2700 sq ft' }
  },
  {
    id: '6',
    name: 'Netgear Nighthawk RAXE500 12-Stream WiFi 6E Router',
    description: 'AXE11000 Tri-Band speed. The ultimate router for 8K streaming.',
    price: 49999,
    category: 'Routers',
    stock: 5,
    image: 'https://m.media-amazon.com/images/I/518ksJZHekL.jpg',
    specs: { 'Speed': 'AXE11000', 'Streams': '12', 'Port': '2.5G Ethernet' }
  },
  {
    id: '7',
    name: 'Ubiquiti UniFi Dream Machine',
    description: 'All-in-one enterprise network appliance for small to medium-sized businesses.',
    price: 28500,
    category: 'Enterprise',
    stock: 20,
    image: 'https://m.media-amazon.com/images/I/41m4cL2tECL.jpg',
    specs: { 'Type': 'Console', 'WiFi': 'AC Wave 2', 'Security': 'IPS/IDS' }
  },
  {
    id: '8',
    name: 'Cisco CBS350 Managed Switch',
    description: '24-Port Gigabit Managed Switch with 4x 10G SFP+ uplinks. Enterprise grade reliability.',
    price: 42000,
    category: 'Switches',
    stock: 10,
    image: 'https://m.media-amazon.com/images/I/715rKWUr8mL._AC_UF1000,1000_QL80_.jpg',
    specs: { 'Ports': '24x 1G', 'Uplink': '4x 10G SFP+', 'Layer': '3' }
  },
  {
    id: '9',
    name: 'TP-Link TL-SG108 8-Port Gigabit Desktop Switch',
    description: 'Steel Case, Plug and Play. Reliable data transfer for home and office.',
    price: 1699,
    category: 'Switches',
    stock: 80,
    image: 'https://m.media-amazon.com/images/I/518uC+XyEEL._AC_UF1000,1000_QL80_.jpg',
    specs: { 'Ports': '8x Gigabit', 'Case': 'Metal', 'Type': 'Unmanaged' }
  },
  {
    id: '10',
    name: 'D-Link DGS-1024D 24-Port Gigabit Switch',
    description: 'Rackmount capable, energy efficient unmanaged switch.',
    price: 6500,
    category: 'Switches',
    stock: 25,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8eFRZ0Rg7EGZQGPGX0NoBaVyPeU2eVDHwtw&s',
    specs: { 'Ports': '24x Gigabit', 'Mount': 'Rack', 'Green': 'Yes' }
  },
  {
    id: '11',
    name: 'D-Link Cat6 UTP Cable Bundle (305m)',
    description: 'High quality solid copper UTP cable for structured cabling systems. Grey color.',
    price: 7200,
    category: 'Cables',
    stock: 50,
    image: 'https://networkitstore.in/wp-content/uploads/2021/09/CAT6305-ARMOURED-2.jpg',
    specs: { 'Length': '305m', 'AWG': '23', 'Material': 'Pure Copper' }
  },
  {
    id: '12',
    name: 'AmazonBasics RJ45 Cat-6 Ethernet Patch Cable',
    description: 'High-speed internet cable - 5 Feet (1.5 Meters), Pack of 5.',
    price: 499,
    category: 'Cables',
    stock: 200,
    image: 'https://m.media-amazon.com/images/I/71xKLbOyjvL.jpg',
    specs: { 'Count': '5', 'Length': '1.5m', 'Color': 'Black' }
  },
  {
    id: '13',
    name: 'TP-Link Deco X20 AX1800 Mesh Wi-Fi 6 (3-Pack)',
    description: 'Whole Home Mesh Wi-Fi 6 System. Cover up to 5800 sq ft. Seamless Roaming.',
    price: 16999,
    category: 'Mesh Systems',
    stock: 30,
    image: 'https://m.media-amazon.com/images/I/41Yzfj97ROL._AC_UF1000,1000_QL80_.jpg',
    specs: { 'Speed': 'AX1800', 'Units': '3', 'Capacity': '150+ devices' }
  },
  {
    id: '14',
    name: 'Netgear Orbi RBK752 Tri-band Mesh WiFi 6',
    description: 'Coverage up to 3750 sq. ft. and 40+ devices. High performance backhaul.',
    price: 24999,
    category: 'Mesh Systems',
    stock: 12,
    image: 'https://m.media-amazon.com/images/I/41HUljzFMoL._AC_UF1000,1000_QL80_.jpg',
    specs: { 'Speed': 'AX4200', 'Units': '2', 'Bands': 'Tri-Band' }
  },
  {
    id: '15',
    name: 'Synology DiskStation DS923+ NAS',
    description: '4-Bay DiskStation, Ryzen R1600 CPU. Powerful storage platform for small businesses.',
    price: 54999,
    category: 'Storage',
    stock: 5,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2X3AbB6MuBDuk5oTLT_V5wzewHmWOE9Q-Uw&s',
    specs: { 'Bays': '4', 'Expandable': 'Yes', 'RAM': '4GB ECC' }
  },
  {
    id: '16',
    name: 'Tenda O3 5km Outdoor Point To Point CPE',
    description: '5km Outdoor Point To Point CPE 2.4GHz 150Mbps.',
    price: 2400,
    category: 'Access Points',
    stock: 60,
    image: 'https://m.media-amazon.com/images/I/61kz5nwv2UL._AC_UF1000,1000_QL80_.jpg',
    specs: { 'Range': '5km', 'Freq': '2.4GHz', 'Usage': 'Outdoor' }
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'mann_admin',
    name: 'Mann',
    email: 'mann@strike.com',
    role: UserRole.ADMIN,
    password: 'mann123',
    approvalStatus: ApprovalStatus.APPROVED
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@netsmart.com',
    role: UserRole.ADMIN,
    password: 'password123',
    approvalStatus: ApprovalStatus.APPROVED
  },
  {
    id: 'customer1',
    name: 'Rahul Sharma',
    email: 'customer@test.com',
    role: UserRole.CUSTOMER,
    password: 'password123',
    approvalStatus: ApprovalStatus.APPROVED
  },
  {
    id: 'retailer1',
    name: 'Tech World India',
    email: 'retailer@test.com',
    role: UserRole.RETAILER,
    businessName: 'Tech World India Pvt Ltd',
    address: 'Nehru Place, New Delhi',
    password: 'password123',
    approvalStatus: ApprovalStatus.PENDING
  }
];

export const WHOLESALE_DISCOUNT = 0.30; // 30% off for retailers
export const RETAILER_MIN_QUANTITY = 6; // Minimum quantity for retailers (More than 5)