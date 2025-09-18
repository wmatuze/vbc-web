const models = require("../models");

// Seed discipleship classes and sessions
const seedDiscipleshipData = async () => {
  try {
    console.log("Seeding discipleship data...");

    // Check if discipleship classes already exist
    const classCount = await models.DiscipleshipClass.countDocuments();
    
    if (classCount === 0) {
      console.log("Creating discipleship classes...");

      // Create discipleship classes
      const discipleshipClasses = [
        {
          title: "Growing in Christ",
          description: "A comprehensive 8-week program designed to help new believers establish a strong foundation in their faith and develop healthy spiritual disciplines.",
          duration: { value: 8, unit: 'weeks' },
          level: 'beginner',
          prerequisites: ['Foundation Classes'],
          curriculum: [
            { week: 1, title: 'Understanding Your New Identity', description: 'Discovering who you are in Christ', topics: ['Identity in Christ', 'New Creation', 'God\'s Love'] },
            { week: 2, title: 'Prayer and Communication with God', description: 'Learning to pray effectively', topics: ['Types of Prayer', 'Prayer Life', 'Listening to God'] },
            { week: 3, title: 'Bible Study Methods', description: 'How to study the Bible on your own', topics: ['Bible Reading Plans', 'Study Tools', 'Application'] },
            { week: 4, title: 'The Holy Spirit\'s Role', description: 'Understanding the Holy Spirit\'s work in your life', topics: ['Gifts of the Spirit', 'Fruit of the Spirit', 'Being Led by the Spirit'] },
            { week: 5, title: 'Christian Community', description: 'The importance of fellowship and accountability', topics: ['Church Family', 'Accountability', 'Serving Others'] },
            { week: 6, title: 'Sharing Your Faith', description: 'How to share the gospel with others', topics: ['Personal Testimony', 'Gospel Presentation', 'Overcoming Fear'] },
            { week: 7, title: 'Dealing with Temptation', description: 'Biblical strategies for overcoming sin', topics: ['Understanding Temptation', 'Biblical Resistance', 'Finding Freedom'] },
            { week: 8, title: 'Your Next Steps', description: 'Planning your continued spiritual growth', topics: ['Leadership Opportunities', 'Advanced Classes', 'Life Goals'] }
          ],
          instructor: {
            name: 'Pastor Sarah Johnson',
            email: 'sarah@victorybiblechurch.com',
            phone: '(555) 123-4567',
            bio: 'Pastor Sarah has been in ministry for over 15 years and specializes in discipleship and spiritual formation.'
          },
          category: 'discipleship',
          active: true
        },
        {
          title: "Leadership Foundations",
          description: "Develop essential leadership skills rooted in biblical principles. This 12-week intensive program prepares emerging leaders for ministry roles.",
          duration: { value: 12, unit: 'weeks' },
          level: 'intermediate',
          prerequisites: ['Foundation Classes', 'Growing in Christ'],
          curriculum: [
            { week: 1, title: 'Biblical Leadership Principles', description: 'Understanding leadership from God\'s perspective', topics: ['Servant Leadership', 'Biblical Examples', 'Character Development'] },
            { week: 2, title: 'Vision and Purpose', description: 'Developing and communicating vision', topics: ['Vision Casting', 'Purpose Discovery', 'Goal Setting'] },
            { week: 3, title: 'Communication Skills', description: 'Effective communication for leaders', topics: ['Public Speaking', 'Active Listening', 'Conflict Resolution'] },
            { week: 4, title: 'Team Building', description: 'Building and leading effective teams', topics: ['Team Dynamics', 'Delegation', 'Motivation'] },
            { week: 5, title: 'Decision Making', description: 'Making wise decisions as a leader', topics: ['Problem Solving', 'Strategic Thinking', 'Risk Assessment'] },
            { week: 6, title: 'Conflict Resolution', description: 'Handling conflict in ministry', topics: ['Mediation', 'Restoration', 'Peace Making'] }
          ],
          instructor: {
            name: 'Elder Michael Brown',
            email: 'michael@victorybiblechurch.com',
            phone: '(555) 234-5678',
            bio: 'Elder Michael is a business executive and church leader with 20 years of leadership experience.'
          },
          category: 'leadership',
          active: true
        },
        {
          title: "Biblical Studies Intensive",
          description: "A deep dive into Scripture with advanced study methods and theological insights. Perfect for those wanting to grow in biblical understanding.",
          duration: { value: 16, unit: 'weeks' },
          level: 'advanced',
          prerequisites: ['Foundation Classes', 'Growing in Christ'],
          curriculum: [
            { week: 1, title: 'Bible Overview', description: 'Understanding the grand narrative of Scripture', topics: ['Creation to Revelation', 'Covenant Theology', 'Biblical Timeline'] },
            { week: 2, title: 'Hermeneutics', description: 'Principles of biblical interpretation', topics: ['Context', 'Genre', 'Application'] }
          ],
          instructor: {
            name: 'Dr. Rachel Adams',
            email: 'rachel@victorybiblechurch.com',
            phone: '(555) 345-6789',
            bio: 'Dr. Adams holds a PhD in Biblical Studies and has taught at seminary level for 10 years.'
          },
          category: 'biblical_studies',
          active: true
        }
      ];

      const savedClasses = [];
      for (const classData of discipleshipClasses) {
        const newClass = new models.DiscipleshipClass(classData);
        const savedClass = await newClass.save();
        savedClasses.push(savedClass);
        console.log(`Created discipleship class: ${savedClass.title}`);
      }

      // Create discipleship sessions
      console.log("Creating discipleship sessions...");
      
      const discipleshipSessions = [
        {
          classId: savedClasses[0]._id, // Growing in Christ
          cohortName: 'Spring 2024 - Growing in Christ',
          startDate: new Date('2024-03-15'),
          endDate: new Date('2024-05-10'),
          schedule: {
            day: 'Wednesday',
            time: '7:00 PM - 8:30 PM',
            frequency: 'weekly'
          },
          location: 'Main Sanctuary - Room 201',
          capacity: 20,
          enrolledCount: 12,
          facilitator: {
            name: 'Pastor Sarah Johnson',
            email: 'sarah@victorybiblechurch.com',
            phone: '(555) 123-4567'
          },
          status: 'upcoming',
          registrationDeadline: new Date('2024-03-10'),
          active: true
        },
        {
          classId: savedClasses[1]._id, // Leadership Foundations
          cohortName: 'Summer 2024 - Leadership Track',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-08-24'),
          schedule: {
            day: 'Saturday',
            time: '9:00 AM - 11:00 AM',
            frequency: 'weekly'
          },
          location: 'Conference Room A',
          capacity: 15,
          enrolledCount: 8,
          facilitator: {
            name: 'Elder Michael Brown',
            email: 'michael@victorybiblechurch.com',
            phone: '(555) 234-5678'
          },
          status: 'upcoming',
          registrationDeadline: new Date('2024-05-25'),
          active: true
        },
        {
          classId: savedClasses[0]._id, // Growing in Christ (second session)
          cohortName: 'Fall 2024 - Growing in Christ',
          startDate: new Date('2024-09-15'),
          endDate: new Date('2024-11-10'),
          schedule: {
            day: 'Sunday',
            time: '2:00 PM - 3:30 PM',
            frequency: 'weekly'
          },
          location: 'Youth Building - Room 102',
          capacity: 25,
          enrolledCount: 5,
          facilitator: {
            name: 'Pastor Sarah Johnson',
            email: 'sarah@victorybiblechurch.com',
            phone: '(555) 123-4567'
          },
          status: 'upcoming',
          registrationDeadline: new Date('2024-09-10'),
          active: true
        },
        {
          classId: savedClasses[2]._id, // Biblical Studies Intensive
          cohortName: 'Fall 2024 - Biblical Studies',
          startDate: new Date('2024-09-05'),
          endDate: new Date('2024-12-19'),
          schedule: {
            day: 'Thursday',
            time: '6:30 PM - 8:00 PM',
            frequency: 'weekly'
          },
          location: 'Library Conference Room',
          capacity: 12,
          enrolledCount: 3,
          facilitator: {
            name: 'Dr. Rachel Adams',
            email: 'rachel@victorybiblechurch.com',
            phone: '(555) 345-6789'
          },
          status: 'upcoming',
          registrationDeadline: new Date('2024-08-30'),
          active: true
        }
      ];

      for (const sessionData of discipleshipSessions) {
        const newSession = new models.DiscipleshipSession(sessionData);
        await newSession.save();
        console.log(`Created discipleship session: ${sessionData.cohortName}`);
      }

      console.log("Discipleship data seeded successfully");
    } else {
      console.log("Discipleship classes already exist, skipping...");
    }
  } catch (error) {
    console.error("Error seeding discipleship data:", error);
    throw error;
  }
};

module.exports = seedDiscipleshipData;
