const db = require('./database');

db.run("INSERT INTO activities (name, carbon_saved, date) VALUES (?, ?, ?)", ["Bike Ride", 1.5, "2025-10-14"], function(err) {
  if (err) console.error(err.message);
  else console.log('✅ Data inserted successfully!');
});

db.close();
