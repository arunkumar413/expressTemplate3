const { pool } = require("../dbConnection");

var bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports.Register = async function (req, res) {
  const client = await pool.connect();

  let salt = await bcrypt.genSalt(12);
  let hash = await bcrypt.hash("password", salt);
  // https://www.npmjs.com/package/bcryptjs

  try {
    let query = {
      text: "INSERT INTO public.user (first_name,last_name, email,password,isemailverified) VALUES($1, $2,$3,$4,$5) RETURNING *",
      values: [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        hash,
        false,
      ],
    };

    let dbres = await client.query(query);
    currentUserId = dbres.rows[0].id;

    //generate session id and set it to cookie value
    // send verification email
    let sessionID = uuidv4();

    let sessionQuery = {
      text: "INSERT INTO public.session (email,userid,sessionid) VALUES ($1,$2,$3) returning *",
      values: [dbres.rows[0].email, currentUserId, sessionID],
    };

    let sessionResult = await client.query(sessionQuery);
    res.cookie("sessionid", sessionResult.rows[0].sessionid, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res.status(201).json({ status: "Successfully registered" });
  } catch (err) {
    console.log(err);
    res.send(err);
  } finally {
    client.release();
  }
};

module.exports.Login = async function (req, res) {
  console.log("############ Login ###############");
  console.log(req.body);
  const client = await pool.connect();
  userInfo = req.body;
  let query = {
    text: "SELECT * FROM PUBLIC.USER WHERE EMAIL=$1",
    values: [req.body.email],
  };

  try {
    let queryRes = await client.query(query);
    console.log(queryRes.rows[0]);
    let compareRes = await bcrypt.compare(
      req.body.password,
      queryRes.rows[0].password
    );
    if (compareRes === true) {
      let sessionID = uuidv4();

      let sessionQuery = {
        text: "INSERT INTO public.session (email,userid,sessionid) VALUES ($1,$2,$3) returning *",
        values: [queryRes.rows[0].email, queryRes.rows[0].id, sessionID],
      };

      let sessionResult = await client.query(sessionQuery);
      res.cookie("sessionid", sessionResult.rows[0].sessionid, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.status(200).json({
        status: "login success",
        sessionID: sessionResult.rows[0].sessionid,
        email: sessionResult.rows[0].email,
      });
    } else {
      res.status(401).json({ status: "incorrect password" });
    }
  } catch (err) {
    console.log(err);
  }

  // console.log(req.body);
};

module.exports.Logout = async function (req, res) {
  console.log("############# Logout ################");
  console.log(req.body);
  const client = await pool.connect();

  let query = {
    text: "DELETE FROM public.session WHERE email=$1",
    values: [req.body.email],
  };
  try {
    let delResult = await client.query(query);
    console.log(delResult);
    res.status(200).json({ status: "successfully logged out" });
  } catch (err) {
    console.log(err);
  }
};
