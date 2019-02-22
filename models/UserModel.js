const {Schema, model} = require('mongoose')

// type Solution{
//     _id: ID!
//     problem: Problem!
//     source_code: String!
//     language: Int!
//     success: Boolean
//     error: String        
// }
const solutionSchema = new Schema({
    problem: {type: Schema.Types.ObjectId, ref: 'Problem'},
    success: Boolean,
    error: String,
    source_code: { type : String, required : true },
    language: { type : Number, required : true }
})
// type User{
//     _id: ID!
//     username: String!
//     password: String!
//     solutions: [Solution]!
// }

const userSchema= new Schema({
    username: { type : String , unique : true, required : true },
    password: { type : String , unique : true, required : true },
    isAdmin: {type: Boolean, required: true},
    solutions: [solutionSchema]
})

const User = model('User', userSchema)

module.exports = User;