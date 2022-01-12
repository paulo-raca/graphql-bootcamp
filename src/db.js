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

const db = { users, posts, comments }

export { db as default }
