import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from 'uuid';
 
let users = [
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

let posts = [
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


let comments = [
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
      createUser(data: CreateUserInput!): User!
      createPost(data: CreatePostInput!): Post!
      createComment(data: CreateCommentInput!): Comment!

      deleteUser(id: ID!): User!
      deletePost(id: ID!): Post!
      deleteComment(id: ID!): Comment!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
    }

    input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      authorId: ID!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }

    input CreateCommentInput {
      text: String!
      authorId: ID!
      postId: ID!
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
      let ret = users
      if (args.query) {
        ret = ret.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
      }
      return ret
    },
    posts: (parent, args, context, info) => {
      let ret = posts
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
      if (users.some( (user) => user.email == args.data.email )) {
        throw new Error(`Email already registered: ${args.data.email}`)
      }
      const user = {
        id: uuidv4(),
        ...args.data
      }
      users.push(user)
      return user
    },
    createPost(parent, args, context, info) {
      if (!users.some( (user) => user.id == args.data.authorId )) {
        throw new Error(`Author Not Found: ${args.data.authorId}`)
      }
      const post = {
        id: uuidv4(),
        ...args.data
      }
      posts.push(post)
      return post
    },
    createComment(parent, args, context, info) {
      if (!users.some( (user) => user.id == args.data.authorId )) {
        throw new Error(`Author Not Found: ${args.data.authorId}`)
      }
      if (!posts.some( (post) => post.id == args.data.postId && post.published )) {
        throw new Error(`Post Not Found: ${args.postId}`)
      }
      const comment = {
        id: uuidv4(),
        ...args.data
      }
      comments.push(comment)
      return comment
    },
    deleteUser(parent, args, context, info) {
      // Remove user
      let index = users.findIndex( (user) => user.id == args.id )
      if (index == -1) {
        throw new Error(`User Not Found: ${args.id}`)
      }
      const user = users.splice(index, 1)[0]

      // Remove posts
      posts = posts.filter( (post) => {
        if (post.authorId == args.id) {
          comments = comments.filter( (comment) => comment.postId != post.id )
          return false
        } else {
          return true
        }
      })

      // Remove comments
      comments = comments.filter( (comment) => comment.authorId != args.id )

      return user
    },
    deletePost(parent, args, context, info) {
      // Remove post
      let index = posts.findIndex( (post) => post.id == args.id )
      if (index == -1) {
        throw new Error(`Post Not Found: ${args.id}`)
      }
      const post = posts.splice(index, 1)[0]

      comments = comments.filter( (comment) => comment.postId != args.id )

      return post
    },
    deleteComment(parent, args, context, info) {
      // Remove post
      let index = comments.findIndex( (comment) => comment.id == args.id )
      if (index == -1) {
        throw new Error(`Comment Not Found: ${args.id}`)
      }
      const comment = comments.splice(index, 1)[0]
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