const path = require("path");

const express = require("express");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalMiddleware = require("./middlewares/errorMiddleware");

// Routes
const mountRoutes = require("./routes"); // i don't need to write (./routes/index.js) because when it saw index it called it direct

dbConnection();

const app = express();

// Enable other domains to access you app (your APIs)
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Cann't find this route ${req.originalUrl}`, 400));
});

// // Global error handling middleware
app.use(globalMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`App Running On Port ${process.env.PORT || 8000}`);
});

// Handle regection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down....");
    process.exit(1);
  });
});
