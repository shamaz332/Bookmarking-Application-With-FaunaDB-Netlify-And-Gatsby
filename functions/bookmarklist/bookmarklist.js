const { ApolloServer, gql } = require('apollo-server-lambda')
require('dotenv').config()
var faunadb = require("faunadb"),
  q = faunadb.query;

  var adminClient = new faunadb.Client({
    secret: process.env.SECRET,
  });
const typeDefs = gql`
  type Query {
    bookmarks : [Bookmark]
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
  }
  type Mutation {
    addBookmark(title: String!,url:String!): Bookmark
  }


`



const resolvers = {
  Query: {
    bookmarks: async (root, args, context) => {
      try {
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("bookmarks"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        console.log(result.data);
        return result.data;
      
      } catch (error) {
        console.log(error);
      }
    },
  },
  //adding bookmark
  Mutation:{
    addBookmark:async(_,{title,url})=>{
try{
  const result = await adminClient.query(
    q.Create(q.Collection("bookmarks"),{
      
    })
  )
}
catch(err){
console.log(err)
}
    }
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
