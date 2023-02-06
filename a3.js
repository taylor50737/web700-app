const collegeData = require("./module/collegeData");
const initialize = collegeData.initialize;
const getAllStudents = collegeData.getAllStudents;
const getTAs = collegeData.getTAs;
const getCourses = collegeData.getCourses;
const getStudentsByCourse = collegeData.getStudentsByCourse;
const getStudentByNum = collegeData.getStudentByNum;

initialize()
  .then((dataCollection) => {
    // getAllStudents()
    //   .then((students) =>
    //     console.log("Successfully retrieved " + students.length + " students")
    //   )
    //   .catch((err) => console.log(err));

    // getCourses()
    //   .then((courses) =>
    //     console.log("Successfully retrieved " + courses.length + " courses")
    //   )
    //   .catch((err) => console.log(err));

    // getTAs()
    //   .then((TAs) =>
    //     console.log("Successfully retrieved " + TAs.length + " TAs")
    //   )
    //   .catch((err) => console.log(err));

    // getStudentsByCourse(1)
    //   .then((studentsByCourse) => 
    //     console.log(studentsByCourse)
    //   )
    //   .catch((err) => console.log(err));

    // getStudentByNum(2)
    // .then((studentByNum) => 
    //   console.log(studentByNum)
    // )
    // .catch((err) => console.log(err));
      getCourses()
      .then((courses) =>
        console.log(courses)
      )
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));