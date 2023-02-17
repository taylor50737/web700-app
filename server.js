/********************************************************************************* 
 * WEB700 – Assignment 03  
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: Pak Hei Lo Student ID: 132631227 Date: 17th February 2023
 * 
 ********************************************************************************/  

const HTTP_PORT = process.env.PORT || 8080; 
const express = require("express"); 
const app = express(); 
const path = require("path");
const collegeData = require("./module/collegeData");
const initialize = collegeData.initialize;
const getAllStudents = collegeData.getAllStudents;
const getTAs = collegeData.getTAs;
const getCourses = collegeData.getCourses;
const getStudentsByCourse = collegeData.getStudentsByCourse;
const getStudentByNum = collegeData.getStudentByNum;

initialize()
.then(() => {
    app.use("/public", express.static(__dirname + "/public"));

    app.get("/", (req, res) => {     
        res.sendFile(__dirname + "/views/home.html"); 
    });  
    
    app.get("/about", (req, res) => {     
        res.sendFile(__dirname + "/views/about.html"); 
    });  
    
    app.get("/htmlDemo", (req, res) => {     
        res.sendFile(__dirname + "/views/htmlDemo.html"); 
    });  
    
    app.get("/students", (req, res) => {
        if (req.query.course) {
            let courseNum = parseInt(req.query.course)
            getStudentsByCourse(courseNum)
            .then((studentByCourse) => {
                res.json(studentByCourse);
            })
            .catch((err) => {
                res.json({ message: err });
            });
        } else {
            getAllStudents()
            .then((allStudents) => {
                res.json(allStudents);
            })
            .catch((err) => {
                res.json({ message: err });
            });
        }
    });

    app.get("/tas", (req, res) => {
        getTAs()
        .then((tas) => {
            res.json(tas);
        })
        .catch((err) => {
            res.json({ message: err });
        });
    });
    
    app.get("/courses", (req, res) => {
        getCourses()
        .then((courses) => {
            res.json(courses);
        })
        .catch((err) => {
            res.json({ message: err });
        });
    });
    
    app.get("/student/:num", (req, res) => {
        let studentNum = parseInt(req.params.num);
        getStudentByNum(studentNum)
        .then((studentByNum) => {
            res.json({studentByNum});
        })
        .catch((err) => {
            res.json({ message: err });
        });
    });

    app.get('*', (req, res) => {
        res.status(404).sendFile(path.join(__dirname, "/views/PageNotFound.html"));
    });

    app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });
})
.catch((err) => {
    console.log(err);
})