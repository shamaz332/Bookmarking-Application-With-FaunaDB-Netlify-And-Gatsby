import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

//material ui code
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Grid, Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        flexGrow: 1,
        minWidth: 345,
      },


    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    card:{
      maxWidth: 345,
      backgroundColor:"black",
      margin:13,
      color:"white",
    },
  }),
);

// This query is executed at run time by Apollo.
const GET_BOOKMARK = gql`
  {
    bookmarks {
      id,
      title,
      url,
      description
    }
  }
`
const ADD_BOOKMARK = gql`
  mutation addBookmark($title: String!, $url: String!,$description:String!) {
    addBookmark(title: $title, url: $url,description:$description) {
      title
      url
      description
    }
  }
`

export default function Home() {
  const classes = useStyles();
  let inputTitle
  let inputUrl
  let inputDescription
  const [addBookmark] = useMutation(ADD_BOOKMARK)
  const { loading, error, data } = useQuery(GET_BOOKMARK)

  const addBookmarkToDB = () => {
    addBookmark({
      variables: {
        title: inputTitle.value,
        url: inputUrl.value,
        description: inputDescription.value
      },
      refetchQueries: [{ query: GET_BOOKMARK }],
    })
    inputTitle.value = ""
    inputUrl.value = ""
    inputDescription.value = ""
  }
  if (loading) return <h2>Loading.....</h2>
  if (error) return <h2>Error</h2>
  console.log(data.bookmarks)
  return (
    <div>
      <Typography variant="h3" component="h2">
        Bookmark Your Notes 💌
</Typography>

      <form className={classes.root} autoComplete="off">
        <TextField required id="outlined-required" label="Title" variant="outlined" inputRef={node => {
          inputTitle = node
        }} />
        <TextField required id="outlined-required" label="Url" variant="outlined" inputRef={node => {
          inputUrl = node
        }} />
        <TextField required id="outlined-required" label="Description" variant="outlined" inputRef={node => {
          inputDescription = node
        }} />

      </form>
      <br /><br />
      <Button variant="contained" color="primary" onClick={addBookmarkToDB}>Add Bookmark</Button>
      <br /><br />
      <Grid container>
{data.bookmarks.map((d)=>(

<Card className={classes.card}>
<CardActionArea>
  <CardContent>
    <Typography variant="h5" component="h2">
      {d.title}
    </Typography>
    <Typography variant="body2"component="p">
     {d.description}
    </Typography>
    <br/>    <br/>
    <Button  variant="contained" color="primary" href={d.url}>
    Learn More
  </Button>
  </CardContent>
</CardActionArea>
</Card>


))}
</Grid>
    </div>
  )
}
