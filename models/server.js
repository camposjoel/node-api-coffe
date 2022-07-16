const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //Connect to DB
    this.connectDatabase();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();
  }

  async connectDatabase() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
      createParentPath: true
    }))
  }

  routes() {
    this.app.use('/api/auth', require('../routes/auth'));
    this.app.use('/api/categories', require('../routes/categories'));
    this.app.use('/api/products', require('../routes/products'))
    this.app.use('/api/users', require('../routes/users'));
    this.app.use('/api/search', require('../routes/search'));
    this.app.use('/api/uploads', require('../routes/uploads'));
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}/ 🚀`);
    });
  }
}

module.exports = Server;