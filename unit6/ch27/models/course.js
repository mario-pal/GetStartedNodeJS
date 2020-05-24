const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    maxStudents: {
      type: Number,
      default: 0,
      min: [0, "Courses cannot have a negative number of students"]
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, "Courses cannot have negative cost"]
    }
    /*items: [],
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999
    },
    subscribers: [
      //one course can have many subscribers pg186
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]*/
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);
