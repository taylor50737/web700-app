/********************************************************************************* 
 * WEB700 – Assignment 03  
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: ______________________ Student ID: ______________ Date: ________________ 
 * 
 ********************************************************************************/  

const HTTP_PORT = process.env.PORT || 8080; 
const express = require("express"); 
const app = express(); 
const collegeData = require("./module/collegeData");
const initialize = collegeData.initialize;
const getAllStudents = collegeData.getAllStudents;
const getTAs = collegeData.getTAs;
const getCourses = collegeData.getCourses;
const getStudentsByCourse = collegeData.getStudentsByCourse;
const getStudentByNum = collegeData.getStudentByNum;

initialize()
.then((dataCollection) => {
    app.get("/", (req, res) => {     
        res.sendFile(__dirname + "/views/home.html"); 
    });  
    
    app.get("/about", (req, res) => {     
        res.sendFile(__dirname + "/views/about.html"); 
    });  
    
    app.get("/htmlDemo", (req, res) => {     
        res.sendFile(__dirname + "/views/htmlDemo.html"); 
    });  
    
    app.get("/students", (req, res, next) => {
        getAllStudents()
        .then((allStudents) => {
            res.json(allStudents);
        })
        .catch((err) => {
            res.json({ message: err });
        });
    });
    
    // app.get("/students?course=:value", (req, res) => {
    //     let value = parseInt(req.params.value);
    //     initialize()
    //     .then((dataCollection) => {
    //         getStudentsByCourse(value)
    //         .then((studentsByCourse) => {
    //             res.json({ studentsByCourse });
    //         })
    //     });
    // });
    
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
    })
    
    app.get("/student/:num", (req, res) => {
        const num = parseInt(req.params.num);
        getStudentByNum(num)
        .then((studentByNum) => {
            res.json({studentByNum});
        })
        .catch((err) => {
            res.json({ message: err });
        });
    })

    app.get('*', (req, res) => {
        res.status(404).send('Page Not Found');
    });

    app.listen(HTTP_PORT, ()=>{ console.log("server listening on port: " + HTTP_PORT) });
})
.catch((err) => {
    console.log(err);
})