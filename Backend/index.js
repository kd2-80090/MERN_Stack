
const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 5000;

app.use(express.json()); 
app.use("/user", userRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
