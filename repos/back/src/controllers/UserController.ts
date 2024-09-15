import { Request, Response, Router } from "express";
import UserService from "../services/UserServiceUpdated";
import { TGenericResponse } from "../utils/types/IGenerics";
import { handleResponse, handleUnauthenticated } from "../utils/generics";
import { authenticateToken } from "../utils/middlewares";
const router = Router();
router.use(authenticateToken);

const getAll = async (res: Response) => {
  const response: TGenericResponse = await UserService.getAllUsers();
  return handleResponse(response, res);
};

router.get("/all", async (req, res) => {
  if (!req.isAdmin) return handleUnauthenticated(res);
  return getAll(res);
});

router.post("/", async (req, res) => {
  const { args, uplineId, downlineIds } = req.body;
  const userId = req.userId;
  const isAdmin = req.isAdmin;
  const response: TGenericResponse = await UserService.createUser(
    args,
    isAdmin ? uplineId : userId,
    isAdmin ? downlineIds || [] : []
  );
  return handleResponse(response, res);
});

router.get("/profile", async (req: Request, res) => {
  const userId = req.userId;
  if (!userId) return handleUnauthenticated(res);
  const response: TGenericResponse = await UserService.getProfile(userId);
  return handleResponse(response, res);
});

router.get("/downlines", async (req: Request, res) => {
  const userId = req.userId;
  const isAdmin = req.isAdmin;
  if (isAdmin) {
    return getAll(res);
  }
  const response: TGenericResponse = await UserService.getDownlinesAsUsers(
    userId
  );
  return handleResponse(response, res);
});

router.get("/get-dispensed-commission/:id", async (req: Request, res) => {
  if (!req.isAdmin) return handleUnauthenticated(res);
  const { id } = req.params;
  const response: TGenericResponse =
    await UserService.getUserDispensedCommission(parseInt(id));
  return handleResponse(response, res);
});

router.get("/", async (req, res) => {
  const id = req.userId;
  const response: TGenericResponse = await UserService.getUser(id);
  return handleResponse(response, res);
});

router.get("/uplines/:id", async (req: Request, res) => {
  const { id } = req.params;
  const response: TGenericResponse = await UserService.getUplinesAsUsers(
    parseInt(id)
  );
  return handleResponse(response, res);
});

router.get("/upline", async (req, res) => {
  const id = req.userId;
  const response: TGenericResponse = await UserService.getDirectUplineAsUser(
    id
  );
  return handleResponse(response, res);
});

router.post("/update/:id", async (req: Request, res) => {
  if (!req.isAdmin) return handleUnauthenticated(res);
  const { id } = req.params;
  const args = req.body;
  const response: TGenericResponse = await UserService.updateUser(
    parseInt(id),
    args
  );
  return handleResponse(response, res);
});

router.post("/reset-password", async (req: Request, res) => {
  if (!req.isAdmin) return handleUnauthenticated(res);
  const { userId } = req.body;
  const response: TGenericResponse = await UserService.resetPassowrd(userId);
  return handleResponse(response, res);
});

router.post("/update-rlt", async (req: Request, res) => {
  if (!req.isAdmin) return handleUnauthenticated(res);
  const updateArgs = req.body;
  const response: TGenericResponse = await UserService.updateRelationship(
    updateArgs
  );
  return handleResponse(response, res);
});

router.post("/update-password", async (req: Request, res) => {
  const id = req.userId;
  const { password } = req.body;
  const response: TGenericResponse = await UserService.updatePassword(
    id,
    password
  );
  return handleResponse(response, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response: TGenericResponse = await UserService.getUser(parseInt(id));
  return handleResponse(response, res);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const response: TGenericResponse = await UserService.deleteAccount(
    parseInt(id)
  );
  return handleResponse(response, res);
});

router.post('/request-password-reset', async (req: Request, res: Response) => {
  const { email } = req.body;
  const response = await UserService.requestPasswordReset(email);
  return handleResponse(response, res);
});

router.post("/reset-password-byuser", async (req: Request, res: Response) => {
  const { userId, token, newPassword } = req.body;
  const response = await UserService.resetPassword(userId, token, newPassword);
  return handleResponse(response, res);
});

router.post("/validate-reset-token", async (req: Request, res: Response) => {
  const { userId, token } = req.body;
  const response = await UserService.validateResetToken(userId, token);
  return handleResponse(response, res);
});



export default router;
