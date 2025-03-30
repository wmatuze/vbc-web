import womensSundayImage from "../events/womens-sunday.jpg";
import youthSundayImage from "../events/youth-sunday.jpg";
import redNightImage from "../events/red-night.jpg";
import fathersSundayImage from "../events/fathers-sunday.jpg";

const events = [
  {
    id: 1,
    title: "Youth Sunday",
    date: "March 30, 2025",
    time: "10:30 AM",
    description:
      "A service led by the youth to inspire and empower the next generation.",
    image: youthSundayImage,
    ministry: "Youth Ministry",
  },
  {
    id: 2,
    title: "Red Night (Good Friday Night of Worship)",
    date: "April 18, 2025",
    time: "7:00 PM",
    description: "A powerful night of worship and reflection on Good Friday.",
    image: redNightImage,
    ministry: "Praise Ministry", // Added ministry field - you can adjust this
  },
  {
    id: 3,
    title: "Father's Sunday", // Example of a general event
    date: "June 15, 2025",
    time: "10:30 PM",
    description:
      "A special Sunday dedicated to celebrating Fathers in the church.",
    image: fathersSundayImage,
    ministry: "Men's Ministry",
  },
  {
    id: 4,
    title: "General Church Event", // Example of a general event
    date: "May 1, 2025",
    time: "6:00 PM",
    description: "A general event for the whole church community.",
    image: null,
    ministry: "General", // Or "Church Wide", "All Ministries", etc.
  },
  {
    id: 5,
    title: "Women's Sunday",
    date: "March 9, 2025",
    time: "9:00 AM",
    description:
      "A special Sunday dedicated to celebrating women in the church.",
    image: womensSundayImage,
    ministry: "Women's Ministry", // Added ministry field
  },
];

export default events;
