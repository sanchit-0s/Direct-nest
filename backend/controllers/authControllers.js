

const express = require("express");
const User = require("../models/User");
const  jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const router = express.Router();

//register , user jab register karega toh uska password hum salt(joh aik type ka code hota hai) ke sath milake
//different bna denge i.e hashpassword taaki voh password decode na ho paye.
 const register = async(req,res)=>{

try{
    const {username,email,password} = req.body; //it will request for name,email,pass

    const userExist = await User.findOne({email}); //find all the users through email
    if (userExist) return res.status(400).json({message:"User already exist"});//if user already exist,toh ye msg render karega

    const salt = await bcrypt.genSalt(10);// password ko hashpassword banane ke liye salt generate krenge
    const hashedPassword = await bcrypt.hash(password,salt); //password ko bnayenge hashedpassword with salt

    const newUser = new User({username,email,password:hashedPassword});//user ko new user bna denge hashedpassword ke sath
    await newUser.save(); // user ko save kardenge login ke liye

    res.status(201).json({message: "User created"})

}catch(err){
    res.status(500).json(err);
}
};


//login, register user 
const login = async(req,res)=>{
try{
    const {email,password} = req.body;// request for email and password 
    

    const user = await User.findOne({email}) // it will match the given email with the eamil existed before
    if(!user) return res.status(400).json({message:"invalid credentials"});//if not match ye render hoga

    const isMatch = await bcrypt.compare(password,user.password); //agar email match hui then we will compare password
    if(!isMatch) return res.status(400).json({message:"invalid credentials"}); //if password dint match

    const token = jwt.sign({id : user._id} , process.env.JWT_SECRET, {expiresIn: "1d"});//usle bad aik secret token bnayenge jo navigation 
                                                                                     // mai use hoga through out site for authentication
                                
      
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    }).json({
      message: "Logged in successfully",
      user: { id: user._id, username: user.username, email: user.email }
    });

}catch(err){
    res.status(500).json(err);
}
};

//logout, simply button press pe logout ho jayega , button ko navbar mai bnaya hai
 const logout = async (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

// Check if user is authenticated
const checkAuth = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports =  { register, login, logout, checkAuth };