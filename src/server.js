require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");
const NotificationJob = require("./jobs/notificationJob");

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      NotificationJob.start();
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
