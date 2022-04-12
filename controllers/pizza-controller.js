const { Pizza } = require('../models');

const pizzaController = {
  //get all pizzas
  getAllPizza(req, res) {
      Pizza.find({})
        .populate({
            path: 'comments',
            select: '-__v'  //tells mongoose that we dont care about the __v feild on comments (minus sign in front indicates that we dont want to return it)
        })
        .select('-__v')
        .sort({ _id: -1 })  //sort to newest pizzas by desc order
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
  },

// get one pizza by id
getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
    .populate({
        path: 'comments',
        select: '-__v'
      })
      .select('-__v')
      .then(dbPizzaData => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
},

  //create Pizza 
  //we descructure the body out of the req object becuase we only need body 
  createPizza({ body}, res) {
      Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
  },

  updatePizza({ params, body}, res) {
      Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }) //new: true returns the new version of the document
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
  },

  deletePizza({ params}, res) {
      Pizza.findOneAndDelete({ _id: params.id})
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
  }
};

module.exports = pizzaController;