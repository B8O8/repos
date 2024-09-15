import { Response, Router } from "express";
import { TGenericResponse } from "../utils/types/IGenerics";
import { handleResponse } from "../utils/generics";
import GroupService from "../services/GroupService";
import { authenticateToken } from "../utils/middlewares";
const router = Router();
router.use(authenticateToken);

router.post("/", async (req, res) => {
  const args = req.body;
  const response: TGenericResponse = await GroupService.createGroup(args);
  return handleResponse(response, res);
});

router.get("/all", async (req, res) => {
  const response: TGenericResponse = await GroupService.getAllGroups();
  return handleResponse(response, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response: TGenericResponse = await GroupService.getGroupById(
    parseInt(id)
  );
  return handleResponse(response, res);
});

router.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  const response: TGenericResponse = await GroupService.getGroupByName(name);
  return handleResponse(response, res);
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const response: TGenericResponse = await GroupService.getAllUsersByGroupId(
    parseInt(id)
  );
  return handleResponse(response, res);
});

router.post("/levels/:id", async (req, res) => {
  const { id } = req.params;
  const args = req.body;
  const response: TGenericResponse = await GroupService.createGroupLevels(
    parseInt(id),
    args
  );
  return handleResponse(response, res);
});

router.get("/length/:id", async (req, res) => {
  const { id } = req.params;
  const response: TGenericResponse = await GroupService.getLevelsCount(
    parseInt(id)
  );
  return handleResponse(response, res);
});

export default router;
