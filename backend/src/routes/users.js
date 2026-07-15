import { Router } from "express";
import { requireAuthenticatedUser } from "../middleware/auth.js";
import { syncClerkUser } from "../services/userSync.js";

const usersRouter = Router();

usersRouter.get("/me", requireAuthenticatedUser, async (request, response, next) => {
  try {
    const user = await syncClerkUser(request.clerkAuth.userId);

    response.json({
      user,
      auth: {
        userId: request.clerkAuth.userId,
        sessionId: request.clerkAuth.sessionId,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
