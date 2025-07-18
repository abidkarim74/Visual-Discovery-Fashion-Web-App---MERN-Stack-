import mongoose from "mongoose";


const connectDatabase = async () => {
  const dbUrl = process.env.MONGO_URL;
  if (!dbUrl) {
    throw new Error('MONGO_URL is not defined in .env!');
  }
  try {
    mongoose.connect(dbUrl);
    console.log("Database connected successfully!");

  } catch (err:any) {
    console.log("There was an error while connecting to the database!", err.message);
    process.exit(1);
  }
};

export default connectDatabase;
