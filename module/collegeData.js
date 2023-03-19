const Data = class {
  students;
  courses;
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
};

let dataCollection = null;

const initialize = () => {
  const fs = require("fs");
  return new Promise((resolve, reject) => {
    const getStudentsData = () => {
      return new Promise((resolve, reject) => {
        fs.readFile("./data/students.json", "utf8", (err, data) => {
          if (data) {
            resolve(JSON.parse(data));
          } else {
            reject("Unable to read students.json");
          }
        });
      });
    };

    const getCoursesData = () => {
      return new Promise((resolve, reject) => {
        fs.readFile("./data/courses.json", "utf8", (err, data) => {
          if (data) {
            resolve(JSON.parse(data));
          } else {
            reject("Unable to read courses.json");
          }
        });
      });
    };

    getStudentsData()
      .then((studentsData) => {
        getCoursesData()
          .then((coursesData) => {
            dataCollection = new Data(studentsData, coursesData);
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  });
};

const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length !== 0) {
      resolve(dataCollection.students);
    } else {
      reject("no results");
    }
  });
};

// const getTAs = () => {
//   return new Promise((resolve, reject) => {
//     if (dataCollection.students.length !== 0) {
//       const TAsData = dataCollection.students.filter((el) => {
//         return el.TA === true;
//       });
//       resolve(TAsData);
//     } else {
//       reject("no results");
//     }
//   });
// };

const getCourses = () => {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length !== 0) {
      resolve(dataCollection.courses);
    } else {
      reject("no results");
    }
  });
};

const getStudentsByCourse = (course) => {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length !== 0) {
      const studentByCourse = dataCollection.students.filter((el) => {
        return el.course === course;
      });
      if (studentByCourse.length !== 0) {
        resolve(studentByCourse);
      } else {
        reject("no results");
      }
    } else {
      reject("no results");
    }
  });
};

const getStudentByNum = (num) => {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length !== 0) {
      const studentByNum = dataCollection.students.filter((el) => {
        return el.studentNum === num;
      });
      resolve(studentByNum[0]);
    } else {
      reject("no results");
    }
  });
};

const getCourseById = (id) => {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length !== 0) {
      const courseById = dataCollection.courses.filter((el) => {
        return el.courseId === id;
      });
      resolve(courseById[0]);
    } else {
      reject("query returned 0 result");
    }
  });
};

const addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    if (studentData.TA === "on") {
      studentData.TA = true;
    } else {
      studentData.TA = false;
    }
    studentData.course = +studentData.course;
    studentData.studentNum = dataCollection.students.length + 1;
    resolve(dataCollection.students.push(studentData));
  });
};

const updateStudent = (studentData) => {
  return new Promise((resolve) => {
    if (studentData.TA === "on") {
      studentData.TA = true;
    } else {
      studentData.TA = false;
    }
    studentData.studentNum = +studentData.studentNum;
    studentData.course = +studentData.course;
    if (
      studentData.studentNum ===
      dataCollection.students[studentData.studentNum - 1].studentNum
    ) {
      Object.assign(
        dataCollection.students[studentData.studentNum - 1],
        studentData
      );
      resolve();
    }
  });
};

module.exports = {
  initialize,
  getAllStudents,
  // getTAs,
  getCourses,
  getCourseById,
  getStudentsByCourse,
  getStudentByNum,
  addStudent,
  updateStudent,
};
