const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')

const jwt = require('jsonwebtoken')
const { v1: uuid } = require('uuid')
require('dotenv').config()
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const mongoose = require('mongoose')
const { argsToArgsConfig } = require('graphql/type/definition')
const JWT_SECRET = process.env.SECRET


mongoose.set('useFindAndModify', false)

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology: true })
   .then(() => {
     console.log('connected to MongoDB')
   })
   .catch((error) => {
     console.log('error connecting to MongoDB:', error.message)
   })



const typeDefs = gql`
type Book {
  title: String!
  published: Int!
  author: Author
  id: ID!
  genres: [String]!
}

type User {
  username: String!
  favouriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}


type Author {
  name: String!
  born: Int
  id: ID!
  bookCount: Int
}

type Query {
  bookCount: Int!
  authorCount: Int
  allGenres: [String]!
  allBooks(author: String, genre: String): [Book!]!
  allAuthors: [Author!]!
  me: User
}



type Mutation {
  addBook(
    title: String!
    published: Int!
    author: String!
    genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favouriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
   
`

const resolvers = {
  Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),

      allBooks: (root, args) =>{

             if(args.genre){
               return Book.find({genres: {$in: args.genre}}).populate('author')
             }
             return Book.find({}).populate('author')

      }
      ,
      allAuthors: () => 
         Author.find({})
      ,
      me: (root, args, context) => {
        return context.currentUser
      }
    
  },
      Mutation: {
        addBook: async (root, args, context) => {

          const currentUser = context.currentUser

          if(!currentUser){
            throw new AuthenticationError("not authenticated")
          }
          const authorfromDB = await Author.findOne({ name: args.author })
          
          //if author not already in database
          if(!authorfromDB) {
            try{
              const author = new Author({
                name: args.author,
                bookCount: 0
              })
              await author.save()
            } catch(error){
              throw new UserInputError(error.message, {
                args: args
              })
            }
          }
          const author = await Author.findOne({ name: args.author })
          author.bookCount = author.bookCount + 1
          await author.save()

          const book = new Book ({ ...args, author: author})
          
          try {
            await book.save()
          } catch(error) {
            throw new UserInputError(error.message, {
              args: args
            })
          }
          return book
        },
        
        editAuthor: async (root, args, context) => {
          const currentUser = context.currentUser
          

          if(!currentUser){
            throw new AuthenticationError("not authenticated")
          }

          let author =  await Author.findOne({name: args.name})
          author.born = args.setBornTo
          try {
            await author.save()
          } catch(error) {
            throw new UserInputError(error.message, {
              args: args
            })
          }
        },

        createUser: async (root, args) => {

          
          const user = new User({username: args.username,
                                 favouriteGenre: args.favouriteGenre})
          try {
            await user.save()
          } catch(error) {
            throw new UserInputError(error.message, {
              arguments: args
            })
            
          }
          return user
        },

        login: async (root, args) => {
          const user = await User.findOne({username: args.username})

          if(!user || args.password !== 'secret'){
            throw new UserInputError('wrong credentials')
          }

          const userForToken = {
            username: user.username,
            id: user._id
          }

          return { value: jwt.sign(userForToken, JWT_SECRET) }
        }
               
      }
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }

    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


