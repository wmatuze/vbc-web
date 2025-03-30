const fs = require('fs');
const path = require('path');

// Formatter for MongoDB responses
const formatEvent = `
// Format events for frontend compatibility
app.get('/events', async (req, res) => {
  try {
    const events = await models.Event.find()
      .populate('image')
      .sort({ startDate: 1 });
      
    // Convert to plain objects and adjust for frontend compatibility
    const formattedEvents = events.map(event => {
      const plainEvent = event.toObject();
      plainEvent.id = plainEvent._id.toString();
      
      // Add imageUrl for compatibility
      if (plainEvent.image && plainEvent.image.path) {
        plainEvent.imageUrl = plainEvent.image.path;
      } else {
        plainEvent.imageUrl = '/assets/events/default-event.jpg';
      }
      
      return plainEvent;
    });
    
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});
`;

const formatLeader = `
// Format leaders for frontend compatibility
app.get('/leaders', async (req, res) => {
  try {
    const leaders = await models.Leader.find()
      .populate('image')
      .sort({ order: 1 });
      
    // Convert to plain objects and adjust for frontend compatibility
    const formattedLeaders = leaders.map(leader => {
      const plainLeader = leader.toObject();
      plainLeader.id = plainLeader._id.toString();
      
      // Add imageUrl for compatibility
      if (plainLeader.image && plainLeader.image.path) {
        plainLeader.imageUrl = plainLeader.image.path;
      } else {
        plainLeader.imageUrl = '/assets/leadership/default-leader.jpg';
      }
      
      return plainLeader;
    });
    
    res.json(formattedLeaders);
  } catch (error) {
    console.error('Error fetching leaders:', error);
    res.status(500).json({ error: 'Failed to fetch leaders' });
  }
});
`;

const formatSermon = `
// Format sermons for frontend compatibility
app.get('/sermons', async (req, res) => {
  try {
    const sermons = await models.Sermon.find()
      .populate('image')
      .sort({ date: -1 });
      
    // Convert to plain objects and adjust for frontend compatibility
    const formattedSermons = sermons.map(sermon => {
      const plainSermon = sermon.toObject();
      plainSermon.id = plainSermon._id.toString();
      
      // Add imageUrl for compatibility
      if (plainSermon.image && plainSermon.image.path) {
        plainSermon.imageUrl = plainSermon.image.path;
      } else {
        plainSermon.imageUrl = '/assets/sermons/default-sermon.jpg';
      }
      
      return plainSermon;
    });
    
    res.json(formattedSermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});
`;

const formatCellGroup = `
// Format cell groups for frontend compatibility
app.get('/cell-groups', async (req, res) => {
  try {
    const cellGroups = await models.CellGroup.find()
      .populate('image')
      .sort({ name: 1 });
      
    // Convert to plain objects and adjust for frontend compatibility
    const formattedCellGroups = cellGroups.map(cellGroup => {
      const plainCellGroup = cellGroup.toObject();
      plainCellGroup.id = plainCellGroup._id.toString();
      
      // Add imageUrl for compatibility
      if (plainCellGroup.image && plainCellGroup.image.path) {
        plainCellGroup.imageUrl = plainCellGroup.image.path;
      } else {
        plainCellGroup.imageUrl = '/assets/cell-groups/default-cell-group.jpg';
      }
      
      return plainCellGroup;
    });
    
    res.json(formattedCellGroups);
  } catch (error) {
    console.error('Error fetching cell groups:', error);
    res.status(500).json({ error: 'Failed to fetch cell groups' });
  }
});
`;

// Update server.js
try {
  // Read the original server.js
  let serverJs = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  
  // Replace the events route handler
  serverJs = serverJs.replace(
    /app\.get\('\/events', async \(req, res\) => {[\s\S]*?}\);/,
    formatEvent.trim()
  );
  
  // Replace the leaders route handler
  serverJs = serverJs.replace(
    /app\.get\('\/leaders', async \(req, res\) => {[\s\S]*?}\);/,
    formatLeader.trim()
  );
  
  // Replace the sermons route handler
  serverJs = serverJs.replace(
    /app\.get\('\/sermons', async \(req, res\) => {[\s\S]*?}\);/,
    formatSermon.trim()
  );
  
  // Replace the cell-groups route handler
  serverJs = serverJs.replace(
    /app\.get\('\/cell-groups', async \(req, res\) => {[\s\S]*?}\);/,
    formatCellGroup.trim()
  );
  
  // Write the updated server.js
  fs.writeFileSync(path.join(__dirname, 'server.js.new'), serverJs);
  
  console.log('Successfully created server.js.new with updated formatters');
} catch (error) {
  console.error('Error updating server.js:', error);
} 