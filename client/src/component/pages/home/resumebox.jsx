import { useEffect, useState, useContext, React } from "react";
import "./resumebox.css";

// major list
import { majorList } from "../../majors";

// request APIs
import * as getResumeAPI from "../../../API/GetResume.js";
import * as updateResumeAPI from "../../../API/PostRequest.js";


import { Select, List, Space, Card, Button, Modal, Input } from 'antd';
import { LikeTwoTone, MessageTwoTone, StarTwoTone } from '@ant-design/icons';


import UserProvider from "../../../Context/UserProvider";

const ResumeBox = () => {
  let [resumeList, setResumeList] = useState([])

  // get current user
  let user = useContext(UserProvider.context);

  // comment text
  let [comment, setComment] = useState("")
  let [curCommentId, setCurCommentId] = useState(""); 

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

  // function use to fetch all resumes
  async function fetchAllResume() {
    try {
      const res = await getResumeAPI.getAllResume();
      res.data.sort(function (a, b) {
        const ta = new Date(a.createdAt), tb = new Date(b.createdAt);
        return ta.getTime() < tb.getTime() ? 1 : -1;
      })
      setResumeList(res.data)
    } catch (err) {
      console.log(err)
    }
  };

  // first rendering
  useEffect(
    () => {
      fetchAllResume();
    }, []);

  const majorOptions = [];
  for (let major of majorList) {
    majorOptions.push({
      value: major,
      label: major,
    });
  }

  // function to get the filter major list, then fetch resume
  const handleFilterChange = (value) => {
    const filterMajorList = new Array(value)
    async function fetchFiltedResume() {
      try {
        const res = await getResumeAPI.getFiltedResume(filterMajorList);
        res.data.sort(function (a, b) {
          return a.likes.length > b.likes.length ? 1 : -1;
        })
        setResumeList(res.data)
      } catch (err) {
        console.log(err)
      }
    };
    fetchFiltedResume();
  };

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

  // function to update like
  async function updateLikes(_id, userId, likes) {
    try {
      await updateResumeAPI.updateResumeLike(_id, userId, likes);
    } catch (err) { console.log(err) }
  }

  // function to update comments
  async function updateComments(userId) {
    try {
      console.log(curCommentId  )
      await updateResumeAPI.updateResumeComment(curCommentId, userId, comment);
    } catch (err) { console.log(err) }
  }

  // function to update stars
  async function updateStars(_id, userId, stars) {
    try {
      await updateResumeAPI.updateResumeStar(_id, userId, stars);
    } catch (err) { console.log(err) }
  }

  // use to handle comments
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const { TextArea } = Input;

  return (
    <div>
      {/* Filter section */}
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
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
            placeholder="Filter by Majors"
            onChange={handleFilterChange}
            options={majorOptions}
          />
        </Space.Compact>

        {/* div for showing the resumes */}
        <List
          grid={{
            gutter: { xs: 8, sm: 16, md: 24, lg: 32 },
            column: 4,
          }}
          size="large"
          bordered
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
          }}
          dataSource={resumeList}
          renderItem={(item) => (
            <List.Item key={item._id}>
              <List.Item.Meta
                title={
                  item.title && item.title.length > 30 ?
                    item.title.substr(0, 30) + "..."
                    :
                    item.title
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
                    updateLikes(item._id, user._id, item.likes).then(fetchAllResume());
                  }}
                >
                  <LikeTwoTone
                    twoToneColor="#eb2f96"
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
                    updateStars(item._id, user._id, item.stars).then(fetchAllResume());
                  }}
                >
                  <StarTwoTone
                    twoToneColor="#FFD700"
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