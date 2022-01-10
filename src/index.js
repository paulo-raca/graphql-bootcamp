import { GraphQLServer } from "graphql-yoga";

// Type Definitions (schema)

const typeDefs = `
    type Person {
      name: String!
      bio: String!
      location: String!
    }
    type Query {
        hello: String!
        name: String!
        me: Person
    }
`

// Resolver
const resolvers = {
  Query: {
    hello() {
      return 'Hi!'
    },
    name() {
      return 'Paulo Costa'
    },
    me() {
      return {
        name: 'Paulo Costa',
        bio: 'Sou legal',
        location: 'Campinas, SP, Brazil'
      }
    }
  }
}

const server = new GraphQLServer({typeDefs: typeDefs, resolvers: resolvers})
server.start(() => {
  console.log('Server is running');
})