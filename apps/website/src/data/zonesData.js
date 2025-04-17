// Sample data for church zones
// In a production environment, this would come from an API or database

// We'll use string identifiers for icons instead of React components

const zonesData = [
  {
    id: "zone1",
    name: "Central Zone",
    description:
      "Covering the central areas of Kitwe including CBD and surrounding neighborhoods.",
    elder: {
      name: "Elder James Mwanza",
      title: "Zone Elder",
      image: "/assets/elders/elder1.jpg",
      bio: "Serving as an elder for 8 years, James has a passion for discipleship and community building.",
      contact: "james.mwanza@example.com",
      phone: "+260 97 1234567",
    },
    location: "Kitwe Central",
    iconName: "FaUsers",
    cellCount: 5,
    coverImage: "/assets/zones/central-zone.jpg",
  },
  {
    id: "zone2",
    name: "Northern Zone",
    description:
      "Serving the northern communities of Kitwe including Riverside and Parklands areas.",
    elder: {
      name: "Elder Sarah Banda",
      title: "Zone Elder",
      image: "/assets/elders/elder2.jpg",
      bio: "With a background in counseling, Sarah leads the Northern Zone with compassion and wisdom.",
      contact: "sarah.banda@example.com",
      phone: "+260 97 7654321",
    },
    location: "Kitwe North",
    iconName: "FaHome",
    cellCount: 4,
    coverImage: "/assets/zones/northern-zone.jpg",
  },
  {
    id: "zone3",
    name: "Eastern Zone",
    description:
      "Covering the eastern regions of Kitwe including Chamboli and Chimwemwe areas.",
    elder: {
      name: "Elder David Mutale",
      title: "Zone Elder",
      image: "/assets/elders/elder3.jpg",
      bio: "David has been serving in church leadership for over a decade with a focus on family ministry.",
      contact: "david.mutale@example.com",
      phone: "+260 96 8765432",
    },
    location: "Kitwe East",
    iconName: "FaHeart",
    cellCount: 6,
    coverImage: "/assets/zones/eastern-zone.jpg",
  },
  {
    id: "zone4",
    name: "Southern Zone",
    description:
      "Serving the southern communities of Kitwe including Nkana East and Nkana West.",
    elder: {
      name: "Elder Ruth Chanda",
      title: "Zone Elder",
      image: "/assets/elders/elder4.jpg",
      bio: "Ruth specializes in youth mentorship and has been instrumental in growing the Southern Zone.",
      contact: "ruth.chanda@example.com",
      phone: "+260 95 1234567",
    },
    location: "Kitwe South",
    iconName: "FaHandsHelping",
    cellCount: 3,
    coverImage: "/assets/zones/southern-zone.jpg",
  },
  {
    id: "zone5",
    name: "Western Zone",
    description:
      "Covering the western areas of Kitwe including Mindolo and surrounding neighborhoods.",
    elder: {
      name: "Elder Michael Tembo",
      title: "Zone Elder",
      image: "/assets/elders/elder5.jpg",
      bio: "Michael brings years of experience in church planting and community outreach to the Western Zone.",
      contact: "michael.tembo@example.com",
      phone: "+260 96 9876543",
    },
    location: "Kitwe West",
    iconName: "FaPray",
    cellCount: 4,
    coverImage: "/assets/zones/western-zone.jpg",
  },
  {
    id: "zone6",
    name: "Campus Zone",
    description:
      "Dedicated to serving students and staff at the Copperbelt University and surrounding institutions.",
    elder: {
      name: "Elder Grace Mulenga",
      title: "Zone Elder",
      image: "/assets/elders/elder6.jpg",
      bio: "Grace has a heart for students and young professionals, leading the Campus Zone with energy and vision.",
      contact: "grace.mulenga@example.com",
      phone: "+260 97 8765432",
    },
    location: "CBU Campus Area",
    iconName: "FaBible",
    cellCount: 5,
    coverImage: "/assets/zones/campus-zone.jpg",
  },
];

export default zonesData;
