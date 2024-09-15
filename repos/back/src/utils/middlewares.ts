import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Define public routes that don't require authentication
  const publicRoutes = ["/request-password-reset", "/reset-password-byuser", "/validate-reset-token"];

  // If the request path matches a public route, skip authentication
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.get("Authorization") || "";

  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY as string, (err, user: any) => {
    if (err) {
      return res.status(403).json({ message: err.message });
    }
    req.userId = user.userId;
    req.isAdmin = user.isAdmin;
    next();
  });
};


// import { NextFunction, Request, Response } from "express";
// import * as jwt from "jsonwebtoken";

// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.get("Authorization") || "";

//   if (!authHeader || typeof authHeader !== "string") {
//     throw new Error("Unauthorized");
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     throw new Error("Unauthorized");
//   }

//   jwt.verify(token, process.env.SECRET_KEY as string, (err, user: any) => {
//     if (err) {
//       throw new Error(err.message);
//     }
//     req.userId = user.userId;
//     req.isAdmin = user.isAdmin;
//     next();
//   });
// };
