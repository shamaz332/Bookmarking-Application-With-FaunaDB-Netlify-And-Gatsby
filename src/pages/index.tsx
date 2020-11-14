import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';


// This query is executed at run time by Apollo.
const GET_BOOKMARKS = gql`
{
 bookmarks{ 
   id,
   title,
   url
  
 }
}
`

const ADD_BOOKMARK = gql`
mutation addBookmark($title:String!,$url:String)
{
  addBookmark(title :$title,url:$url)
{
  id,

}
}
`







export default function Home() {
  let bookmarktitle;
  let bookmarkUrl;
  const [addBookmark] = useMutation(ADD_BOOKMARK)
  const { loading, error, data } = useQuery(GET_BOOKMARKS);
  
  // adding bookmark
  const addData = () => {
    addBookmark({
      variables: {
        title: bookmarktitle.value,
        url:bookmarkUrl.value

      },
      refetchQueries: [{ query: GET_BOOKMARKS }]
    })
    bookmarktitle.value = "";
    bookmarkUrl.value = "";
  }

  
  
  
  if (loading)
    return <h2>Loading.....</h2>
  if (loading)
    return <h2>Error</h2>

  return (
    <div>

<label>
  Bookmark Title
  <input type="text" ref={node => {
          bookmarktitle = node;
        }}/>
</label>
<label>
  Bookmark url
  <input type="text" ref={node => {
          bookmarkUrl = node;
        }}/>
</label>
<button onClick={addData}> Add </button>
    </div>
  );

}