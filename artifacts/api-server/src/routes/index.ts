import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import brandsRouter from "./brands";
import searchRouter from "./search";
import compareRouter from "./compare";
import dealsRouter from "./deals";
import launchesRouter from "./launches";
import guidesRouter from "./guides";
import authRouter from "./auth";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(brandsRouter);
router.use(searchRouter);
router.use(compareRouter);
router.use(dealsRouter);
router.use(launchesRouter);
router.use(guidesRouter);
router.use(authRouter);
router.use(adminRouter);

export default router;
