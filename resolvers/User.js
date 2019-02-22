const User = require('../models/UserModel');
const Problem = require('../models/ProblemModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const judge0Request = require('../judge/requests');
const {key} = require('../config')

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
            //Poblado y devolucion del nuevo usuario para corresponder con el esquema de GraphQL
            return {userId: results._id, token, tokenExpiration: 1};
        }catch(err){
            throw err;
        }
    },
    //LOGIN 
    login: async ({input})=>{
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
            return { userId: user.id, token: token, tokenExpiration: 1 };
        }catch(err){
            throw err;
        }
    },
    user: async(args,req)=>{
        try{
            if(!req.isAuth){
                throw new Error('Unauthenticated')
            }
            user = await User.findById(ObjectId(req.userId))
            return user.populate('solutions')
        }catch (err){
            throw err;
        }
    },
    solutions: async(args, req)=>{
        try{
            if(!req.isAuth){
                throw new Error('Unauthenticated')
            }
            user = await User.findById(ObjectId(req.userId))
            return user.solutions
        }catch (err){
            throw err;
        }
    },
    // sendSolution(problemName: String!, solutionInput: SolutionInput): Solution!
    sendSolution: async({problemName, solutionInput},req)=>{
        try{
            if(!req.isAuth){
                throw new Error('Unauthenticated')
            }
            user = await User.findById(ObjectId(req.userId))
            problem = await Problem.findOne({name: problemName})
            // type Solution{
            //     _id: ID!
            //     problem: Problem!
            //     source_code: String!
            //     language: Int!
            //     success: Boolean
            //     error: String        
            // }
            // input SolutionInput{
            //     source_code: String!
            //     language: Int!
            // }

            solution = {
                problem: problem._id,
                source_code: solutionInput.source_code,
                language: solutionInput.language
            }
            user.solutions.push(solution)
            user.save()
            solution = user.solutions[user.solutions.length - 1]
            judge0Request(problem, user, solution)
            return solution 
        }catch(err){
            throw err;
        }
    }
}