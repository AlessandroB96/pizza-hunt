const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const ReplySchema = new Schema(
    {
      replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
      replyBody: {
        type: String,
        required: 'Please enter a reply!',
        trim: true
      },
      writtenBy: {
        type: String,
        required: 'Please write a name',
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      }
    },
    {
        toJSON: {
            getters: true
        }
    }
  );

const commentSchema = new Schema(
{
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String,
        required: 'You must provide a comment body!',
        trim: true

    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    replies: [ReplySchema]
},
    {
        toJSON: {
          virtuals: true,
          getters: true
        },
        id: false
    }
);

commentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
  });

const Comment = model('Comment', commentSchema);

module.exports = Comment;