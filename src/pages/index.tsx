import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';


// This query is executed at run time by Apollo.
const GET_TODOS = gql`
{
 bookmarks{ 
   id,
   task,
   status
  
 }
}
`;






export default function Home() {
  return <div>Hello world!</div>
}
