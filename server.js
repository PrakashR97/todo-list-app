const PORT = process.env.PORT ?? 8000;
const express = require("express");
//const {v4:uuidv4}=require('uuid')
const cors = require("cors");
const app = express();
const pool = require("./db");
//to generate primary key value
const { v4: uuidv4 } = require("uuid");
const exp = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello Prakash");
});

//get all todos

app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  await pool.query(
    "SELECT * FROM todos where user_email= ?",
    [userEmail],
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json(data);
    }
  );
});

//create a new todo

app.post("/todos", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  console.log(user_email, title, progress, date);
  const id = uuidv4();
  try {
    const newToDo = await pool.query(
      `insert into todos(id,user_email,title,progress,date)
        values(?,?,?,?,?)`,
      [id, user_email, title, progress, date]
    );
    res.json("data has been loaded");
  } catch (err) {
    console.log(err);
  }
});

//edit a new todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const editToDo = await pool.query(
      "update todos set user_email =? ,title=?, progress=?, date=? where id=?",
      [user_email, title, progress, date, id]
    );
    res.json("todos got updated");
  } catch (error) {}
});

//delete todo app

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteToDo = await pool.query("delete from todos where id=?", [id]);
    res.json("todos got deleted");
  } catch (error) {}
});

//signup

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log(email, hashedPassword);
  try {
    const signUp = await pool.query(
      `insert into users(email,hashed_password) values(?,?)`,
      [email, hashedPassword]
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ email, token });
  } catch (error) {
    if (error) {
      res.json({ detail: error.detail });
    }
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const users = await pool.query("select * from users where email=?", [
      email,
    ]);

    if (!users || !users.rows || !users.rows.length) {
      console.log(users);
      return res.json({ detail: "user not exist!" });
    }
    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );

    if (success) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
