require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const propModel = require("./models/property");

//My routes
const propertyRoutes = require("./routes/property");

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("DB NOT CONNECTED");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", propertyRoutes);

//Port
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send({ data: "Welcome to DreamHome" });
});

// app.get("/propertylist", async (req, res) => {
//   // const prop = await propModel.findOne({ address: "31 Green Park" });
//   const props = await propModel.find({});
//   res.send(props);
// });

//Starting a server
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
