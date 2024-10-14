const checkSession = (req, res, next) => {
    const headerAuth = req.headers.authorization || '';
    const token = headerAuth.split(' ').pop()
    if(token != 5){
        res.status(405);
        res.send({error: 'Token no valido'});
    }else{
        next();
    }
}

module.exports = { checkSession };