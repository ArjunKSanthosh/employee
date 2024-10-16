import employSchema from './models/employ.model.js'
import bcrypt from "bcrypt";
import userSchema from "./models/user.model.js"
import pkg from "jsonwebtoken"
import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port:2525,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "378a61f3f1ec93",
      pass: "3dffcf6d10e7ac",
    },
  });
const {sign}=pkg;

export async function countEmployees(req,res) {
    try {
        const count=await employSchema.countDocuments({});
        console.log(count);
        
        return res.status(200).send({msg:count})
        
    } catch (error) {
        return res.status(404).send({msg:error})
    }
}
export async function addEmp(req,res){
    try{
        const{...employ}=req.body;
        const {empid}=req.body;
        const check=await employSchema.findOne({empid});
        if (!check) {
            const data=await employSchema.create({...employ});
            return res.status(201).send({msg:data})
        }
        return res.status(400).send({msg:"data exist"})
        
    }catch(error){
        res.status(404).send({msg:error})
    }
} 
export async function getEmployees(req,res) {
    try {
        console.log(req.user.userId);
        const _id=req.user.userId;
        const user=await userSchema.findOne({_id})
        console.log(user);
        if(!user)
             return res.status(403).send({msg:"Unauthorised Access"})
        const employees=await employSchema.find();
    res.status(200).send({employees,username:user.username})
        
        // const employees=await employSchema.find();
        // res.status(200).send(employees)
        
    } catch (error) {
        res.status(404).send({msg:error})
    }
}

export async function getEmploy(req,res) {
    try {
        console.log(req.params);
        const {id}=req.params
        const data=await employSchema.findOne({_id:id});
        console.log(data);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error)
    }
}
export async function editEmploy(req,res) {
    try {
        const {_id}=req.params;
    const {...employ}=req.body;
    const data=await employSchema.updateOne({_id},{$set:{...employ}});
    res.status(201).send(data);
    } catch (error) {
        res.status(404).send(error)
    }
    
}
export async function deleteEmploy(req,res) {
    try {
        const {_id}=req.params;
        console.log(_id);
        const data=await employSchema.deleteOne({_id});
        res.status(201).send(data);
    } catch (error) {
        res.status(404).send(error)
    }   
}
//register user 
export async function signUp(req,res){
    try{
        console.log(req.body);
        
        const { email,username,password,cpassword }=req.body;
        console.log(email,username,password,cpassword);
        if(!(email&& username&& password&& cpassword)){
            return res.status(404).send({msg:"Fields are empty"});
        }
        if(password !== cpassword){
            return res.status(404).send({msg:"Password does not match"});

        }
        bcrypt
            .hash(password,10)
            .then((hashedPassword)=>{
                userSchema
                    .create({email,username,password:hashedPassword})
                    .then(()=>{
                        console.log("Success");
                        
                        return res.status(201).send({msg:"Success"});
                    })
                    .catch((error)=>{
                        return res.status(404).send({msg:"Not registered"});

                    })
            })
            .catch((error)=>{
                return res.status(404).send({msg:error});

            })
        
    }catch(error){
        return res.status(404).send({msg:error});

    }
}
export async function signIn(req,res){
    console.log(req.body);
    const{email,password}=req.body;
    if(!(email&&password))
        return res.status(404).send({msg:"Fields are empty"})
    const user=await userSchema.findOne({email})
    if(user===null)
        return res.status(404).send({msg:"Invalid Username"})

    //convert password into hash and compare using bcrypt

    const success=await bcrypt.compare(password,user.password)
    console.log(success);
    if(success!==true)
        return res.status(404).send({msg:"Email and password is invalid"})
    //Generate token using sign
    const token=await sign({userId:user._id},process.env.JWT_KEY,{expiresIn:"24h"})
    console.log(token);
    return res.status(200).send({msg:"Succesfully Logged in",token})
    
}
export async function forgetPassword(req,res) {
    const {email}=req.body;
//     console.log(email);
    
    const user=await userSchema.findOne({email})
    if(!user)
        return res.status(403).send({msg:"User doesn't exist"})
    const otp=Math.floor(Math.random()*1000000);
    const update=await userSchema.updateOne({email},{$set:{otp:otp}})
    console.log(update);
     // send mail with defined transport object
    const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<h1>${otp}</h1>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  return res.status(201).send({email});
}
export async function otpCheck(req,res){
    const{email,otp}=req.body;
    
    const check=await userSchema.findOne({$and:[{email:email},{otp:otp}]})
    if(!check)
        return res.status(403).send({msg:"OTP does not match"})
    return res.status(201).send({msg:"OTP matched succesfully"})
}
export async function resetPassword(req,res){
    const{email,password}=req.body;
    const update=await userSchema.updateOne({email},{$set:{otp:""}});
    bcrypt.hash(password,10).then((hashedPassword)=>{
     userSchema.updateOne({email},{$set:{password:hashedPassword}}).then(()=>{
        return res.status(200).send({msg:"Success"})
     }).catch((error)=>{
        return res.status(404).send({msg:error});
     })
    }).catch((error)=>{
        return res.status(404).send({msg:error});
    })
}
