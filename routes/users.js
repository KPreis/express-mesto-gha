const { createUser, getUsers, getUserById } = require("../controllers/users");
const router = require("express").Router();

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:userId", getUserById);

module.exports = router;
