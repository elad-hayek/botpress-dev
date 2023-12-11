const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const JSON_PATH = "./data.json";

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/state/:userId", (req, res) => {
  fs.readFile(JSON_PATH, (err, jsonData) => {
    if (err) {
      console.log("Error reading", err);
      return res.status(500).send(err);
    }
    try {
      var data = JSON.parse(jsonData);
      var user = data.find((x) => x.id === req.params.userId);
      res.send(user);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

app.post("/state/:userId", (req, res) => {

  var buffer = fs.readFileSync(JSON_PATH)
  var data = JSON.parse(buffer);

  var index = data.findIndex((x) => x.id === req.params.userId);
  if (index === -1) data.push({ id: req.params.userId, ...req.body });
  else data.splice(index, 1, { id: req.params.userId, ...req.body });

  fs.writeFileSync(JSON_PATH, JSON.stringify(data), (err)=>{
    console.log(err);
  });
  res.sendStatus(200);
      
});
