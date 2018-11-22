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


app.use('/findAnimals', (req,res) => {
    let query = {};

    if (req.query.species || req.query.trait || req.query.gender) {
      
      if (req.query.species) {
        query["species"] = req.query.species;  
      }
      
      if (req.query.trait) {
        query["traits"] = req.query.trait;
      }

      if (req.query.gender) { 
        query["gender"] = req.query.gender;
      }


      Animal.find(query, (err, animals) => {
        if (!err) {
          if (animals.length != 0) {
           res.json(animals);
          }
          else {
            res.json({});
          }
        }
      });
    }
    else {
      Animal.find({}, (err, animals) => {
        if (!err) {
          res.json(animals);
        }
        else {
          res.json({});
        }
      });
    }
});

app.use('/animalsYoungerThan', (req,res) => {
    let query = {};
    let lt = {}

    if (req.query.age) {
      let age = parseInt(req.query.age);
      lt["$lt"] = age;
      query["age"] = {...lt};


      console.log(query);
      
      Animal.find(query, (err, animals) => {
        if (!err) {
          if (animals.length != 0) {
           let result = {};
           let count = animals.length;
           let names = [];

           animals.forEach((animal) => {
            names = [...names, animal.name];
           });

           result["count"] = count;
           result["names"] = names;
           res.json(result);
          }
          else {
            res.json({count: 0});
          }
        }
      });
    }
    else {
      res.json({});
    }
});

function isqty(currentvalue) {
  currentvalue = parseInt(currentvalue);
  if (currentvalue) {
    return true;
  }
  return false;
}

app.use('/calculatePrice', (req, res, next) => {

  if (req.query.id) {

    let qtys = req.query.qty;
    let ids = req.query.id;

    let inoperator = {};
    inoperator['$in'] = ids;

    let query = {};
    query['id'] = {...inoperator};
    
  
    if (!qtys.every(isqty)) {
      res.json({"items":[],"totalPrice":0});
      return next();
    }

    let result = {};
     
    let items = [];
    let subtotals = [];

    console.log(query);
    console.log(qtys);

    Toy.find(query, (err, toys) => {
      if (err) {
        console.log(err);
        return next();
      }
      
      for (var i = 0; i < toys.length; i++) {
        let item = {};
        item['id'] = toys[i].id;
        item['qty'] = qtys[i];
        item['subtotal'] = toys[i].price * qtys[i];
        items = [...items, item];
        subtotals = [...subtotals, item.subtotal];
      }

      result['items'] = items;
      result['totalPrice'] = subtotals.reduce((total = 0, subtotal) => {
        return total + subtotal;
      });

      return res.json(result);
    });
  }
  else {
    res.json({});
  }
});

app.use('/', (req, res) => {
  res.json({"sam": 'Enjoy...coding!'});
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Something broke...');
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
});

// Please do not delete the following line; we need it for testing!
module.exports = app;