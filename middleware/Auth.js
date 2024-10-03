import pkg from  "jsonwebtoken";
const {verify}=pkg;
export default async function Auth(req,res,next){
    try {
        const key=req.headers.authorization
        console.log(key);
        
        if(!key)
            return res.status(403).send({msg:"Unauthorised Access"});
        const token=key.split(" ")[1];
        const auth=await verify (token,process.env.JWT_KEY);

        req.user=auth;
        next();
    } catch (error) {
        return res.this.status(403).send({msg:"Session expired please login again"});
        
    }
}