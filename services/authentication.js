const JWT=require("jsonwebtoken")


function generateToken(email,name){
    const payload={
        email:email,
        name:name,
        role:"ADMIN"
    }
    return JWT.sign(payload,process.env.SECRET,{expiresIn:'1d'})
}


function verifyToken(token){
    try {
        const payload=JWT.verify(token,process.env.SECRET)
        return payload
    } catch (error) {
        return null;
    }
}

module.exports={
    generateToken,verifyToken
}