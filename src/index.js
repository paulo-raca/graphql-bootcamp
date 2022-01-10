import { GraphQLServer } from "graphql-yoga";

// Type Definitions (schema)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float


        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

// Resolver
const resolvers = {
  Query: {
    id: () => '5656',
    name: () => 'Paulo Costa',
    age: () => 34,
    employed: () => false,
    gpa: () => null,


    title: () => "Thingy",
    price: () => 99.99,
    releaseYear: () => 1998,
    rating: () => 4.7,
    inStock: () => true,
  }
}

const server = new GraphQLServer({typeDefs: typeDefs, resolvers: resolvers})
server.start(() => {
  console.log('Server is running');
})