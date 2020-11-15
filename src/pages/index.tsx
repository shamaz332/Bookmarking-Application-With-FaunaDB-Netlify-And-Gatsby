import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

//material ui code
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }),
);

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
  const classes = useStyles();
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
      <Typography variant="h3" component="h2">
Bookmark Your Notes 💌
</Typography>
       <form className={classes.root} noValidate autoComplete="off">
      <TextField id="outlined-basic" label="Title" variant="outlined" inputRef={node => {
            inputTitle = node
          }}/>
      <TextField id="outlined-basic" label="Url" variant="outlined"  inputRef={node => {
            inputUrl = node
          }}/>

    </form>
      <Button variant="contained" color="primary" onClick={addBookmarkToDB}>Add Bookmark</Button>
    </div>
  )
}
