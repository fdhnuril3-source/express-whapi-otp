var jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    const token = req.header('Authorization')?.replace('Bearer', '');
    if(!token){
        return res.status(403).json({Message: 'Token required'})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
        if(err){
             return res.status(403).json({Message: 'Invalid or expired token'});
        }
        req.user = decoded;
        next();
    });
}

module.exports = verifyToken