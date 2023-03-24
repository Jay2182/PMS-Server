const router = require("express").Router();
const Admin = require("../db/models/Admin");
const AppliedJob = require("../db/models/AppliedJob");
const ApprovedJob = require("../db/models/ApprovedJob");
const Job = require("../db/models/Job");
const Student = require("../db/models/Student");
const { varifyAdmin } = require("./varifyToken");

router.get("/", (req, res) => {
    res.send("user fetch api route");
});
// admin fetch api
router.get("/dashboard", varifyAdmin, async (req, res) => {
    try {
        const studentCount = await Student.find({}).count();
        const jobCount = await Job.find({}).count();
        const approvedjobCount = await ApprovedJob.find({}).count();
        const data = [
            {
                _id: 1,
                label: "Students",
                value: studentCount,
            },
            {
                _id: 2,
                label: "Open Jobs",
                value: jobCount,
            },
            {
                _id: 3,
                label: "Students Hired",
                value: approvedjobCount,
            },
        ];
        res.send(data);
    } catch (err) {
        res.status(400).send({ error: "can't fetch admin data" });
    }
});

router.get("/students", varifyAdmin, async (req, res) => {
    try {
        const students = await Student.find({});
        res.send(students);
    } catch (err) {
        res.status(400).send({ error: "can't fetch student data" });
    }
});

router.post("/students", varifyAdmin, async (req, res) => {
    const query = new RegExp(req.body.query, "i");
    try {
        const students = await Student.find({
            $and: [
                {
                    $or: [
                        { enrollmentNo: query },
                        { name: query },
                        { email: query },
                        { department: query },
                    ],
                },
            ],
        });
        res.send(students);
    } catch (err) {
        res.status(400).send({ error: "can't fetch student data" });
    }
});

router.get("/jobs", varifyAdmin, async (req, res) => {
    try {
        const jobs = await Job.find({});
        res.send(jobs);
    } catch (err) {
        res.status(400).send({ error: "can't fetch jobs data" });
    }
});
router.post("/jobs", varifyAdmin, async (req, res) => {
    const query = new RegExp(req.body.query, "i");
    try {
        const jobs = await Job.find({
            $and: [
                {
                    $or: [
                        { name: query },
                        { jobTitle: query },
                        { location: query },
                    ],
                },
            ],
        });
        res.json(jobs);
    } catch (err) {
        res.status(400).json({ error: "can't fetch jobs data" });
    }
});

router.get("/jobapplications", varifyAdmin, async (req, res) => {
    try {
        const jobapplications = await AppliedJob.find({});
        res.send(jobapplications);
    } catch (err) {
        res.status(400).send({ error: "can't fetch job applications data" });
    }
});

router.post("/jobapplications", varifyAdmin, async (req, res) => {
    const query = new RegExp(req.body.query, "i");
    try {
        const jobapplications = await AppliedJob.find({
            $and: [
                {
                    $or: [
                        { name: query },
                        { studentemail: query },
                        { jobTitle: query },
                        { location: query },
                    ],
                },
            ],
        });
        res.json(jobapplications);
    } catch (err) {
        res.status(400).json({ error: "can't fetch job applications data" });
    }
});

router.get("/approvedjobs", varifyAdmin, async (req, res) => {
    try {
        const jobapprovals = await ApprovedJob.find({});
        res.send(jobapprovals);
    } catch (err) {
        res.status(400).send({ error: "can't fetch job approval data" });
    }
});
router.post("/approvedjobs", varifyAdmin, async (req, res) => {
    const query = new RegExp(req.body.query, "i");
    try {
        const jobapprovals = await ApprovedJob.find({
            $and: [
                {
                    $or: [
                        { name: query },
                        { studentemail: query },
                        { jobTitle: query },
                        { location: query },
                    ],
                },
            ],
        });
        res.json(jobapprovals);
    } catch (err) {
        res.status(400).json({ error: "can't fetch job approval data" });
    }
});

module.exports = router;