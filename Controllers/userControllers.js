const USER = require("../Models/userModel");
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


const signup = async (req, res) => {
    console.log('SIGNUP router');
    console.log(req.body);
    const { FirstName, LastName, Mobile, Email, Password } = req.body
    const IfEmail = await USER.findOne({ Email: req.body.Email })
    console.log(IfEmail);
    if (IfEmail) {
        return res.status(409).json(`${req.body.Email} is already exist`)
    }

    const IfMobile = await USER.findOne({ Mobile: req.body.Mobile })
    console.log(IfMobile);

    if (IfMobile) {
        return res.status(409).json(`${req.body.Mobile} is already exist`)
    }
    try {
        const saltvalue = 10
        const hashedPassword = await bcrypt.hash(req.body.Password, saltvalue)
        console.log(hashedPassword);
        const data = new USER({
            FirstName: FirstName, LastName: LastName, Email: Email, Mobile: Mobile, Password: hashedPassword
        })
        await data.save()
        return res.status(201).json(`Hello ${FirstName.toUpperCase()} \nYou are Successfuly Created`)

    } catch (error) {
        console.log(error);
        return res.status(500).json('internal server error')
    }

}

const login = async (req, res) => {
    const { userId, User_Password } = req.body;
    try {
        // Check if userId is an email or a mobile number
        const isEmail = /\S+@\S+\.\S+/.test(userId);
        let findUser;

        // Find user by email or mobile
        if (isEmail) {
            findUser = await USER.findOne({ Email: userId });
        } else {
            findUser = await USER.findOne({ Mobile: userId });
        }

        console.log(findUser);
        if (findUser) {
            const passwordTrue = await bcrypt.compare(User_Password, findUser.Password);
            console.log(passwordTrue);
            if (!passwordTrue) {
                return res.status(401).json('Invalid Password');
            }
            findUser.Password = undefined;
            // const token = JWT.sign({ user: findUser }, process.env.jwt_secret_Key, { expiresIn: '1h' });
            const token = JWT.sign({ user: findUser }, process.env.jwt_secret_Key);

            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });

            console.log(token);
            console.log(findUser);

            return res.status(200).json({ message: 'Successfully logged in', token });
        }
        return res.status(401).json('Invalid UserId');

    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal server error');
    }
};

const forgot = async (req, res) => {
    console.log(req.body);
    const { Email, Mobile, Password } = req.body
    try {
        const exist = await USER.findOne({ Email: Email, Mobile: Mobile })
        console.log(exist);
        if (!exist) {
            return res.status(400).json({ message: `${Mobile} is not registered` })
        }
        const saltvalue = 10
        const hashedPassword = await bcrypt.hash(Password, saltvalue)
        const updated = await USER.findOneAndUpdate(
            { Email: Email, Mobile: Mobile },
            { $set: { Password: hashedPassword } },
            { new: true }
        );
        console.log(updated);
        return res.status(200).json({ message: `Hi ${exist.FirstName.toUpperCase()},\nYour password has been updated successfully.` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' })

    }

}

const address = async (req, res) => {
    console.log(req.body);
    console.log(req.userId);
    const id = req.userId
    const { PIN, AddressLine1, AddressLine2, AddressLine3 } = req.body
    if (PIN == 673508) {
        try {
            const find = await USER.findByIdAndUpdate(
                id, // Ensure 'id' is defined or passed correctly
                {
                    PIN: PIN,
                    AddressLine1: AddressLine1,
                    AddressLine2: AddressLine2,
                    AddressLine3: AddressLine3
                },
                { new: true } // Return the updated document
            );
            find.Password=null
            console.log(find)

            return res.status(200).json('Adress added Successfully')
        } catch (error) {
            console.log(error);
            return res.status(500).json('internal server error')

        }
    }else{
        return res.status(401).json(`can't send to this ${PIN}`)
    }


}
   
module.exports = { login, signup, forgot, address }    