import React from 'react'
import { useParams } from "react-router-dom";


function TopicPage() {
    const {topicName} = useParams(); 
  return (
    <div>
        <h1>{decodeURIComponent(topicName)}</h1>
        <p>
          We are working on the notes.
        </p>
        <p>
          It will be ready soon
        </p>
    </div>
  )
}

export default TopicPage