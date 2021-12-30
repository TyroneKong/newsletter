const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// express.static allow the use of css and images
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  const first = req.body.FirstName;
  const last = req.body.LastName;
  const email = req.body.Email;

  // object for mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first,
          LNAME: last,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/78d1b1737f";

  const options = {
    method: "POST",
    auth: "Tyrone:47acb1e4d9f3d6a6977577ebd66c384a-us20",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 5050, (req, res) => {
  console.log("server is running on port 5050");
});

//api key
//47acb1e4d9f3d6a6977577ebd66c384a-us20

//audience id
// 78d1b1737f
