import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from 'uuid';
 
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


const comments = [
  {
    id: '100',
    text: 'Nice Post!',
    authorId: '34',
    postId: '1',
  },
  {
    id: '101',
    text: 'Aw, thanx!',
    authorId: '5656',
    postId: '1',
  },
  {
    id: '102',
    text: 'I disagree with everything',
    authorId: '17',
    postId: '3',
  },
  {
    id: '103',
    text: 'Post made me sleep',
    authorId: '5656',
    postId: '2',
  }
]

// Type Definitions (schema)
const typeDefs = `
    # Foo Bar
    type Query {
      # Current user
      me: User!
      # All Posts
      post: Post!
      # All Users
      # @param query Filter stuff
      users(query: String): [User!]!
      posts(query: String, published: Boolean): [Post!]!
      comments: [Comment!]!
    }

    type Mutation {
      createUser(name: String!, email: String!, age: Int): User!
      createPost(title: String!, body: String!, published: Boolean!, authorId: ID!): Post!
      createComment(text: String!, authorId: ID!, postId: ID!): Comment!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
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
    comments: (parent, args, context, info) => {
      return comments
    },
  },
  Mutation: {
    createUser(parent, args, context, info) {
      if (users.some( (user) => user.email == args.email )) {
        throw new Error(`Email ${args.email} already registered`)
      }
      const user = {
        id: uuidv4(),
        ...args
      }
      users.push(user)
      return user
    },
    createPost(parent, args, context, info) {
      if (!users.some( (user) => user.id == args.authorId )) {
        throw new Error(`Author ID ${args.authorId} not found`)
      }
      const post = {
        id: uuidv4(),
        ...args
      }
      posts.push(post)
      return post
    },
    createComment(parent, args, context, info) {
      if (!users.some( (user) => user.id == args.authorId )) {
        throw new Error(`Author ID ${args.authorId} not found`)
      }
      if (!posts.some( (post) => post.id == args.postId && post.published )) {
        throw new Error(`Post ID ${args.postId} not found`)
      }
      const comment = {
        id: uuidv4(),
        ...args
      }
      comments.push(comment)
      return comment
    },
  },
  Post: {
    author(parent, args, context, info) {
      return users.find((user) => user.id == parent.authorId)
    },
    comments(parent, args, context, info) {
      return comments.filter((comment) => comment.postId == parent.id)
    },
  },
  User: {
    posts(parent, args, context, info) {
      return posts.filter((post) => post.authorId == parent.id)
    },
    comments(parent, args, context, info) {
      return comments.filter((comment) => comment.authorId == parent.id)
    },
  },
  Comment: {
    author(parent, args, context, info) {
      return users.find((user) => user.id == parent.authorId)
    },
    post(parent, args, context, info) {
      return posts.find((post) => post.id == parent.postId)
    },
  },
}

const server = new GraphQLServer({typeDefs: typeDefs, resolvers: resolvers})
server.start(() => {
  console.log('Server is running');
})