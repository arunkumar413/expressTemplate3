const { pool } = require("../dbConnection");

module.exports.Register = async function (req, res) {
  const client = await pool.connect();

  try {
    let query = {
      text: "INSERT INTO public.user (name, email,isEmailVerified) VALUES($1, $2,$3) RETURNING *",
      values: ["Arun", "arunkumar413@gmail.hin", 1],
    };

    let dbres = await client.query(query);

    //generate session id and set it to cookie value
    // send verification email
    //

    console.log(dbres.rows);
    res.cookie("rememberme", "1", {
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
