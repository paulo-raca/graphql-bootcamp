import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: '5656',
    name: 'Paulo Costa',
    email: 'paulo@example.com',
    age: 34,
  }, 
  {
    id: '17',
    name: 'Zé',
    email: 'joseph@example.com',
    age: null,
  }, 
  {
    id: '34',
    name: 'Beatriz',
    email: 'bia@example.com',
    age: 30,
  },
]

const posts = [
  {
    id: '1',
    title: 'Everything is Awesome',
    body: "Haven't you watched the Lego Movie yet?",
    published: true
    ,
    authorId: '5656',
  },
  {
    id: '2',
    title: 'Mary had a little lamb',
    body: "It's fleece was white as snow\nAnd everythere that Mary went,\nThe lamb was sure to go",
    published: true,
    authorId: '17',
  },
  {
    id: '3',
    title: 'Let\'s learn GraphQL',
    body: "Work in progress...",
    published: false,
    authorId: '5656',
  },
]

// Type Definitions (schema)
const typeDefs = `
    type Query {
      me: User!
      post: Post!
      users(query: String): [User!]!
      posts(query: String, published: Boolean): [Post!]!
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
      author(index: Int): User!
    }
`

// Resolver
const resolvers = {
  Query: {
    me: () => {
      return users[0]
    },
    post: () => {
      return posts[0]
    },
    users: (parent, args, context, info) => {
      var ret = users
      if (args.query) {
        ret = ret.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
      }
      return ret
    },
    posts: (parent, args, context, info) => {
      var ret = posts
      if (args.query) {
        ret = ret.filter((post) => {
          return post.title.toLowerCase().includes(args.query.toLowerCase())
              || post.body.toLowerCase().includes(args.query.toLowerCase())
        })
      }
      if (args.published != null) {
        ret = ret.filter((post) => post.published == args.published)
      }
      return ret
    },
  },
  Post: {
    author(parent, args, context, info) {
      return users.find((user) => user.id == parent.authorId)
    } 
  }
}

const server = new GraphQLServer({typeDefs: typeDefs, resolvers: resolvers})
server.start(() => {
  console.log('Server is running');
})