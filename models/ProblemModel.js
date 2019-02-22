const {Schema, model} = require('mongoose')

// type Problem{
//     _id: ID!
//     name: String!
//     description: String!
// }

const testCaseSchema = new Schema({
  input:{ type : String, required : true },
  output:{ type : String, required : true },  
})

const problemSchema= new Schema({
    name: { type : String , unique : true, required : true },
    description: { type : String, required : true },
    testCases:[testCaseSchema],
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true }
})


const Problem = model('Problem', problemSchema)

module.exports = Problem;