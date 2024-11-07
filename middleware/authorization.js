const JWT = require('jsonwebtoken');
const dotenv=require('dotenv')
// dotenv.config()

const adminAuth = (req, res, next) => {
    console.log('adminauth');
    // console.log(req.headers);

    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    // console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1]; // Bearer token
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    //   console.log(token);
    try {
        const decoded = JWT.verify(token, process.env.jwt_secret_Key);
        console.log('decoded', decoded.user.user);

        if (decoded && decoded.user.user===true ) {
            // console.log('decoded', decoded);
            console.log('admin');

            req.userId = decoded.user._id
            req.user = decoded; // attach the decoded token to req.user
            console.log(req.userId);
            

            next();

        }
    } catch (error) {
        return res.status(403).json({ message: 'Token is not valid' });
    }
};

const userAuth = async (req, res, next) => {
    console.log('userauth');
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    
    if (!authHeader) {
        return res.status(401).send('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1]; // Bearer token
    // console.log(token);
    if (!token) {
        console.log('no')
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    try {
        const decoded = JWT.verify(token, process.env.jwt_secret_Key);
        // console.log('decoded', decoded);

        if (decoded) {
            // console.log( decoded.user._id);

            req.userId =decoded.user._id

            next();

        }
    } catch (error) {
        console.log(error);
        
        return res.status(403).json({ message: 'Token is not valid' });

    }
}

module.exports= { userAuth,adminAuth };