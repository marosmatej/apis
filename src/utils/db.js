const {Sequelize} = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_URL,{
    dialect: 'mssql',
    dialectOptions:{
        encrypt: process.env.DATABASE_ENCRYPT
    },
    logging: false,
})

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Databse connected successfully to Azure SQL')
    } catch(error) {
        console.log('Databse connection failed:', error.message);
        process.exit(1)

    }
}

module.exports = {sequelize, connectDB}