import React from 'react'
import { useParams } from "react-router-dom";


function TopicPage() {
    const {topicName} = useParams(); 
  return (
    <div>
        <h1>{decodeURIComponent(topicName)}</h1>
    </div>
  )
}

export default TopicPage