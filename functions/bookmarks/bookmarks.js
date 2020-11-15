const { ApolloServer, gql } = require("apollo-server-lambda")
require("dotenv").config()
var faunadb = require("faunadb"),
  q = faunadb.query

var adminClient = new faunadb.Client({
  secret: process.env.SECRET,
})

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark!]
  }
  type Mutation {
    addBookmark(title: String!, url: String!,description:String!): Bookmark
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
    description: String!
  }
`
const resolvers = {
  Query: {
    bookmarks: async (root, args, context) => {
      try {
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("bookmark"))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result.data);
        return result.data.map(da => {
          return {
            id: da.ref.id,
            title: da.data.title,
            url: da.data.url,
            description: da.data.description,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },

  Mutation: {
    addBookmark: async (_, { title, url,description }) => {
      try {
        const result = await adminClient.query(
          q.Create(q.Collection("bookmarks"), {
            data: {
              title: title,
              url: url,
              description:description
            },
          })
        )

        return result.data
      } catch (error) {
        console.log(error)
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
