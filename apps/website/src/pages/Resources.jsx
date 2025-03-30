import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBook, FaUsers, FaChalkboardTeacher, FaBible } from "react-icons/fa"; // Icons

const resources = [
  {
    path: "/resources/foundation-class",
    title: "Foundation Class",
    description: "Learn the core beliefs of our church",
    icon: <FaBook className="text-blue-600 dark:text-blue-300 text-4xl" />,
  },
  {
    path: "/resources/leadership-training",
    title: "Leadership Training",
    description: "Grow as a leader in ministry",
    icon: <FaUsers className="text-green-600 dark:text-green-300 text-4xl" />,
  },
  {
    path: "/resources/discipleship",
    title: "Discipleship Program",
    description: "Deepen your faith and walk with Christ",
    icon: <FaChalkboardTeacher className="text-purple-600 dark:text-purple-300 text-4xl" />,
  },
  {
    path: "/resources/bible-study",
    title: "Bible Study Guides",
    description: "Explore scripture with structured lessons",
    icon: <FaBible className="text-yellow-600 dark:text-yellow-300 text-4xl" />,
  },
];

const ResourceCard = ({ resource, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="h-full"
  >
    <Link
      to={resource.path}
      className="group block h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 p-6 flex flex-col items-center text-center"
    >
      <div className="mb-4">{resource.icon}</div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-blue-600">
        {resource.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
        {resource.description}
      </p>
    </Link>
  </motion.div>
);

const Resources = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Church Resources
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore foundational materials and leadership resources to deepen your faith.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {resources.map((resource, index) => (
          <ResourceCard key={resource.path} resource={resource} index={index} />
        ))}
      </div>
    </motion.div>
  </div>
);

export default Resources;
