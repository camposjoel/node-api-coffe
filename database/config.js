const mongoose = require('mongoose');

async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Mongo database connected ⚙')
  } catch (error) {
    console.error(error);
    throw new Error('Error connecting to database')
  }
}

module.exports = {
  dbConnection
}