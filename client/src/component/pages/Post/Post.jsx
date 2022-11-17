import { useEffect, useState, useContext } from 'react';
import UserProvider from "../../../Context/UserProvider";
import FileBase64 from 'react-file-base64';

import * as PostAPI from "../../../API/PostRequest.js";
import "./Post.css";
import clockImg from "./001-clock.png"
import commentImg from "./comment.png"
import deleteImg from './delete.png'

const Post = () => {

    const user = useContext(UserProvider.context);

    // user object id for testing use.
    const userID = user._id;

    const initPost = {
        userId: userID,
        title: "",
        description: "",
        file: "",
    }

    const [postData, setPost] = useState(initPost)
    const [postTemp, setTemp] = useState(initPost)
    const changePost = (e) => {
        setPost(
            { ...postData, [e.target.name]: e.target.value }
        )

        setTemp(
            { ...postTemp, [e.target.name]: e.target.value.substring(0, 50) + ifAddpoints(e.target.value) }
        )

    }

    const ifAddpoints = (words) => {
        return words.length > 50 ? "..." : ""
    }


    const [items, setItems] = useState([])

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const result = await PostAPI.createPost(postData)
            console.log("Submitted the post.")
            setPost(initPost);
            setTemp(initPost);
            const { newPost } = result.data
            setItems([...items, newPost]);
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(
        () => {
            async function fetchData() {
                try {
                    const result = await PostAPI.getAllMyPosts(userID);
                    // console.log('fetch data:', result)
                    const data = result.data
                    setItems(data)
                    // console.log(items.length)
                    // console.log(items)
                } catch (error) {
                    console.log("fetchdata error:")
                    console.log(error)

                }
            };

            fetchData();
        }
        , []);


    return (
        <div className="PostBigcontainer">

            <div className="PostContainer">

                <div className="postWrapper">
                    <pre className='postData'>{JSON.stringify(postTemp, null, '\t')}</pre>

                    <form className='postForm ' action="">
                        <input
                            type="text"
                            className="postTitle"
                            placeholder=' Title'
                            name='title'
                            value={postData.title}
                            onChange={changePost}
                        />
                        <textarea
                            type="text"
                            className="postDesc"
                            placeholder=' Description'
                            name='description'
                            value={postData.description}
                            onChange={changePost}
                        />

                        <FileBase64
                            className="postFile"
                            type="file"
                            multiple={false}
                            onDone={({ base64 }) => { setPost({ ...postData, file: base64 }); setTemp({ ...postTemp, file: base64.substring(0, 50) + "..." }) }}
                        />
                        <button className="btnPost" onClick={onSubmitHandler}>Post</button>

                    </form>
                </div>

                {/* <div className="cardContainer"> */}
                    {items?.map(item => (

                        <div className="card" key={item._id}>

                            <div className="cardTimeWraper">
                                <img src={clockImg} alt="Icons made by Freepik from flaticon.com" className='timeImg' />
                                <span className="cardTime">Post created at {item.createdAt.substring(0, 10)}</span>
                            </div>

                            <hr class="hr-mid-circle" />

                            {item.file ?
                                (<div className="cardImgContainer">
                                    <img className="cardImage" src={item.file} />
                                </div>)
                                :
                                <div style={{ marginTop: "15px" }} />}

                            <div className="titleWrapper">
                                <span className="cardTitle">{item.title}</span>
                            </div>

                            {/* likes, number of comments */}
                            <div className="cardCommentWraper">
                                <img src={deleteImg} alt="Icons is from flaticon.com" className='deleteImg' />
                                <div className="commentWrapper">
                                    <img src={commentImg} alt="Icons is from flaticon.com" className='commentImg' />
                                    <span className="cardComment">{item.comments.length}</span>
                                </div>
                            </div>

                        </div>
                    ))}

                {/* </div> */}


            </div>

        </div>

    );
}

export default Post
