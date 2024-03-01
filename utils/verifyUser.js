const jwt = require('jsonwebtoken')
const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token){
        return res.status(400).json({
            message : "Unauthorized"
        })
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(400).json({
                message : "Invalid Token"
            })
        }
        req.user = user;
        console.log("user verified")
        next();
    })
}
module.exports ={
    verifyToken,
}