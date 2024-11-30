import express, { Request, Response } from "express";
import Boom from "boom";
import routerApi from "./routes";

const app = express();

app.use(express.json());

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
