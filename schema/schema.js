const {buildSchema} = require('graphql');

module.exports = buildSchema(`
    type Solution{
        _id: ID!
        owner: User!
        problem: Problem!
        source_code: String!
        language: Int!
        success: Boolean
        error: String        
    }
    input SolutionInput{
        source_code: String!
        language: Int!
    }

    type User{
        _id: ID!
        username: String!
        password: String!
        isAdmin: Boolean!
        solutions: [Solution]!
    }
    
    input UserInput{
        username: String!
        password: String!
    }

    type AuthData{
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }    

    type TestCase{
        _id: ID!
        input: String!
        output: String!
    }
    type Problem{
        _id: ID!
        name: String!
        description: String!
        testCases: [TestCase]!
        owner: User!
    }

    type Query{
        login(input: UserInput): AuthData!
        user: User!
        problems: [Problem!]!
        problem(name: String!): Problem!
        solutions: [Solution]!
    }

    type Mutation{
        registerUser(input: UserInput): AuthData!
        addNewProblem(name: String!, description: String!): Problem!
        addTestCase(problemName: String!, input:String!, output:String!):Problem!
        sendSolution(problemName: String!, solutionInput: SolutionInput): Solution!
    }
`);