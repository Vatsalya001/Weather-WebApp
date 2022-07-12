//jshint esversion: 6
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var temp1;
var city1;
var description1;
var imageURL1;
const apiKey = "56864d88288dbe44d83e43d2de5610c4";
const unit = "metric";
app.get("/", function(req, res){
    res.sendFile(__dirname+ "/index.html");
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.post("/", function(req, res){
  const query = req.body.cityName;


  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;

  https.get(url, function(response){
    console.log(response);
    if(response.statusCode == 200){
      response.on("data", function(data){
        console.log(data);
        const weatherDataTranslated = JSON.parse(data);
        console.log(weatherDataTranslated);
        const temp = weatherDataTranslated.main.temp;
        console.log(temp);
        const description = weatherDataTranslated.weather[0].description;
        console.log(description);
        temp1 = temp;
        city1 = query;
        description1 = description;
        const imageURL = "http://openweathermap.org/img/wn/"+weatherDataTranslated.weather[0].icon+"@2x.png";
        imageURL1 = imageURL;
        res.redirect("/work");
      });
    }
    else{
      res.sendFile(__dirname +"/failed.html");
    }

  });
});
app.get("/work", function(req, res){
  res.render("weather", {temp1:temp1, city1:city1, description1:description1, imageURL1:imageURL1});
});
app.post("/work", function(req, res){
  //whenever button is clicked
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});
