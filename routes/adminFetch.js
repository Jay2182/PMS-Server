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
				label: "Total Jobs",
				value: jobCount,
			},
			{
				_id: 3,
				label: "Approved Jobs",
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
router.get("/students/:id", varifyAdmin, async (req, res) => {
	try {
		const student = await Student.findById(req.params.id);
		res.send(student);
	} catch (err) {
		res.status(400).send({ msg: "can't fetch student data" });
	}
});
router.get("/students/email/:email", varifyAdmin, async (req, res) => {
	try {
		const student = await Student.findOne({ email: req.params.email });
		res.send(student);
	} catch (err) {
		res.status(400).send({ msg: "can't fetch student data" });
	}
});
// search query
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
router.delete("/students/:id", varifyAdmin, async (req, res) => {
	try {
		const result = await Student.deleteOne({ _id: req.params.id });
		res.json(result);
	} catch (err) {
		res.status(400).json({ error: "can't delete record" });
	}
	// console.log("delete method called: " + req.params.id);
});

router.get("/jobs", varifyAdmin, async (req, res) => {
	try {
		const jobs = await Job.find({});
		res.send(jobs);
	} catch (err) {
		res.status(400).send({ error: "can't fetch jobs data" });
	}
});
// find job by id
router.get("/jobs/:id", varifyAdmin, async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);
		res.send(job);
	} catch (err) {
		res.status(400).send({ msg: "can't fetch jobs data" });
	}
});
// search query
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

router.delete("/jobs/:id", varifyAdmin, async (req, res) => {
	try {
		const result = await Job.deleteOne({ _id: req.params.id });
		res.json(result);
	} catch (err) {
		res.status(400).json({ error: "can't delete record" });
	}
	// console.log("delete method called: " + req.params.id);
});

router.get("/jobapplications", varifyAdmin, async (req, res) => {
	try {
		const jobapplications = await AppliedJob.find({ approved: false });
		res.send(jobapplications);
	} catch (err) {
		res.status(400).send({ error: "can't fetch job applications data" });
	}
});
// search query
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
// search query
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
