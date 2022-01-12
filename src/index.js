import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from 'uuid';
import db from './db'

// Resolver
const resolvers = {
  Query: {
    me: () => {
      return users[0]
    },
    post: () => {
      return posts[0]
    },
    users: (parent, args, { db }, info) => {
      let ret = db.users
      if (args.query) {
        ret = ret.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
      }
      return ret
    },
    posts: (parent, args, { db }, info) => {
      let ret = db.posts
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
    comments: (parent, args, { db }, info) => {
      return db.comments 
    },
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      if (db.users.some( (user) => user.email == args.data.email )) {
        throw new Error(`Email already registered: ${args.data.email}`)
      }
      const user = {
        id: uuidv4(),
        ...args.data
      }
      db.users.push(user)
      return user
    },
    createPost(parent, args, { db }, info) {
      if (!db.users.some( (user) => user.id == args.data.authorId )) {
        throw new Error(`Author Not Found: ${args.data.authorId}`)
      }
      const post = {
        id: uuidv4(),
        ...args.data
      }
      db.posts.push(post)
      return post
    },
    createComment(parent, args, { db }, info) {
      if (!db.users.some( (user) => user.id == args.data.authorId )) {
        throw new Error(`Author Not Found: ${args.data.authorId}`)
      }
      if (!db.posts.some( (post) => post.id == args.data.postId && post.published )) {
        throw new Error(`Post Not Found: ${args.postId}`)
      }
      const comment = {
        id: uuidv4(),
        ...args.data
      }
      db.comments.push(comment)
      return comment
    },
    deleteUser(parent, args, { db }, info) {
      // Remove user
      let index = db.users.findIndex( (user) => user.id == args.id )
      if (index == -1) {
        throw new Error(`User Not Found: ${args.id}`)
      }
      const user = db.users.splice(index, 1)[0]

      // Remove posts
      db.posts = db.posts.filter( (post) => {
        if (post.authorId == args.id) {
          db.comments = db.comments.filter( (comment) => comment.postId != post.id )
          return false
        } else {
          return true
        }
      })

      // Remove comments
      db.comments = db.comments.filter( (comment) => comment.authorId != args.id )

      return user
    },
    deletePost(parent, args, { db }, info) {
      // Remove post
      let index = db.posts.findIndex( (post) => post.id == args.id )
      if (index == -1) {
        throw new Error(`Post Not Found: ${args.id}`)
      }
      const post = db.posts.splice(index, 1)[0]

      // Remove comments
      db.comments = db.comments.filter( (comment) => comment.postId != args.id )

      return post
    },
    deleteComment(parent, args, { db }, info) {
      // Remove comment
      let index = db.comments.findIndex( (comment) => comment.id == args.id )
      if (index == -1) {
        throw new Error(`Comment Not Found: ${args.id}`)
      }
      const comment = db.comments.splice(index, 1)[0]
      return comment
    },
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id == parent.authorId)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.postId == parent.id)
    },
  }, 
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter((post) => post.authorId == parent.id)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.authorId == parent.id)
    },
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id == parent.authorId)
    },
    post(parent, args, { db }, info) {
      return db.posts.find((post) => post.id == parent.postId)
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
   resolvers: resolvers,
   context: {
     db 
   }
})
server.start(() => {
  console.log('Server is running');
})