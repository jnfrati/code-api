const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const {key} = require('../config')
const cookieSetter = require('../middleware/cookie')

module.exports = {
    registerUser: async (args)=>{
        try{
            const existingUser = await User.findOne({username: args.input.username});
            if(existingUser)
                throw new Error('El usuario ya existe');
            const hashedPassword = await bcrypt.hash(args.input.password, 12);
            const user = new User({
                username: args.input.username,
                password: hashedPassword,
                isAdmin: false
            })
            const results = await user.save();
            const token = jwt.sign(
                { userId: results._id, username: results.username },
                key,
                {
                expiresIn: '1h'
                }
            );
            return cookieSetter(context.res, context.req, token)
        }catch(err){
            throw err;
        }
    },
    //LOGIN 
    login: async ({input}, context)=>{
        
        try{
            const user = await User.findOne({username: input.username});
            if(!user)
                throw new Error('El username no existe');
            const isEqual = await bcrypt.compare(input.password, user.password)
            if(!isEqual)
                throw new Error('Las contraseñas no coinciden');
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                key,
                {
                expiresIn: '1h'
                }
            );
            return {
                logged: cookieSetter(context.res, context.req, token)
            }
        }catch(err){
            throw err;
        }
    },
    user: async(args,context)=>{
        try{
            if(!context.req.isAuth){
                throw new Error('Unauthenticated')
            }
            user = await User.findById(ObjectId(req.userId))
            return user.populate('solutions')
        }catch (err){
            throw err;
        }
    },
}