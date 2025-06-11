import {AddQuery} from "../controllers/support/support.controller.js"
import {Router} from "express";

const router = Router();

router.route('/addquery').post(AddQuery);

const SupportRoute = router;

export {SupportRoute}