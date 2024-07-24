import { Router } from "express";
const router = Router();

import onuRoutes from "./routes/onuRoutes";


router.use("/onus", onuRoutes);


export default router;