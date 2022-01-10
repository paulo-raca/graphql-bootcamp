import { GraphQLServer } from "graphql-yoga";

// Type Definitions (schema)
const typeDefs = `
    type Query {
      me: User!
      post: Post!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
    }
`

// Resolver
const resolvers = {
  Query: {
    me: () => {
      return {
        id: '5656',
        name: 'Paulo Costa',
        email: 'paulo@example.com',
        age: 34,
      }
    },
    post: () => {
      return {
        id: '1234',
        title: 'Everything is Awesome',
        body: "Haven't you watched the Lego Movie yet?",
        published: true
      }
    },
  }
}

const server = new GraphQLServer({typeDefs: typeDefs, resolvers: resolvers})
server.start(() => {
  console.log('Server is running');
})