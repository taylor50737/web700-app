const Sequelize = require('sequelize');

var sequelize = new Sequelize('hqkzsaei', 'hqkzsaei', 'G_M4jofTnq5ZYnczyNOoKYiAtJQDLFXf', {     
  host: 'ruby.db.elephantsql.com',     
  dialect: 'postgres',     
  port: 5432,     
  dialectOptions: {         
    ssl: { rejectUnauthorized: false }     
  },     
  query:{ raw: true } 
}); 

const Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING
}, {
  createdAt: false,
  updatedAt: false
});

const Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING
}, {
  createdAt: false,
  updatedAt: false
});

Course.hasMany(Student, {foreignKey:'course'});

const initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      resolve("Sync successful");
    }).catch(() => {
      reject("unable to sync the database")
    });
  });
};

const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      order: [
        ['studentNum', 'ASC']
      ]
    }).then((data) => {
      resolve(data);
    }).catch(() => {
      reject("no result returned")
    });
  });
};

const getCourses = () => {
  return new Promise((resolve, reject) => {
    Course.findAll({
      order: [
        ['courseId', 'ASC']
      ]
    }).then((data) => {
      resolve(data);
    }).catch(() => {
      reject("no result returned")
    })
  });
};

const getStudentsByCourse = (course) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        course: course
      }
    }).then((data) => {
      resolve(data);
    }).catch(() => {
      reject("no results returned");
    });
  });
};

const getStudentByNum = (studentNum) => {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        studentNum: studentNum
      }
    }).then((data) => {
      resolve(data[0]);
    }).catch(() => {
      reject("no result returned")
    })
  });
};

const getCourseById = (id) => {
  return new Promise((resolve, reject) => {
    Course.findAll({
      where: {
        courseId: id
      }
    }).then((data) => {
      resolve(data[0]);
    }).catch(() => {
      reject("no result returned")
    })
  });
};

const addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.TA = (studentData.TA) ? true : false;
    for (const prop in studentData) {
      if (studentData[prop] === "") {
        studentData[prop] = null;
      }
    };
    Student.create(
      {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        addressStreet: studentData.addressStreet,
        addressCity: studentData.addressCity,
        addressProvince: studentData.addressProvince,
        TA: studentData.TA,
        status: studentData.status,
        course: studentData.course
      }
    ).then(() => {
      resolve();
    }).catch(() => {
      reject("unable to create student");
    })
  });
};

const updateStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    studentData.TA = (studentData.TA) ? true : false;
    for (const prop in studentData) {
      if (studentData[prop] === "") {
        studentData[prop] = null;
      }
    };
    Student.update(
      {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        addressStreet: studentData.addressStreet,
        addressCity: studentData.addressCity,
        addressProvince: studentData.addressProvince,
        TA: studentData.TA,
        status: studentData.status,
        course: studentData.course
      }, {
        where: {
          studentNum: studentData.studentNum
        }
      }
    ).then(() => {
      resolve();
    }).catch(() => {
      reject("unable to update student");
    })
  });
};

const addCourse = (courseData) => {
  return new Promise((resolve, reject) => {
    for (const prop in courseData) {
      if (courseData[prop] === "") {
        courseData[prop] = null;
      }
    };
    Course.create({
      courseCode: courseData.courseCode,
      courseDescription: courseData.courseDescription
    }).then(() => {
      resolve();
    }).catch(() => {
      reject("unable to create course");
    })
  });
};

const updateCourse = (courseData) => {
  return new Promise((resolve, reject) => {
    for (const prop in courseData) {
      if (courseData[prop] === "") {
        courseData[prop] = null;
      }
    };
    Course.update(
      {
        courseCode: courseData.courseCode,
        courseDescription: courseData.courseDescription
      }, {
      where: {
        courseId: courseData.courseId
      }
    }).then(() => {
      resolve();
    }).catch(() => {
      reject("unable to update course");
    })
  });
};

const deleteCourseById = (id) => {
  return new Promise((resolve, reject) => {
    Course.destroy({
      where: {
        courseId: id
      }
    }).then(() => {
      resolve();
    }).catch(() => {
      reject();
    })
  });
};

const deleteStudentByNum = (studentNum) => {
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: {
        studentNum: studentNum
      }
    }).then(() => {
      resolve();
    }).catch(() => {
      reject();
    })
  });
};

module.exports = {
  initialize,
  getAllStudents,
  getCourses,
  getCourseById,
  getStudentsByCourse,
  getStudentByNum,
  addStudent,
  updateStudent,
  addCourse,
  updateCourse,
  deleteCourseById,
  deleteStudentByNum
};
