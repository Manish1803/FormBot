const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const app = require("./app");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
