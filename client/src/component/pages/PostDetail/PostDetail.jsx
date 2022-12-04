import React from 'react'
import { useLocation } from 'react-router-dom'


const PostDetail = (props) => {

    const location = useLocation()
    const {item} = location.state

    return (
        <div>

            <div>
                <h1>PostDetail</h1>
                <h1>{item._id}</h1>
            </div>
        </div>
    )
}

export default PostDetail