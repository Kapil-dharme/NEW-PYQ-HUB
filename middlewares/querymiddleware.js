function queryhandler(){
    return (req,res,next)=>{
        res.locals.success=req.query.success || null
        res.locals.error=req.query.error || null
        next()
    }
}

module.exports={
    queryhandler
}