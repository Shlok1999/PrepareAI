import React from 'react'
import { useParams } from "react-router-dom";


function TopicPage() {
    const {topicName} = useParams(); 
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: '30%'}}>
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