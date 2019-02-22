const Problem = require('../models/ProblemModel')
const User = require('../models/UserModel')
const ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    addNewProblem: async ({name, description}, req)=>{
        try{
            if(!req.isAuth){
                throw new Error('Unauthenticated')
            }
            user = await User.findById(ObjectId(req.userId))
            if(!user.isAdmin){
                throw new Error('Not admin!')
            }
            const existingProblem = await Problem.findOne({name})
            if(existingProblem)
                throw new Error('Problem name already exists')
            
            
            const problem = new Problem({
                name,
                description,
                owner: user._id
            });
            result = await problem.save();
            return result;
        }catch (err){
            throw err;
        }
    },
    addTestCase: async ({problemName, input, output},req)=>{
        try{
            if(!req.isAuth){
                throw new Error('Unauthenticated')
            }
            user = await User.findById(ObjectId(req.userId))
            if(!user.isAdmin){
                throw new Error('Not admin!')
            }
            const problem = await Problem.findOne({name: problemName})
            problem.testCases.push({input,output})
            return problem.save()
        }catch (err){
            throw err;
        }
    },
    problems: async (args, req) =>{
        try{
            if(!req.isAuth){
                throw new Error('Unauthenticated')
            }
            return Problem.find().populate('owner');
        }catch (err){
            throw err;
        }
    },
    problem: async ({name}, req) =>{
        try{
            if(!req.isAuth){
                throw new Error('Unauthenticated')
            }
            return Problem.findOne({name}).populate('owner');
        }catch (err){
            throw err;
        }
    },
}