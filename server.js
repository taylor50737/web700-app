/*********************************************************************************
 * WEB700 – Assignment 06
 * I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
 * assignment has been copied manually or electronically from any other source (including web sites) or
 * distributed to other students.
 *
 * Name: Pak Hei Lo Student ID: 132631227 Date: 7 April 2023
 *
 * Online (Cyclic) Link: https://overalls-cygnet.cyclic.app/
 *
 * ********************************************************************************/

const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080;
const collegeData = require("./module/collegeData");
const initialize = collegeData.initialize;
const getAllStudents = collegeData.getAllStudents;
const getCourses = collegeData.getCourses;
const getCourseById = collegeData.getCourseById;
const getStudentsByCourse = collegeData.getStudentsByCourse;
const getStudentByNum = collegeData.getStudentByNum;
const addStudent = collegeData.addStudent;
const updateStudent = collegeData.updateStudent;
const addCourse = collegeData.addCourse;
const updateCourse = collegeData.updateCourse;
const deleteCourseById = collegeData.deleteCourseById;
const deleteStudentByNum = collegeData.deleteStudentByNum;

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
      getCourses()
        .then((data) => {
          res.render("addStudent", { courses: data });
        })
        .catch(() => {
          res.render("addStudent", { courses: [] });
        });
    });

    app.get("/courses/add", (req, res) => {
      res.render(__dirname + "/views/addCourse.hbs");
    });

    app.get("/students", (req, res) => {
      if (req.query.course) {
        getStudentsByCourse(parseInt(req.query.course))
          .then((studentByCourse) => {
            if (studentByCourse.length > 0) {
              res.render("students", { students: studentByCourse });
            } else {
              res.render("students", { message: "no results" });
            }
          })
          .catch((err) => {
            res.render("students", { message: err });
          });
      } else {
        getAllStudents()
          .then((allStudents) => {
            if (allStudents.length > 0) {
              res.render("students", { students: allStudents });
            } else {
              res.render("students", { message: "no results" });
            }
          })
          .catch((err) => {
            res.render("students", { message: err });
          });
      }
    });

    app.get("/courses", (req, res) => {
      getCourses()
        .then((courses) => {
          if (courses.length > 0) {
            res.render("courses", { courses: courses });
          } else {
            res.render("courses", { message: "no results" });
          }
        })
        .catch((err) => {
          res.render("courses", { message: err });
        });
    });

    app.get("/course/:id", (req, res) => {
      getCourseById(parseInt(req.params.id))
        .then((courseById) => {
          if (courseById === undefined) {
            res.status(404).send("Course Not Found");
          } else {
            res.render("course", { course: courseById });
          }
        })
        .catch((err) => {
          res.render("course", { message: err });
        });
    });

    app.get("/student/:num", (req, res) => {
      let viewData = {};

      getStudentByNum(parseInt(req.params.num))
        .then((data) => {
          if (data) {
            viewData.student = data;
          } else {
            viewData.student = null;
          }
        })
        .catch(() => {
          viewData.student = null;
        })
        .then(getCourses)
        .then((data) => {
          viewData.courses = data;
          for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
              viewData.courses[i].selected = true;
            }
          }
        })
        .catch(() => {
          viewData.courses = [];
        })
        .then(() => {
          if (viewData.student == null) {
            res.status(404).send("Student Not Found");
          } else {
            res.render("student", { viewData: viewData });
          }
        });
    });

    app.post("/students/add", (req, res) => {
      addStudent(req.body).then(() => {
        res.redirect("/students");
      });
    });

    app.post("/courses/add", (req, res) => {
      addCourse(req.body).then(res.redirect("/courses"));
    });

    app.post("/student/update", (req, res) => {
      updateStudent(req.body)
        .then(res.redirect("/students"))
        .catch(() => {
          res.status(500).send("Unable to Update Course");
        });
    });

    app.post("/course/update", (req, res) => {
      updateCourse(req.body).then(res.redirect("/courses"));
    });

    app.get("/course/delete/:id", (req, res) => {
      deleteCourseById(parseInt(req.params.id))
        .then(() => {
          res.redirect("/courses");
        })
        .catch(() => {
          res.status(500).send("Unable to Remove Course / Course not found");
        });
    });

    app.get("/student/delete/:studentNum", (req, res) => {
      deleteStudentByNum(parseInt(req.params.studentNum))
        .then(() => {
          res.redirect("/students");
        })
        .catch(() => {
          res.status(500).send("Unable to Remove Student / Student not found");
        });
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
