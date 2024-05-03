// index.js

const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use("/user", userRoutes); // Mount user routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
