const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3030;
const users = require("./MOCK_DATA.json");

//Middleware - plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.text",
    `${Date.now()}: ${req.ip}: ${req.method}: ${req.path},\n`,
    (err, data) => {
      next();
    }
  );
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/users", (req, res) => {
  const html = `
   <ul>
    ${users
      .map((user) => `<li>${user.first_name}</li><li>${users.email}</li>`)
      .join("")}
   </ul
   `;
  res.send(html);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === parseInt(id));
    return res.json(user);
  })
  .patch((req, res) => {
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    return res.json({ status: "pending" });
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  console.log("Body", body);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
