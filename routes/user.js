const { Router } = require("express");
const NewPaper = require("../models/paper")
const router = Router()

router.get("/browse", async (req, res) => {
    const { year, branch } = req.query;

    if (year && branch) {
        try {
            const yearMap = {
                'First Year (FY)': '1',
                'Second Year (SY)': '2',
                'Third Year (TY)': '3',
                'Final Year': '4'
            };

            const mappedYear = yearMap[year] || year;
            const mappedBranch = branch.toLowerCase();

            const subjects = await NewPaper.find({
                year: mappedYear,
                branch: mappedBranch
            }).distinct("subject");

            return res.json(subjects.map(subject => ({ subject })));
        } catch (err) {
            return res.status(500).json({ error: 'Failed to fetch subjects' });
        }
    }

    res.render("browseform", { subjects: [] });
});
router.post("/browse", async (req, res) => {
    try {
        let { year, subject, branch, examtype } = req.body
        if (!subject || !year || !branch || !examtype) {
            return res.render("browseform", {
                error: "Please fill out the details."
            })
        }
        if (subject) {
            subject = subject.toLowerCase().trim()
        }
        const yearMap = {
            'First Year (FY)': '1',
            'Second Year (SY)': '2',
            'Third Year (TY)': '3',
            'Final Year': '4'
        };

        const mappedYear = yearMap[year] || year;
        const mappedBranch = branch.toLowerCase();
        const mappedexamtype = examtype.toLowerCase();

        const papers = await NewPaper.find({
            year: Number(mappedYear),
            subject: subject,
            branch: mappedBranch,
            examtype:mappedexamtype
        });

        return res.render("browsepaper", {
            papers: papers,
            branch:mappedBranch
        })
    } catch (error) {
        return res.render("browseform", {
            error: "cannot find the papers"
        })
    }

})
module.exports = router;