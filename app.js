const express = require('express')
const graphQLHTTP = require('express-graphql')
const schema = require('./schema/schema')
const rootValue = require('./resolvers/index')
// const queries = require('./schema/resolvers/queries')
// const mutations = require('./schema/resolvers/mutations')
const isAuth = require('./middleware/is-auth')
const cors = require('cors')




const mongoose = require('mongoose')

var app = express();
app.use(cors());

app.use(isAuth);

app.use('/graphql', graphQLHTTP({
  schema,
  rootValue,
  graphiql: true,
}))

//mongoose.connect("mongodb://ds229878.mlab.com:29878/gql-jnfrati", {
mongoose.connect("mongodb://localhost:27017/gql-jnfrati",{
  // auth: {
  //     // user: "jnfrati",
  //     // password: "N1c0l@s123-58"
  //     user: "admin",
  //     password: "admin123"
  //   },
      useNewUrlParser: true,
}).then(()=>{
  app.listen(3000, () => {
    console.log('Running a GraphQL API server at localhost:3000/graphql');
  });
}).catch(err =>{
  console.log(err)
});