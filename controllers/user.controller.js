const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const test = (req,res)=>{
    res.status(200).json({
        message : "Api is working"
    })
}
const updateUser = async(req,res)=>{
    try {
        const updateFields = {
            username: req.body.username,
            email: req.body.email,
        };
        const userid = req.user.id;
        const user = await User.findById({_id:userid})
        if(user.email !== req.body.email){
            const checkEmail = await User.findOne({email})
            if(checkEmail){
                return res.status(400).json({
                    error : "Email Already exits"
                })
            }
        }

        // Only include password if provided
        if (req.body.password !== undefined && req.body.password !== null) {
            const updatedPassword = bcryptjs.hashSync(req.body.password,10);
            updateFields.password = updatedPassword;
        }
        // Only include profilePicture if provided
        if (req.body.profilePicture !== undefined && req.body.profilePicture !== null) {
            updateFields.profilePicture = req.body.profilePicture;
        }
        const updateUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true } // Returns the modified document
        );
    
        // For security reasons, setting the password to null before sending the response
        updateUser.password = null;
    
        res.status(200).json({
            message: "User updated successfully",
            user: updateUser
        });
    } catch (error) {
        return res.status(500).json({
            message: "Backend error internal server error"
        });
    }
    
}
const deleteUser = async(req,res)=>{
   try {
     const userid = req.user.id;
     await User.findByIdAndDelete({_id : userid});
     return res.status(200).json({
         success : true,
         message : "User Deleted successfully"
     })
   } catch (error) {
        return res.status(500).json({
            error : error,
            message : "Backend error while deleting user"
        })
   }

}

module.exports = {
    test,
    updateUser,
    deleteUser,
}