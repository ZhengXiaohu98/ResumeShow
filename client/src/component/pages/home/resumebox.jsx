import { useEffect, useState, useContext, React } from "react";
import { Link } from "react-router-dom";
import { Select, List, Space, Card, Button, Modal, Input, Spin} from 'antd';
import { LikeTwoTone, MessageTwoTone, StarTwoTone, SearchOutlined,ReloadOutlined } from '@ant-design/icons';

import "./resumebox.css";
import UserProvider from "../../../Context/UserProvider";
import useWindowDimensions from "../../WindowDimension/WD"

// major list
import { majorList } from "../../majors";

// request APIs
import * as getResumeAPI from "../../../API/GetResume.js";
import * as updateResumeAPI from "../../../API/PostRequest.js";



const ResumeBox = () => {

  // window's width
  const { width } = useWindowDimensions();

  //list of post
  let [resumeList, setResumeList] = useState([])

  // use for loading anime
  const [loading, setLoading] = useState(false);

  // get current user
  let user = useContext(UserProvider.context);

  // comment text
  let [comment, setComment] = useState("")
  let [curCommentId, setCurCommentId] = useState("");




  //========================== function to sort Post List ========================================

  // function to sort the resumes by time
  const sortByTime = () => {
    let tmpList = [...resumeList]
    tmpList.sort(function (a, b) {
      const ta = new Date(a.createdAt), tb = new Date(b.createdAt);
      return ta.getTime() < tb.getTime() ? 1 : -1;
    })
    setResumeList(tmpList)
  }

  // function to sort the resumes by likes
  const sortByLike = () => {
    let tmpList = [...resumeList]
    tmpList.sort(function (a, b) {
      if (a.likes.length === b.likes.length) {
        const ta = new Date(a.createdAt), tb = new Date(b.createdAt);
        return ta.getTime() < tb.getTime() ? 1 : -1;
      }
      return a.likes.length < b.likes.length ? 1 : -1;
    })
    setResumeList(tmpList)
  }

  // function to sort the resumes by stars
  const sortByStar = () => {
    let tmpList = [...resumeList]
    tmpList.sort(function (a, b) {
      if (a.stars.length === b.stars.length) {
        const ta = new Date(a.createdAt), tb = new Date(b.createdAt);
        return ta.getTime() < tb.getTime() ? 1 : -1;
      }
      return a.stars.length < b.stars.length ? 1 : -1;
    })
    setResumeList(tmpList)
  }

  //===========================================================================

  // function use to fetch all resumes
  async function fetchAllResume() {
    try {
      setLoading(true)
      const res = await getResumeAPI.getAllResume();
      res.data.sort(function (a, b) {
        const ta = new Date(a.createdAt), tb = new Date(b.createdAt);
        return ta.getTime() < tb.getTime() ? 1 : -1;
      })
      setResumeList(res.data)
      setLoading(false)

    } catch (err) {
      console.log(err)
    }
  };

  // first rendering
  useEffect(
    () => {
      fetchAllResume();
    }, []
  );

  //===================================================================================


  const majorOptions = [];
  for (let major of majorList) {
    majorOptions.push({
      value: major,
      label: major,
    });
  }

  const [filterTags, setFilterTags] = useState([])
  const changeFilterTag = (value) => {
    setFilterTags(value)
  }
  const clearSelected = () => {
    setFilterTags([])
    fetchAllResume();
  }

    // function to get the filter major list, then fetch resume
    const handleFilterChange = (value) => {
      async function fetchFiltedResume() {
        try {
          const res = await getResumeAPI.getFiltedResume(filterTags);
          setResumeList(res.data)
        } catch (err) {
          console.log(err)
        }
      };
      setLoading(true)
      fetchFiltedResume();
      setLoading(false)
    };

  //===================================================================================


  // function dealing with different sort methods
  const handleSortChange = (value) => {
    if (value === 'most recent') {
      sortByTime();
    } else if (value === 'most likes') {
      sortByLike();
    } else if (value === 'most stars') {
      sortByStar();
    }
  }


  //================================ Function update DB(using API) ==============================================

  async function updateLikes(_id, userId, post, likes) {
    try {
      setLoading(true)

      //deal with db and then local state
      let postList = resumeList;
      let postTmp = post
      const index = postList.indexOf(post)

      if (!likes.includes(userId)) {
        await updateResumeAPI.postLike(_id, userId);
        postTmp.likes.push(userId);
      }
      else {
        await updateResumeAPI.postDislike(_id, userId);
        let rmIndex = post.likes.indexOf(userId);
        postTmp.likes.splice(rmIndex, 1);
      }
      postList[index] = post
      setResumeList([...postList])

      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }


  // function to update comments
  async function updateComments(userId) {
    try {
      console.log(curCommentId)
      await updateResumeAPI.updateResumeComment(curCommentId, userId, comment);
    } catch (err) { console.log(err) }
  }

  // function to update stars
  async function updateStars(_id, userId, post, stars) {
    try {
      setLoading(true)

      //deal with db ann then local state
      let postList = resumeList;
      let postTmp = post
      const index = postList.indexOf(post)

      if (!stars.includes(userId)) {
        await updateResumeAPI.postStar(_id, userId);
        postTmp.stars.push(userId);
      }
      else {
        await updateResumeAPI.postUnStar(_id, userId);
        let rmIndex = post.stars.indexOf(userId);
        postTmp.stars.splice(rmIndex, 1);
      }
      postList[index] = postTmp
      setResumeList([...postList])

      setLoading(false)
    } catch (err) {
      console.log(err)
    }

  }

  //===================================================================================


  // use to handle comments
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const { TextArea } = Input;


  //================================
  const ScreenResponse = () => {
    var col = 4;
    if (width <= 2560) col = 4;
    if (width <= 1200) col = 3;
    if (width <= 800) col = 2
    if (width <= 700) col = 1;
    return col;
  }


  return (
    <div >
      {loading && <div className="spin" style={{ zIndex: "1" }}><Spin tip="Loading..."> </Spin></div>}

      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>


        {/* Filter section */}
        <Space.Compact block>
          <Select
            defaultValue="Most Recent"
            style={{ width: 120 }}
            bordered={false}
            onChange={handleSortChange}
            options={[
              {
                value: 'most recent',
                label: 'Most Recent',
              },
              {
                value: 'most likes',
                label: 'Most Likes',
              },
              {
                value: 'most stars',
                label: 'Most Stars',
              },
            ]}
          />

          <Select
            mode="tags"
            style={{
              width: '25%',
            }}
            filterSort={(a, b) =>
              (a.label < b.label ? -1 : 1)
            }
            allowClear
            placeholder="Filter by Majors"
            onChange={changeFilterTag}
            value={filterTags}
            options={majorOptions}
          />

          {/* onClick the button. filter the items array according to the selected tags */}
          <Button className="filterBtn" onClick={handleFilterChange} icon={<SearchOutlined />}>Search</Button>
          <Button className="filterBtn" onClick={clearSelected} icon={<ReloadOutlined />}></Button>
        </Space.Compact>



        {/* div for showing the resumes */}
        <List
          grid={{
            gutter: { xs: 8, sm: 16, md: 24, lg: 32 },
            column: ScreenResponse(),
          }}
          size="large"
          bordered
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 8,
          }}
          dataSource={resumeList}
          renderItem={(item) => (
            <List.Item key={item._id}
            >
              <List.Item.Meta
                title={
                  <Link to={`postdetail/${item._id}`} state={{ item }} >{
                    // <Link to="/detailpost" state={{ item }}>{
                    item.title && item.title.length > 30 ?
                      item.title.substr(0, 30) + "..."
                      :
                      item.title}</Link>
                  // item.title && item.title.length > 30 ?
                  //   item.title.substr(0, 30) + "..."
                  //   :
                  //   item.title
                }
                description={
                  item.title && item.description.length > 30 ?
                    item.description.substr(0, 30) + "..."
                    :
                    item.description
                }
              />
              <Modal
                title="Add a Comment"
                open={open}
                onOk={
                  () => {
                    setConfirmLoading(true);
                    updateComments(user._id).then(fetchAllResume());
                    setTimeout(() => {
                      setOpen(false);
                      setConfirmLoading(false);
                      setComment("")
                    }, 1000);
                  }
                }
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                <TextArea
                  placeholder="Enter your comment here..."
                  allowClear
                  onChange={(e) => setComment(e.target.value)}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Modal>
              <Card>
                <embed height={272} className="cardImage" src={item.file} />
              </Card>
              <br />
              <Space>
                <Button
                  type="text"
                  onClick={() => {
                    updateLikes(item._id, user._id, item, item.likes);
                  }}
                >
                  <LikeTwoTone
                    twoToneColor={item.likes.includes(user._id)? "#eb2f96" : "#88CA5E"}
                    className="cardIcon"
                  />
                </Button>
                {item.likes.length}

                <Button
                  type="text"
                  onClick={() => {
                    setOpen(true);
                    setCurCommentId(item._id);
                  }}
                >
                  <MessageTwoTone
                    className="cardIcon"
                  />
                </Button>
                {item.comments.length}

                <Button
                  type="text"
                  onClick={() => {
                    updateStars(item._id, user._id, item, item.stars);
                  }}
                >
                  <StarTwoTone
                    twoToneColor={item.stars.includes(user._id)? "#FFD700" : "#B6B6B4"}
                    className="cardIcon"
                  />
                </Button>
                {item.stars.length}
              </Space>
            </List.Item>
          )}
        />
      </Space>
    </div>
  )
}

export default ResumeBox;

