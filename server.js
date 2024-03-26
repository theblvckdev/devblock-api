const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config(`./.env`);

const app = require('./src/app');

process.on('uncaughtException', (err) => {
  console.error({
    type: `Unhandled Exception💣! Shutdown In Progress...`,
    name: err.name,
    message: err.message,
  });
  process.exit(1);
});

const port = process.env.APP_PORT || 3000;
const server = app.listen(port, async () => {
  console.log(`App is running on port ${port}...`);
  if (process.env.NODE_ENV === 'development')
    console.log(`App is running on development.`);
  if (process.env.NODE_ENV === 'production')
    console.log(`App is running on production.`);
  // This looks at our models folder and creates database tables according to the table we have.
  await sequelize.authenticate(); //when changes are made in the model file it will automatically update
  console.log(`Database Connected`);
});

process.on('unhandledRejection', (err) => {
  console.error({
    type: `Unhandled Rejection!!💣 Shutdown In Progress`,
    name: err.name,
    message: err.message,
  });
  server.close(() => {
    process.exit(1);
  });
});
