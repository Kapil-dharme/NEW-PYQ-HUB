const { Router } = require("express");
const { generateToken } = require("../services/authentication")
const { isAdmin } = require("../middlewares/auth")
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const bcrypt = require('bcrypt')
const NewPaper = require("../models/paper")
const router = Router()

router.get("/login", (req, res) => {
    res.render("adminlogin")
})

router.get("/add-paper", isAdmin, (req, res) => {
    return res.render("addpaper")
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const { year, subject, branch, examtype } = req.body;

        return {
            folder: "new-pyq-hub",
            resource_type: "raw",
            format: "pdf",
            public_id: `${year}/${branch}/${subject}/${examtype}/${Date.now()}.pdf`
        };
    }
});


const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            req.fileValidationError = "Only pdf's are allowed."
            cb(null, false);
        }
    }
});

router.post("/add-paper", isAdmin, (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.render("addpaper", {
                    error: "File is too large! Max limit is 10MB."
                });
            }
            return res.render("addpaper", {
                error: "Upload failed: " + err.message
            });
        }
        next(); 
    });
}, async (req, res) => {
    try {
        if (req.fileValidationError) {
            if (req.file && req.file.filename) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            return res.render("addpaper", { error: req.fileValidationError });
        }

        if (!req.file) {
            return res.render("addpaper", { error: "Please select a PDF file to upload" });
        }

        let { year, subject, branch, examtype,paperyear } = req.body;

        if (!year || !branch || !subject || !examtype || !paperyear) {
            if (req.file && req.file.filename) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            return res.render("addpaper", { error: "Please fill all details" });
        }

        const yearMapping = {
            "First Year (FY)": 1,
            "Second Year (SY)": 2,
            "Third Year (TY)": 3,
            "Final Year": 4
        };

        subject = subject.toLowerCase().trim();

        await NewPaper.create({
            year: yearMapping[year],
            branch,
            subject,
            examtype,
            paperyear:Number(paperyear),
            fileUrl: req.file.path,
            publicId: req.file.filename,
        });

        return res.render("addpaper", {
            success: "Paper uploaded successfully",
            fileUrl: req.file.path
        });

    } catch (err) {
        console.error("Upload error:", err);
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.render("addpaper", { error: "Upload Failed" });
    }
});
router.get("/show-paper", isAdmin, async (req, res) => {
    let papers = await NewPaper.find({})
    return res.render("browsepaper", { papers: papers })
})

router.get("/logout", isAdmin, (req, res) => {
    return res.clearCookie("token").redirect("/?success=You logged out successfully.")
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.render("adminlogin", {
            error: "All fields are required"
        })
    }
    else {
        try {
            if (email == process.env.ADMIN_1_EMAIL || email == process.env.ADMIN_2_EMAIL) {
                let isValid = false;
                let adminname = "";


                if (email == process.env.ADMIN_1_EMAIL) {
                    isValid = await bcrypt.compare(password, process.env.ADMIN_1_PASSWORD);
                    adminname = process.env.ADMIN_1_NAME
                } else if (email == process.env.ADMIN_2_EMAIL) {
                    isValid = await bcrypt.compare(password, process.env.ADMIN_2_PASSWORD);
                    adminname = process.env.ADMIN_2_NAME
                }


                if (!isValid) {
                    return res.render('adminlogin', {
                        error: "Invalid Credentials"
                    });
                }


                const token = generateToken(email, adminname);


                return res.cookie('token', token).redirect('/?success=You logged in successfully.')
            }
            else {
                return res.render('adminlogin', {
                    error: "Invalid Credentials"
                });
            }
        } catch (error) {
            return res.render('adminlogin', {
                error: "Invalid Credentials"
            })

        }
    }
})

router.post("/delete-paper/:id", isAdmin, async (req, res) => {

    if (!req.admin) {
        return res.render("adminloginform", {
            error: "Please login as admin first."
        });
    }
    try {
        const paper = await NewPaper.findById(req.params.id);

        if (!paper) {
            return res.redirect("/admin/show-paper");
        }

        await cloudinary.uploader.destroy(paper.publicId, {
            resource_type: "raw"
        });

        await NewPaper.findByIdAndDelete(req.params.id);

        return res.redirect("/admin/show-paper?success=Paper deleted successfully.");

    } catch (error) {
        return res.redirect("/admin/show-paper?error=System error ,Please try again");
    }
});


module.exports = router;