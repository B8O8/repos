import { Request, Response, Router } from "express";
import CommissionService from "../services/CommissionService";
import { TGenericResponse } from "../utils/types/IGenerics";
import {
  asFormattedDate,
  handleResponse,
  handleUnauthenticated,
} from "../utils/generics";
import { authenticateToken } from "../utils/middlewares";
import multer from "multer";
import { MulterRequest } from "../utils/types/IRequestTypes";
const router = Router();
router.use(authenticateToken);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req: Request, res) => {
  if (req.isAdmin) {
    const response: TGenericResponse = await CommissionService.getAll();
    return handleResponse(response, res);
  } else {
    const userId = req.userId;
    const response: TGenericResponse = await CommissionService.get(userId);
    return handleResponse(response, res);
  }
});

router.post("/between", async (req, res) => {
  const userId = req.userId;
  const { from, to } = req.body;
  const response: TGenericResponse = await CommissionService.getInTimeInterval(
    userId,
    asFormattedDate(from, true).toString(),
    asFormattedDate(to, true).toString()
  );
 
  return handleResponse(response, res);
});

router.post("/monthly", async (req, res) => {
  const { from, to } = req.body;
  const response: TGenericResponse =
    await CommissionService.sendMonthlyCommissionEmail(
      asFormattedDate(asFormattedDate(from, true)),
      asFormattedDate(asFormattedDate(to, true))
    );
  return handleResponse(response, res);
});

router.post(
  "/upload",
  upload.single("csvFile"),
  async (req: MulterRequest, res: Response) => {
    if (!req.isAdmin) return handleUnauthenticated(res);
    if (!req.file) {
      return handleResponse(
        {
          success: false,
          status: 400,
          error: "File is required",
        },
        res
      );
    }
    const { date } = req.body;
    if (!date) {
      return handleResponse(
        {
          success: false,
          status: 400,
          error: "date is required",
        },
        res
      );
    }
    const fileBuffer = req.file.buffer.toString("utf8");
    const response: TGenericResponse = await CommissionService.handleCsvUpload(
      fileBuffer,
      new Date(date)
    );
    return handleResponse(response, res);
  }
);

// added route
router.post(
  "/upload-test",
  upload.single("csvFile"),
  async (req: MulterRequest, res: Response) => {
    if (!req.isAdmin) return handleUnauthenticated(res);
    if (!req.file) {
      return handleResponse(
        {
          success: false,
          status: 400,
          error: "File is required",
        },
        res
      );
    }

    const fileBuffer = req.file.buffer.toString("utf8");
    const response: TGenericResponse = await CommissionService.handleCsvTest(
      fileBuffer
    );

    return handleResponse(response, res); // Ensure this sends the correct JSON
  }
);

// route to get all users' commissions
router.post("/all-users-commissions", async (req: Request, res: Response) => {
  if (!req.isAdmin) return handleUnauthenticated(res);

  const { weekStart, weekEnd, monthStart, monthEnd } = req.body;
  
  try {
    const response: TGenericResponse = await CommissionService.getAllUsersCommissions(
      asFormattedDate(weekStart, true),
      asFormattedDate(weekEnd, true),
      asFormattedDate(monthStart, true),
      asFormattedDate(monthEnd, true)
    );
    return handleResponse(response, res);
  } catch (error) {
    console.error("Error fetching all users' commissions:", error);
    return handleResponse(
      { success: false, status: 500, error: "Internal Server Error" },
      res
    );
  }
});

export default router;
