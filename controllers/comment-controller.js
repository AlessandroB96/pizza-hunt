const { Pizza, Comment } = require('../models');

const commentController = {
    addComment({params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
               return Pizza.findOneAndUpdate(
                   { _id: params.pizzaId },
                   { $push: { comments: _id }},  //all mongodb based functions start with a dollar sign
                   { new: true }       //receiving back the updated pizza
               );
               //When you add data into a nested array of a MongoDB document, they become what's known as a "nested document" or "subdocument".
            })
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId }},
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = commentController;