module.exports = (res, req, token)=>{
    try {
        if(req.cookies.token === undefined)
            res.cookie('token',token, { maxAge: 900000, httpOnly: true });
        return true;
    } catch (error) {
        return false;
    }
}