import { Router } from "express";
import { createUser } from '../controllers/user.controllers';
import { sigininUser } from '../controllers/user.controllers';
import { verifyUser } from "../controllers/user.controllers";
const router = Router();


router.post('/users/signup',createUser);
router.post('/users/signin',sigininUser);
router.get('/users',verifyUser)

export default router;