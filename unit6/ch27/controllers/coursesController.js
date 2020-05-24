//by convention, controllers that handle model/schema data
//from a database have a plural name (compared with homeController.js)
//const mongoose = require("mongoose"),
const Course = require("../models/course");
const httpStatus = require("http-status-codes"); //needed for the errorJSON action
const User = require("../models/user"); //needed for the join action

const getCourseParams = (body) => {
  //create a custom function to pull subscriber data from the request
  return {
    title: body.title,
    description: body.description,
    maxStudents: parseInt(body.maxStudents),
    cost: parseInt(body.cost),
  };
};

module.exports = {
  index: (req, res, next) => {
    Course.find()
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    //res.render("courses/index");
    //res.json(res.locals.courses); //This version sends back the data in json format rather than in html
    //if (req.query.format === "json") {
    //An API endpoint is a reference to one or more application paths whose routes accept web requests
    //this data endpoint can also be used within the application
    //res.json(res.locals.courses); //to see this go to http://localhost:3000?format=json
    // } else {
    res.render("courses/index");
    //}
  },
  new: (req, res) => {
    res.render("courses/new");
  },
  create: (req, res, next) => {
    let subscriberParams = getCourseParams(req.body);
    Course.create(subscriberParams)
      .then((course) => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error saving susbcriber: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    var susbcriberId = req.params.id;
    Course.findById(susbcriberId)
      .then((course) => {
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching susbcriber by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("courses/show");
  },
  edit: (req, res, next) => {
    var courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.render("courses/edit", { course: course });
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let courseId = req.params.id;
    let subscriberParams = getCourseParams(req.body);
    Course.findByIdAndUpdate(courseId, { $set: subscriberParams })
      .then((course) => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },
  //API FUNCTIONALITY
  join: (req, res, next) => {
    let courseId = req.params.id,
      currentUser = req.user;

    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId,
        },
      })
        .then(() => {
          res.loacls.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error("User must be logged in."));
    }
  },

  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCourses = res.locals.courses.map((course) => {
        let userJoined = currentUser.courses.some((userCourse) => {
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined }); //convert from mongoose document object to json and append "joined" property
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },

  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },

  errorJSON: (error, req, res, next) => {
    let errorObject;

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "unknown error.",
      };
    }
    res.json(errorObject);
  },
};
