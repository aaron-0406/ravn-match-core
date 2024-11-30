import express, { Request, Response } from "express";
import Boom from "boom";
import cors, { CorsOptions } from "cors";
import routerApi from "./routes";

const app = express();

app.use(express.json());

//CORS
const whitelist = ["http://localhost:5173", "http://127.0.0.1:5173", "http://54.227.199.42:5173", "http://18.206.133.13:5173"];
const options: CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin ?? "") || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed"));
    }
  },
};
app.use(cors(options));

routerApi(app);

app.use((req: Request, res: Response, next) => {
  next(Boom.notFound("Resource not found"));
});

app.use((err: any, req: Request, res: Response, next: any) => {
  if (Boom.isBoom(err)) {
    res.status(err.output.statusCode).json(err.output.payload);
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
