const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema ({

        pizzaName: {
            type: String,
            required: 'You need to provide a pizza name!',
            trim: true   //removes whitespace before and after input string 
        },
        createdBy: {
            type: String,
            required: 'Provide your name!',
            trim: true
        },
        createdAt: {
            type: Date,
            get: (createdAtVal) => dateFormat(createdAtVal) //get option, value in createdAt field is formatted by dateFormat function
        },
        size: {
            type: String,
            require: true,
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'], //providing an array of options to choose from
            default: 'Large' 
        },
        toppings: [],   //or simply write Array in place of brackets
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'    //ref property tells Pizza model which document to search for to find right comments 
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,   //telling schema we can use virtuals 
            getters: true //telling schema we can use getters for date
        },
        id: false   //virtual that mongoose returns that we don't need 
    }
);

// get total count of comments and replies on retrieval
//Virtuals allow you to add virtual properties to a document that aren't stored in the database. They're normally computed values that get evaluated when you try to access their properties.
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
  });

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;