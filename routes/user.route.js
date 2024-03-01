const express = require("express");
const { test, updateUser, deleteUser } = require("../controllers/user.controller");
const { verifyToken } = require("../utils/verifyUser");
const router = express.Router();

router.get("/test",test)
router.put("/updateUser",verifyToken,updateUser)
router.get("/deleteUser",verifyToken,deleteUser)
module.exports = router