const { pool } = require("../dbConnection");

module.exports.Register = async function (req, res) {
  const client = await pool.connect();

  try {
    let query = {
      text: "INSERT INTO public.user (name, email) VALUES($1, $2) RETURNING *",
      values: ["Arun", "arunkumar413@gmail.com"],
    };

    let res = await client.query(query);
    console.log(res.rows);
    res.send("register");
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};
