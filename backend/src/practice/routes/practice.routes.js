import express from "express";
import { dbPractice } from "../../product/testApi.js";

const router = express.Router();

router.route("/").get(dbPractice);

export default router;
