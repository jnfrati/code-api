const Problem = require('../models/ProblemModel')
const judge0Request = require('../judge/requests')
const Solution = require('../models/SolutionModel')
const ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    solutions: async(args, req)=>{
        try{
            if(!req.isAuth){
                throw new Error('Unauthenticated')
            }
            solutions = await Solution.find({owner: ObjectId(req.userId)}).populate('owner').populate('problem')
            return solutions
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

            solution = new Solution({
                owner: req.userId,
                problem: problem._id,
                source_code: solutionInput.source_code,
                language: solutionInput.language
            })
            solution.save()
            judge0Request(problem, solution)
            return solution 
        }catch(err){
            throw err;
        }
    }
}