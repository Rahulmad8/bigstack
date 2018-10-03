const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Profileschema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myperson"
  },
  username: {
    type: String,
    require: true,
    max: 50
  },
  website: {
    type: String
  },

  country: {
    type: String
  },
  Languages: {
    type: [String],
    required: true
  },
  portfolio: {
    type: String
  },
  workrole: [
    {
      role: {
        type: String
      },
      Company: {
        type: String
      },
      from: {
        type: Date
      },
      To: {
        type: Date
      },
      Details: {
        type: String
      }
    }
  ],
  social: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    youtube: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("myProfile", Profileschema);
