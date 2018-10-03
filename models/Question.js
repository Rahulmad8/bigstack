const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Questionschema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myperson"
  },
  textone: {
    type: String,
    require: true
  },
  texttwo: {
    type: String,
    require: true
  },
  name: {
    type: String
  },
  upvote: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myperson"
      }
    }
  ],
  anwser: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myperson"
      },
      anwtext: {
        type: String,
        require: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Question = mongoose.model("myquest", Questionschema);
