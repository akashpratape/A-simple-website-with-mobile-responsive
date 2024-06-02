import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import db from "db";

const app = express();
const port = 3000;
const saltRounds = 3;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/" , (req, res) => {
    res.render("index.ejs");
});

app.post("/create", async (req, res) => {
    const name = req.body["name"];
    const username = req.body["username"];
    const email = req.body["email"];
    const password = req.body["password"]


    try {
        // checking if username already exists
        const checkUsername = await db.query("SELECT * FROM information WHERE username = $1", [username]);
        const checkEmail = await db.query("SELECT * FROM information WHERE email = $1", [email])

        if (checkUsername.rows.length > 0) {
            // res.send("username already exists try another one");        
            return res.render("index.ejs", {error: "username already exists"});    // sending JSON data if username is already taken to show in frontend


        } else if (checkEmail.rows.length > 0) {
            res.send("email already exits try logging in or create with new email")

        } else {
            // Password hashing
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("Error hashing password", err)
                } else {
                    // res.json({ success: true, message: "Account created successfully" });
                    const result = await db.query(
                        "INSERT INTO information (name, username, email, password) VALUES ($1, $2, $3, $4)",
                        [name, username, email, hash]
                    );
                    console.log(result);
                    res.render("profile.ejs");
                };
            });
        }
    } catch (err) {
        console.log(err)
    }

});

app.post("/profile", (req,res) => {
    res.render("card.ejs")
})

app.get("/verifyEmail", (req,res) => {
    res.render("verifyEmail.ejs")
});


 

app.listen(port, () => {
    console.log(`server running on port ${port}`);

});

