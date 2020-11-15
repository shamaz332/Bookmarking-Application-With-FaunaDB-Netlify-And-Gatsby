import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

// This query is executed at run time by Apollo.
const GET_BOOKMARK = gql`
  {
    bookmarks {
      id
      title
      url
    }
  }
`

const ADD_BOOKMARK = gql`
  mutation addBookmark($title: String!, $url: String!) {
    addBookmark(title: $title, url: $url) {
      title
      url
    }
  }
`

export default function Home() {
  const [todos, setTodos] = useState([{}])
  let inputTitle
  let inputUrl
  const [addBookmark] = useMutation(ADD_BOOKMARK)

  const { loading, error, data } = useQuery(GET_BOOKMARK)

  const addBookmarkToDB = () => {
    addBookmark({
      variables: {
        title: inputTitle.value,
        url: inputUrl.value,
      },
      refetchQueries: [{ query: GET_BOOKMARK }],
    })
    inputTitle.value = ""
    inputUrl.value = ""
  }
  if (loading) return <h2>Loading.....</h2>
  if (error) return <h2>Error</h2>

  return (
    <div>
      <label>
        <h1> Add Bookmarks </h1>
        <input
          type="text"
          ref={node => {
            inputTitle = node
          }}
        />
      </label>
      <label>
        <h1> Add Bookmarks </h1>
        <input
          type="text"
          ref={node => {
            inputUrl = node
          }}
        />
      </label>
      <button onClick={addBookmarkToDB}>Add Bookmark</button>
    </div>
  )
}
