import employSchema from './models/employ.model.js'
import bcrypt from "bcrypt";
import userSchema from "./models/user.model.js"
import pkg from "jsonwebtoken"
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
