import dotenv from "dotenv";
import express from "express";
const app = express();
import cors from "cors";
import UserRoutes from "./controllers/UserController";
import GroupRoutes from "./controllers/GroupController";
import CommissionRoutes from "./controllers/CommissionController";
import { TGenericResponse } from "./utils/types/IGenerics";
import UserServiceUpdated from "./services/UserServiceUpdated";
import { handleResponse } from "./utils/generics";
import multer from "multer";
import path from "path";

dotenv.config();

const storage = multer.diskStorage({
  destination: "uploads/", // Set the destination folder for saving files
  filename: function (req, file, cb) {
    const customFileName =
      `${req.body.filename}.png` || `${Date.now()}-${file.originalname}`; // Assign a custom filename from the request body or use timestamp + original filename
    cb(null, customFileName);
  },
});

const upload = multer({ storage: storage });
app.use(express.json());
app.use(cors());
// Endpoint for handling file upload
app.post("/profile-picture", upload.single("image"), (req, res) => {
  res.json({ success: true, message: "Image uploaded successfully" });
});

// Endpoint for serving images
app.use("/profile-images", express.static("uploads"));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const response: TGenericResponse = await UserServiceUpdated.login(
    email,
    password
  );
  return handleResponse(response, res);
});

app.use("/user", UserRoutes);
app.use("/group", GroupRoutes);
app.use("/commission", CommissionRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
