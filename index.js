var express = require('express');
var app = express();

var Animal = require('./Animal.js');
var Toy = require('./Toy.js');

app.use('/findAllToys', (req, res) => {
  let query = {};

  Toy.find(query, (err, toys) => {
    if (!err) {
      if(toys.length >= 0) {
        res.json(toys);
      } 
      else {
        res.json({});
      }
    }
    else {
      res.json({});
    }
  });
});


app.use('/findToy', (req,res) => {
    let query = {};

    if (req.query.id) {
      query["id"] = req.query.id;
      Toy.find(query, (err, toys) => {
        if (!err) {
          if (toys.length >= 0) {
           res.json(toys);
          }
          else {
            res.json({});
          }
        }
      });
    }
    else {
      res.json({});
    }
});

app.use('/', (req, res) => {
	res.json({ msg : 'It works!' });
});


app.listen(3000, () => {
	console.log('Listening on port 3000');
});

// Please do not delete the following line; we need it for testing!
module.exports = app;