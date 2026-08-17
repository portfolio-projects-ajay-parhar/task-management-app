import { Router } from "express";
import { body, param } from "express-validator";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.use(authenticate);

const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
const validPriorities = ["LOW", "MEDIUM", "HIGH"];

router.get("/stats", getTaskStats);

router.get("/", getTasks);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Task ID is required")],
  validate,
  getTask
);

router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
    body("description")
      .optional()
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
    body("status")
      .optional()
      .isIn(validStatuses)
      .withMessage(`Status must be one of: ${validStatuses.join(", ")}`),
    body("priority")
      .optional()
      .isIn(validPriorities)
      .withMessage(`Priority must be one of: ${validPriorities.join(", ")}`),
    body("dueDate")
      .optional({ values: "null" })
      .isISO8601()
      .withMessage("Due date must be a valid date (ISO 8601 format)"),
  ],
  validate,
  createTask
);

router.patch(
  "/:id",
  [
    param("id").notEmpty().withMessage("Task ID is required"),
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty")
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
    body("description")
      .optional({ values: "null" })
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
    body("status")
      .optional()
      .isIn(validStatuses)
      .withMessage(`Status must be one of: ${validStatuses.join(", ")}`),
    body("priority")
      .optional()
      .isIn(validPriorities)
      .withMessage(`Priority must be one of: ${validPriorities.join(", ")}`),
    body("dueDate")
      .optional({ values: "null" })
      .isISO8601()
      .withMessage("Due date must be a valid date"),
  ],
  validate,
  updateTask
);

router.delete(
  "/:id",
  [param("id").notEmpty().withMessage("Task ID is required")],
  validate,
  deleteTask
);

export default router;
