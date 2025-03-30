// leaders.js
import bishMain from "../leadership/bishop-main.jpg";
import placeholderImage from "../leadership/placeholder.jpg";

const leaders = [
  {
    id: "bishop-cyrus",
    name: "Bishop Cyrus Simwanza",
    title: "Senior Pastor",
    Image: bishMain,
    bio: "With over 20 years of ministry experience, Bishop Cyrus leads our congregation with a heart for community transformation. His passionate teaching bridges biblical wisdom with contemporary life challenges, inspiring members to live out their faith authentically.",
    email: "pastor.john@victorybc.org",
    ministryFocus: ["Discipleship", "Community Outreach", "Spiritual Growth"],
    socialMedia: {
      facebook: "https://facebook.com/bishopname",
      twitter: "https://twitter.com/bishopname",
    },
    order: 1,
  },
  {
    id: "pst-chris",
    name: "Pastor Chris Chipasha",
    title: "Worship Director",
    Image: placeholderImage, // Use a placeholder until real image is available
    bio: "A gifted musician and worship leader, Pastor creates transformative worship experiences that draw people closer to God. His vision is to cultivate a culture of genuine worship that transcends musical performance.",
    email: "worship@victorybc.org",
    ministryFocus: ["Worship Arts", "Music Ministry", "Creative Expressions"],
    order: 2,
  },
  {
    id: "rev-jaylo",
    name: "Rev Jayne Walamba",
    title: "Youth Pastor",
    Image: placeholderImage, // Use a placeholder until real image is available
    bio: "Passionate about empowering the next generation, Rev Jayne leads our youth and young adult ministries with energy and purpose. She designs relevant programs that help young people navigate faith in a complex world.",
    email: "youth@victorybc.org",
    ministryFocus: [
      "Youth Discipleship",
      "Leadership Development",
      "Campus Ministry",
    ],
    order: 3,
  },
  // Add more leaders as needed
];

// Sort leaders by order property to ensure consistent display
const sortedLeaders = [...leaders].sort(
  (a, b) => (a.order || 99) - (b.order || 99)
);

export default sortedLeaders;
