import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { Tag, notification, Avatar } from 'antd';
import { SmileTwoTone, HeartOutlined, StarOutlined, UserOutlined, WarningFilled } from '@ant-design/icons';
import moment from 'moment';

import "./PostDetail.css"
import useWindowDimensions from '../../WindowDimension/WD'
import * as CommentAPI from "../../../API/CommentRequest"
import UserProvider from "../../../Context/UserProvider";
import * as updateResumeAPI from "../../../API/PostRequest.js";
import * as PostAPI from "../../../API/PostRequest.js";

const PostDetail = (props) => {
  const [loading, setLoading] = useState(false);

  //current user object.
  const user = useContext(UserProvider.context);
  const userID = user._id;
  const { width } = useWindowDimensions();
  const newWindow = () => {
    let pdfWindow = window.open("")
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src=" + encodeURI(item.file) + "></iframe>"
    )
  }

  // use to scroll to a ref location (comment section in this case)
  const ref = useRef(null);
  const handleJump = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  //=============================== fetch post by parameter ====================================
  const postID = useParams().id;
  const [item, setItem] = useState(null)

  const fetchPost = async () => {
    try {
      setLoading(true)
      const res = await PostAPI.getPost(postID);
      setItem(res.data);
      if (res.data.likes.includes(userID))
        setHeart("#ff4d4f")
      if (res.data.stars.includes(userID))
        setStar("#ffc53d")
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }


  //=============================== fetch comments ====================================
  const [comments, setComments] = useState([]);
  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await CommentAPI.getComments(postID);
      setComments(res.data)
      ifLiked(); ifStar();
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(
    () => {
      fetchPost().then(() => {
        fetchComments();
      });
    }, []
  );

  //================================ Function update Star and Like ==============================================
  async function updateLikes() {
    try {
      let currentPost = item;
      if (!currentPost.likes.includes(userID)) {
        await updateResumeAPI.postLike(postID, userID);
        currentPost.likes.push(userID);
      }
      else {
        await updateResumeAPI.postDislike(postID, userID);
        let rmIndex = currentPost.likes.indexOf(userID);
        currentPost.likes.splice(rmIndex, 1);
      }
      fetchComments();
    } catch (err) {
      console.log(err)
    }
  }

  async function updateStars() {
    try {
      let currentPost = item;
      if (!currentPost.stars.includes(userID)) {
        await updateResumeAPI.postStar(postID, userID);
        currentPost.stars.push(userID);
      }
      else {
        await updateResumeAPI.postUnStar(postID, userID);
        let rmIndex = currentPost.stars.indexOf(userID);
        currentPost.stars.splice(rmIndex, 1);
      }
      fetchComments();
    } catch (err) {
      console.log(err)
    }
  }

  //================================= Post new comment =======================================
  const initComment = {
    userId: userID,
    desc: "",
    postId: postID,
  }

  const [commentData, setCommentPost] = useState(initComment)
  const changeComment = (e) => {
    setCommentPost(
      { ...commentData, [e.target.name]: e.target.value }
    )
  }

  const [api, contextHolder] = notification.useNotification();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (commentData.desc.length > 0) {
      try {
        setLoading(true)
        const result = await CommentAPI.CreateComment(postID, commentData)
        setCommentPost(initComment);
        const newComment = result.data
        setComments([...comments, newComment[0]]);
        setLoading(false)

        api.open({
          message: `Comment Successfully`,
          description: 'Thank you for commenting resume!',
          icon: <SmileTwoTone style={{ color: '#108ee9' }} />,
          placement: "top"
        });
      } catch (error) {
        console.log(error)
      }
    } else {
      api.open({
        message: `Warning.`,
        description: 'Comment cannot be empty!',
        icon: <WarningFilled style={{ color: '#f5222d' }} />,
        placement: "top"
      });
    }

  }

  //================================= like and star color =======================================
  const [heart, setHeart] = useState("gray")
  const ifLiked = () => {
    let currentPost = item;
    if (currentPost.likes.includes(userID)) {
      setHeart("#ff4d4f")
    } else
      setHeart("gray")
  }

  const [star, setStar] = useState("gray")
  const ifStar = () => {
    let currentPost = item;
    if (currentPost.stars.includes(userID)) {
      setStar("#ffc53d")
    } else
      setStar("gray")
  }


  return (

    <div className='PDBBigContainer'>
      {item !== null &&
        <div className='PDBigContainer'>

          <div className='PDContainer'>

            {/* post item */}
            <div className='PDWrapper'>
              <div className='PDTitleWrapper'>
                <span className='PDTitle'>{item.title}</span>
              </div>

              <div className="PDtagWrapper">
                <Tag color="gold" style={{ fontSize: "14px" }}>#{item.major && item.major}</Tag>
                <Tag color="green" style={{ fontSize: "14px" }}>#{item.isLookForJobs ? "SeekJob" : "HaveJob"}</Tag>
              </div>

              <div className="PDtimeWrapper">
                <span className='PDtime' >Posted {moment(item.createdAt).fromNow()}</span>
              </div>


              <hr class="hr-mid-circle" style={{ width: "100%" }} />


              <div className="PDContentWrapper">
                <div className='PDDesWrapper'>
                  <span className='PDDes'>{item.description}</span>
                </div>
                <div className='PDfileWrapper'>
                  {item.file && <embed className='PDfile' src={item.file} style={{ height: `${width / 1.7}px` }} />}
                </div>

                {item.file && <button className='btnn button' onClick={newWindow}>
                  View File in New Window
                </button>}

                <div className="PDiconContainer">
                  <div className="DPcommentIcon">
                    <div className="commentWrapper DPcomment" onClick={updateLikes}>
                      <HeartOutlined className='commentImg' style={{ color: heart, fontSize: '20px' }} />
                      <span className="cardComment">{item.likes.length}</span>
                    </div>
                    <div className="commentWrapper DPcomment" onClick={updateStars}>
                      <StarOutlined className='commentImg' style={{ color: star, fontSize: '20px' }} />
                      <span className="cardComment">{item.stars.length}</span>
                    </div>
                  </div>
                  <div className='DPComBTNW commentWrapper'>
                    <span onClick={handleJump} className="DPCommentBTN" >Comment</span>
                  </div>
                </div>


              </div>
            </div>





            {/* comment cards */}
            <div className='PDcommentContainer'>
              {/* <div className="PDcards"> */}

              {comments && comments.length > 0 &&
                comments.map(comment => (
                  <div className="commentCard">

                    <div className="commentUserContainer">
                      <div className="commentUserAvtar">
                        <Avatar size="32" icon={<UserOutlined />} />

                      </div>

                      <div className="commentUserWrap">
                        <span className="commentUser">{comment.user[0].username}</span>
                        <span className="commentUser" style={{ color: "gray" }}>  {moment(comment.createdAt).fromNow()}</span>
                      </div>

                    </div>

                    <div className="commentDesWrap">
                      <span className="commentDes">{comment.desc}</span>
                    </div>

                  </div>
                )
                )}
              {/* </div> */}
            </div>




            {/* comment form */}
            <div className="PDpostWrapper" ref={ref}>
              {contextHolder}
              <form className='PDpostForm ' action="">

                <div className='PDpostDescWraper'>
                  <textarea
                    type="text"
                    className="DPpostDesc"
                    placeholder='Comment'
                    name='desc'
                    value={commentData.desc}
                    onChange={changeComment}
                  />
                </div>

                <button className="btnPost" onClick={onSubmitHandler}>Comment</button>

              </form>
            </div>



          </div>
        </div>
      }
    </div>



  )
}

export default PostDetail