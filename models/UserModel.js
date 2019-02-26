const {Schema, model} = require('mongoose')

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
    solutions: [{type: Schema.Types.ObjectId, ref: 'Solution'}]
})

const User = model('User', userSchema)

module.exports = User;