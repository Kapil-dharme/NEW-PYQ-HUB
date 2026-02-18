require("dotenv").config()
const express = require('express')
const path = require("path")
const app = express()
const cookieparser = require("cookie-parser")
const { checkforauthentication, isAdmin } = require("./middlewares/auth")
const { queryhandler } = require("./middlewares/querymiddleware")
const { connecttoserver } = require("./services/connect")
const adminroute = require("./routes/admin")
const userroute = require("./routes/user")
const port = process.env.PORT || 3000
const Visit = require('./models/visits');
const NewPaper = require('./models/paper');

//to count visits
app.use(async (req, res, next) => {
  try {
    if (req.method === 'GET' &&
      !req.path.startsWith('/public') &&
      !req.path.startsWith('/user/browse') &&  
      !req.path.includes('.')) {             
      await Visit.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error("Visit counter error:", err);
  }
  next();
});

app.use(express.static(path.resolve("./public")))

//connection with the server
connecttoserver()

//acception form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//using cookieparser
app.use(cookieparser())

//using checkforauthentiaction
app.use(checkforauthentication('token'))

//handling all the query
app.use(queryhandler())


app.get('/', async (req, res) => {
  const visit = await Visit.findOne();
  const papers = await NewPaper.find({});
  res.render("home", {
    admin: req.admin,
    visitCount: visit ? visit.count : 0,
    papers:papers
  })
})

app.get('/about', (req, res) => {
  res.render("about")
})

app.use("/user", userroute);
app.use("/admin", adminroute);

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
