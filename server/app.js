const express = require("express");
const cors = require("cors");
const pgp = require("pg-promise")();
const logger = require("morgan");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

const cn = {
  host: "localhost",
  port: 5432,
  database: "rc_test",
  user: "postgres",
};

const db = pgp(cn);

app.get("/users", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const result = await db.any(query);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const query = "SELECT * FROM movies";
    const result = await db.any(query);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get("/search", async (req, res) => {
  const { title } = req.query;
  console.log("===");
  console.log(title);
  try {
    const query = `
                  SELECT *
                  FROM movies
                  WHERE title ILIKE '${title}';
                `;

    const result = await db.any(query);
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
