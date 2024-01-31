const events = [
  {
    id: 1,
    title: "ECHO BASE B2B LUNAR GROOVE | MOON TIDES",
    startDate: "February 5, 2024",
    endDate: "February 6, 2024",
    buttonLabel: "SELECT TICKETS",
    price: 20,
    description: "Come join us this Saturday for an electric night under the stars. Echo Base and Lunar Groove present 'Moon Tides' - a mesmerizing music experience that will transport you to another world. Get ready to dance and groove to the cosmic beats.",
    quantity: 100 
  },
  {
    id: 2,
    title: "SOLAR WAVE B2B HORIZON SHIFT",
    startDate: "February 10, 2024",
    endDate: "February 11, 2024",
    buttonLabel: "SELECT TICKETS",
    price: 50,
    description: "Get ready to ride the Solar Wave and shift your horizon. Join us on a musical journey that transcends boundaries. Solar Wave and Horizon Shift combine forces for an unforgettable night filled with stunning visuals and mind-bending beats.",
    quantity: 75 
  },
  {
    id: 3,
    title: "NEBULA BEATS B2B STAR DUST",
    startDate: "February 15, 2024",
    endDate: "February 16, 2024",
    buttonLabel: "SELECT TICKETS",
    price: 35,
    description: "Step into the cosmic realm with Nebula Beats and Star Dust. Dive deep into the pulsating melodies and feel the stardust enveloping you. This interstellar event promises a night of celestial dance and rhythm.",
    quantity: 90 
  },
  {
    id: 4,
    title: "GALACTIC RHYTHM B2B COSMIC FLOW",
    startDate: "February 20, 2024",
    endDate: "February 21, 2024",
    buttonLabel: "SELECT TICKETS",
    price: 40,
    description: "Experience the Galactic Rhythm merging with the Cosmic Flow. Immerse yourself in the harmony of the universe with pulsating beats and rhythmic vibrations. This event will take you on a journey through the galaxies.",
    quantity: 80 
  },
  {
    id: 5,
    title: "PULSE VIBES B2B ECHOIC WAVES",
    startDate: "February 25, 2024",
    endDate: "February 26, 2024",
    buttonLabel: "SELECT TICKETS",
    price: 25,
    description: "Feel the Pulse Vibes resonating with Echoic Waves. Join us for an evening filled with energetic rhythms and electrifying vibes. This event promises an unforgettable dance experience.",
    quantity: 120 
  },
  {
    id: 6,
    title: "DEEP SONIC B2B TREMOR TUNES",
    startDate: "March 1, 2024",
    endDate: "March 2, 2024",
    buttonLabel: "SELECT TICKETS",
    price: 19,
    description: "Dive into the depths of sound with Deep Sonic and Tremor Tunes. This event will take you on a sonic journey like no other. Get ready to explore the depths of bass and rhythm.",
    quantity: 60 
  }
];


  const reservations = [
    {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "123-456-7890",
      ticketId: 1, 
    },
    {
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      phoneNumber: "234-567-8901",
      ticketId: 2,
    },
    {
      fullName: "Alex Johnson",
      email: "alex.johnson@example.com",
      phoneNumber: "345-678-9012",
      ticketId: 3,
    },
    {
      fullName: "Emily Davis",
      email: "emily.davis@example.com",
      phoneNumber: "456-789-0123",
      ticketId: 4,
    },
    {
      fullName: "Michael Brown",
      email: "michael.brown@example.com",
      phoneNumber: "567-890-1234",
      ticketId: 5,
    }
  ];
  
  module.exports = { events, reservations };
  