import { useEffect, useState, useContext } from 'react';
import UserProvider from "../../../../Context/UserProvider";
import { Link } from "react-router-dom";

import * as PostAPI from "../../../../API/PostRequest.js";
import "./MyLike.css";
import "./MyLike_full.css"
import clockImg from "../001-clock.png"

import { notification, Popconfirm, Pagination, Spin, Empty, Tag } from 'antd';
import { HeartOutlined, StarOutlined, CommentOutlined, DeleteOutlined } from '@ant-design/icons';


const Like = () => {

  //==========================================================
  //get basic user info
  const user = useContext(UserProvider.context);
  const userID = user._id;
  //==========================================================

  //Pagination:
  var numEachPage = 8;
  const [pageSlice, setPageSlice] = useState(
    {
      minValue: 0,
      maxValue: 8,
    }
  )
  const handlePageChange = value => {
    setPageSlice({
      minValue: (value - 1) * numEachPage,
      maxValue: value * numEachPage
    });
  };
  //==========================================================

  const [loading, setLoading] = useState(false);

  //==========================================================

  //likes post list
  const [items, setItems] = useState([])

  //==========================================================

  // use for notification (pop-up notification)
  const [api, contextHolder] = notification.useNotification();
  //==========================================================

  //delete operation
  const [deletedPageID, setDeletedPageID] = useState("");
  const selectDelete = (e) => {
    setDeletedPageID(e.currentTarget.id);
  }
  const deleteHandler = async (e) => {
    try {
      setLoading(true)
      const result = await PostAPI.deleteLike(deletedPageID, userID)

      var newItems = items;
      newItems = newItems.filter(item => item._id !== deletedPageID)
      setItems([...newItems])
      setLoading(false)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(
    () => {
      async function fetchData() {
        try {
          setLoading(true)
          const result = await PostAPI.getAllMyLikes(userID)
          const data = result.data
          setItems(data)
          setLoading(false)
        } catch (error) {
          console.log("fetchdata error:")
          console.log(error)
        }
      };
      fetchData();
    }
    , []);

  //=================================================================================
  return (
    <div className="StarBigcontainer">
      {contextHolder}
      {loading && <div className="spin"><Spin tip="Loading..."> </Spin></div>}
      <div className="StarContainer">
        <div className="StarcardContainer">
          {items && items.length > 0 ?
            items.slice(pageSlice.minValue, pageSlice.maxValue).map(item => (
              <div className="Starcard" >

                <div className="StarcardTimeWraper">
                  <img src={clockImg} alt="Icons made by Freepik from flaticon.com" className='StartimeImg' />
                  <span className="StarcardTime"> Created at {item.createdAt.substring(0, 10)}</span>
                </div>

                <hr class="hr-mid-circle" />

                {item.file ?
                  (<div className="StarcardImgContainer">
                    <embed className="StarcardImage" src={item.file} />
                  </div>)
                  :
                  <div style={{ marginTop: "15px" }} />}

                <div className="StartitleWrapper">
                  <Link to={`postdetail/${item._id}`} style={{ color: "black", textDecoration: "none" }}>
                    <span className="StarcardTitle">{item.title}</span>
                  </Link>
                </div>

                <hr class="hr-mid-circle" />

                <div className="tagWrapper">
                  <Tag color="gold" style={{ fontSize: "11px" }}>#{item.major && item.major}</Tag>
                  <Tag color="green" style={{ fontSize: "11px" }}>#{item.isLookForJobs ? "SeekJob" : "HaveJob"}</Tag>
                </div>


                {/* likes, number of comments */}
                <div className="StarcardCommentWraper">

                  <Popconfirm
                    placement="rightBottom"
                    title={"Delete the post from Likes. click Yes to Confirm."}
                    onConfirm={deleteHandler}
                    okText="Yes"
                    cancelText="No"
                    className="StardeleteWrapper"
                  >
                    <DeleteOutlined className='StardeleteImg' id={item._id} onClick={selectDelete} />
                    {/* <img src={deleteImg} alt="Icons is from flaticon.com" className='deleteImg' /> */}
                  </Popconfirm>

                  <div className="StarcommentWrapper">
                    <StarOutlined className='StarcommentImg' />
                    <span className="StarcardComment">{item.stars.length}</span>
                  </div>

                  <div className="StarcommentWrapper">
                    <HeartOutlined className='StarcommentImg' />
                    <span className="StarcardComment">{item.likes.length}</span>
                  </div>

                  <div className="StarcommentWrapper">
                    {/* <img src={commentImg} alt="Icons is from flaticon.com" className='commentImg' /> */}
                    <CommentOutlined className='StarcommentImg' />
                    <span className="StarcardComment">{item.comments.length}</span>
                  </div>
                </div>

              </div>
            ))
            :
            <div className="EmptyWrapper" style={{ alignSelf: "center", marginTop: "20%" }}><Empty /></div>
          }

        </div>


      </div>

      <Pagination
        defaultCurrent={1}
        onChange={handlePageChange}
        defaultPageSize={8}
        total={(items.length)} style={{ marginBottom: "2rem" }} />
    </div>

  );
}

export default Like;





