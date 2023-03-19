/***************************************************************************************************
 *  WEB700 – Assignment 05
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Pak Hei Lo Student ID: 132631227 Date: 2023-03-18
 *
 *  Online (Cyclic) Link: https://overalls-cygnet.cyclic.app/
 *
 ***************************************************************************************************/

const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080;
const collegeData = require("./module/collegeData");
const initialize = collegeData.initialize;
const getAllStudents = collegeData.getAllStudents;
// const getTAs = collegeData.getTAs;
const getCourses = collegeData.getCourses;
const getCourseById = collegeData.getCourseById;
const getStudentsByCourse = collegeData.getStudentsByCourse;
const getStudentByNum = collegeData.getStudentByNum;
const addStudent = collegeData.addStudent;
const updateStudent = collegeData.updateStudent;

initialize()
  .then(() => {
    app.engine(
      ".hbs",
      exphbs.engine({
        extname: ".hbs",
        defaultLayout: "main",
        helpers: {
          navLink: (url, options) => {
            return (
              "<li" +
              (url == app.locals.activeRoute
                ? ' class="nav-item active" '
                : ' class="nav-item" ') +
              '><a class="nav-link" href="' +
              url +
              '">' +
              options.fn(this) +
              "</a></li>"
            );
          },
          equal: (lvalue, rvalue, options) => {
            if (arguments.length < 3)
              throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
              return options.inverse(this);
            } else {
              return options.fn(this);
            }
          },
        },
      })
    );

    app.set("view engine", ".hbs");

    app.use((req, res, next) => {
      let route = req.path.substring(1);
      app.locals.activeRoute =
        "/" +
        (isNaN(route.split("/")[1])
          ? route.replace(/\/(?!.*)/, "")
          : route.replace(/\/(.*)/, ""));
      next();
    });

    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    app.use("/public", express.static(__dirname + "/public"));

    app.get("/", (req, res) => {
      res.render(__dirname + "/views/home.hbs");
    });

    app.get("/about", (req, res) => {
      res.render(__dirname + "/views/about.hbs");
    });

    app.get("/htmlDemo", (req, res) => {
      res.render(__dirname + "/views/htmlDemo.hbs");
    });

    app.get("/students/add", (req, res) => {
      res.render(__dirname + "/views/addStudent.hbs");
    });

    app.get("/students", (req, res) => {
      if (req.query.course) {
        let courseNum = parseInt(req.query.course);
        getStudentsByCourse(courseNum)
          .then((studentByCourse) => {
            res.render("students", { students: studentByCourse });
          })
          .catch((err) => {
            res.render("students", { message: err });
          });
      } else {
        getAllStudents()
          .then((allStudents) => {
            res.render("students", { students: allStudents });
          })
          .catch((err) => {
            res.render("students", { message: err });
          });
      }
    });

    // app.get("/tas", (req, res) => {
    //     getTAs()
    //     .then((tas) => {
    //         res.json(tas);
    //     })
    //     .catch((err) => {
    //         res.json({ message: err });
    //     });
    // });

    app.get("/courses", (req, res) => {
      getCourses()
        .then((courses) => {
          res.render("courses", { courses: courses });
        })
        .catch((err) => {
          res.render("courses", { message: err });
        });
    });

    app.get("/course/:id", (req, res) => {
      let courseId = parseInt(req.params.id);
      getCourseById(courseId)
        .then((courseById) => {
          res.render("course", { course: courseById });
        })
        .catch((err) => {
          res.render("course", { message: err });
        });
    });

    app.get("/student/:num", (req, res) => {
      let studentNum = parseInt(req.params.num);
      getStudentByNum(studentNum)
        .then((student) => {
          res.render("student", { student });
        })
        .catch((err) => {
          res.render("student", { message: err });
        });
    });

    app.post("/students/add", (req, res) => {
      const studentData = req.body;
      addStudent(studentData).then(res.redirect("/students"));
    });

    app.post("/student/update", (req, res) => {
      const studentData = req.body;
      updateStudent(studentData).then(res.redirect("/students"));
    });

    app.get("*", (req, res) => {
      res.status(404).render(path.join(__dirname, "/views/PageNotFound.hbs"));
    });

    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
