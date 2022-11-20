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
      values: ["Arun Kumar", "Kadari", "arunkumar413@gmail.l", hash, false],
    };

    let dbres = await client.query(query);
    currentUserId = dbres.rows[0].id;

    //generate session id and set it to cookie value
    // send verification email
    let sessionID = uuidv4();

    let sessionQuery = {
      text: "INSERT INTO public.session (email,userid,sessionid) VALUES ($1,$2,$3) returning *",
      values: ["arunkumar413@gmail.l", currentUserId, sessionID],
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
