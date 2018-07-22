const express = require("express");
const morgan = require("morgan");
// const postBank = require("./postBank");
const postList = require("./views/postList");
const postDetails = require("./views/postDetails");
const client = require('./db')
const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  try {
    // const posts = postBank.list();
    const data = await client.query(
      `select *
      from (select * from posts as posts) as posts
      join (select * from users) as users
      on posts.id = users.id
      join (select postid, count(*) as upvotes from upvotes group by postid) as counting
      on users.id = counting.postid;`)
    res.send(postList(data.rows));
  } catch(error) {
    console.log(error);
    res.status(500).send(error)
  }
});

app.get("/posts/:id", async (req, res) => {
  // const post = postBank.find(req.params.id);
  try {
    const data = await client.query(
      `select *
      from posts
      join users on users.id = posts.id
      where posts.id = ${req.params.id}`)

    res.send(postDetails(data.rows[0]));
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
