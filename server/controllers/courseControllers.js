// const asyncHandler = require("express-async-handler");
const { Course } = require("../models/colleges");
const { mongoose } = require("mongoose");

const addCourse = async (req, res) => {

    try {
        const { name, code, description, information, domain, credits } = req.body;

        if (!name || !code || !description || !information || !domain || !credits) {
            return res.status(400).json({ message: "Provide all required details for Course creation" });
        }

        const course = req.body;
        const courseExist = await Course.findOne({ code });

        if (courseExist) {
            return res.status(400).json({ message: "Course already exists" });
        };

        const author = req.user.name;
        const newCourse = new Course({ ...course, author });

        await newCourse.save();
        res.status(201).json(newCourse);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }

};

const commentOnCourse = async (req, res) => {

    const { id } = req.params;
    const { value } = req.body;

    try {
        const course = await Course.findById(id);

        const newComment = {
            user: req.user._id,
            content: value,
        };

        course.comments.push(newComment);

        const updatedCourse = await Course.findByIdAndUpdate(id, course, { new: true });

        res.json(updatedCourse);
    } catch (error) {

        res.status(404).json({ message: error.message });

    }
};


const updateCourse = async (req, res) => {

    try {

        const { id } = req.params;
        const course = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Course With This Id");

        const updatedCourse = await Course.findByIdAndUpdate(id, { ...course, id }, { new: true });
        res.json(updatedCourse);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }

};

const deleteCourse = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Course With This Id");
        const deletedCourse = await Course.findByIdAndDelete(id);

        res.json(deletedCourse);
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }

};

const getCourseById = async (req, res) => {

    const { id } = req.params;

    try {
        const course = await Course.findById(id);

        res.status(200).json(course);
    } catch (error) {

        res.status(404).json({ message: error.message });
    }
};

module.exports = { addCourse, commentOnCourse, getCourseById, updateCourse, deleteCourse };