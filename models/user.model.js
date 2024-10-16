import mongoose from "mongoose"
import mogoose, {Mongoose} from "mongoose"

const userSchema= new mongoose.Schema({
    email:{type:String},
    username:{type:String},
    password:{type:String},
    otp:{type:String}
})

export default mogoose.model.Users||mongoose.model("User",userSchema);