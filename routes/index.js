var express = require("express");
const { Register, Logout, Login } = require("../controllers/AuthControllers");
var router = express.Router();

const { pool } = require("../dbConnection");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // pool .query("SELECT NOW()", (err, res) => {
  //   console.log(err, res);
  //   pool.end();
  // });

  const client = await pool.connect();

  try {
    let res = await client.query("SELECT NOW()");
    console.log(res.rows[0]);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }

  res.render("index", { title: "Express" });
});

router.get("/register", Register);
router.post("/logout", Logout);
router.post("/login", Login);

module.exports = router;
