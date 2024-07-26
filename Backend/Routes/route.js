const express = require("express");
const router = express.Router();
const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail")
const checkPassword = require("../controller/checkPassword")
const UserDetails = require("../controller/UserDetails")
const logout = require("../controller/logout")
const UpdateUser = require("../controller/updateUserDetails");
const SearchUser = require("../controller/searchUser");
const CheckToken = require("../controller/CheckToken")

router.post("/register", registerUser);

router.post("/checkEmail", checkEmail);

router.post("/checkPassword",checkPassword);

router.get('/user-details',UserDetails)

router.get('/logout',logout)

router.post('/update-user',UpdateUser)

router.post('/search-user', SearchUser)

router.get('/check-token', CheckToken)

module.exports = router
