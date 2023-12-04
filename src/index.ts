import express, { Request, Response } from "express";
import learnerRouter from "./Routes/learnerRouter";
import cors from "cors";

const matutorRouter = express();
const port = 3000;

matutorRouter.use(cors());
matutorRouter.use(express.json());
matutorRouter.use("/learner", learnerRouter);

matutorRouter.listen(port, () => {
  try {
    console.log(`Server is running on port ${port}`);
  } catch (exception) {
    console.error(exception);
  }
});
