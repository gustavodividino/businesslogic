require('dotenv/config');

const express = require('express');
const routes = require('./routes');
const cors = require('cors');


class AppController{
    constructor(){
        this.express = express();

        this.middlewares();
        this.routes();
    }

    cors(){
        this.express.use(cors());
    }

    middlewares(){
        this.express.use(express.json());
    }

    routes(){
        this.express.use(routes);
    }

}

module.exports = new AppController().express
