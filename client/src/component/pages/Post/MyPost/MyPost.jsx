import { useEffect, useState, useContext } from 'react';
import UserProvider from "../../../../Context/UserProvider";
import FileBase64 from 'react-file-base64';
import { Link } from "react-router-dom";

import * as PostAPI from "../../../../API/PostRequest.js";
import "./MyPost.css";
import "./MyPost_full.css"
import useWindowDimensions from "../../../WindowDimension/WD"

import clockImg from "../001-clock.png"

import { Select, notification, Popconfirm, Pagination, Spin, Empty, Tag, Radio } from 'antd';
import { SmileTwoTone, HeartOutlined, StarOutlined, CommentOutlined, DeleteOutlined, WarningFilled } from '@ant-design/icons';
import { majorList } from "../../../majors";


const MyPost = () => {

    //============================= Pagination =================================
    var numEachPage = 6;
    const [pageSlice, setPageSlice] = useState(
        {
            minValue: 0,
            maxValue: 6,
        }
    )

    const handlePageChange = value => {
        setPageSlice({
            minValue: (value - 1) * numEachPage,
            maxValue: value * numEachPage
        });
    };


    //============================= My post list  =================================
    const [items, setItems] = useState([])
    async function fetchData() {
        try {
            setLoading(true)
            const result = await PostAPI.getAllMyPosts(userID);
            const data = result.data
            setItems(data)
            setLoading(false)

        } catch (error) {
            console.log("fetchdata error:")
            console.log(error)
        }
    };

    //============================= Loading anime  =================================
    const [loading, setLoading] = useState(false);


    //============================= Notification anime  =================================
    const [api, contextHolder] = notification.useNotification();


    //============================= Current user =================================
    const user = useContext(UserProvider.context);
    const userID = user._id;


    //============================= Major option for select bar =================================
    const majorOptions = [];
    for (let major of majorList) {
        majorOptions.push({
            value: major,
            label: major,
        });
    }


    //============================= Post data =================================
    const initPost = {
        userId: userID,
        title: "",
        description: "",
        major: "None",
        isLookForJobs: true,
        file: "",
    }

    // number of characters left can enter in title
    const [titleLimitDispaly, setTitleLimitDispaly] = useState(70);

    const [postData, setPost] = useState(initPost)
    const [postTemp, setTemp] = useState(initPost)
    //change title, desc
    const changePost = (e) => {
        setPost(
            { ...postData, [e.target.name]: e.target.value }
        )
        setTemp(
            { ...postTemp, [e.target.name]: e.target.value.substring(0, 25) + ifAddpoints(e.target.value) }
        )
        var { title } = { [e.target.name]: e.target.value }
        setTitleLimitDispaly(70 - (title.length));
    }
    //change select bar
    const changeMajor = (value) => {
        setPost(
            { ...postData, "major": value }
        )
        setTemp(
            { ...postTemp, "major": value.substring(0, 25) + ifAddpoints(value) }
        )
    }
    //change radio (is looking for job)
    const changeRadio = (e) => {
        setPost(
            { ...postData, "isLookForJobs": e.target.value }
        )
        setTemp(
            { ...postTemp, "isLookForJobs": e.target.value }
        )
    }

    const ifAddpoints = (words) => {
        return words.length > 25 ? "..." : ""
    }

    //submit a new post
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (isPostdataOk()) {
            try {
                setLoading(true)
                const result = await PostAPI.createPost(postData)
                setPost(initPost);
                setTemp(initPost);
                const { newPost } = result.data
                setItems([newPost, ...items]);
                setLoading(false)

                api.open({
                    message: `Successfully Uploaded resume`,
                    description: 'Thank you for uploading you resume. Your resume will not be used for any commercial purposes!',
                    icon: <SmileTwoTone style={{ color: '#108ee9' }} />,
                    placement: "top"
                });

            } catch (error) {
                console.log(error)
            }
        }
    }


    //============================= Delete Post =================================
    const [deletedPageID, setDeletedPageID] = useState("");
    const selectDelete = (e) => {
        setDeletedPageID(e.currentTarget.id);
    }

    const deleteHandler = async (e) => {
        try {
            setLoading(true)
            const result = await PostAPI.deleteMyPosts(deletedPageID)

            setItems(
                () => {
                    var newItems = items;
                    newItems = newItems.filter(item => item._id !== deletedPageID)
                    return newItems;
                }
            )
            setLoading(false)

        } catch (error) {
            console.log(error)
        }
    }


    //=========================================================================

    useEffect(
        () => {
            fetchData();
        }, []
    );



    //============================ window width detection ========================================
    const { width } = useWindowDimensions();


    //============================ check post data validation ========================================
    const isPostdataOk = () => {
        if (postData.title.length < 20) {
            api.open({
                message: `Warning.`,
                description: 'Title cannot be empty and must have more then 15 characters!',
                icon: <WarningFilled style={{ color: '#f5222d' }} />,
                placement: "top"
            });
            return false;
        }
        if (postData.description.length < 20) {
            api.open({
                message: `Warning.`,
                description: 'Description cannot be empty and must have more then 20 characters!',
                icon: <WarningFilled style={{ color: '#f5222d' }} />,
                placement: "top"
            });
            return false;
        }
        return true;
    }






    return (

        <div className="PostBigcontainer">
            {contextHolder}
            {loading && <div className="spin"><Spin tip="Loading..."> </Spin></div>}
            <div className="PostContainer">

                <div className="postWrapper">
                    {width >= 1250 && <div className="postPicWrapper"><embed className='postPic' src='https://ideas.ted.com/wp-content/uploads/sites/3/2017/09/featured_art_istock_work_home.jpg?resize=750,450'></embed></div>}
                    {width >= 1250 && <pre className='postData'>{JSON.stringify(postTemp, null, '\t')}</pre>}

                    <form className='postForm ' action="">

                        <div className='postTitleWraper'>
                            <input
                                type="text"
                                maxLength={70}
                                minLength={1}
                                className="postTitle"
                                placeholder=' Title'
                                name='title'
                                value={postData.title}
                                onChange={changePost}
                            />
                            <span className="postTitleWords">{titleLimitDispaly}</span>
                        </div>


                        <div className='postDescWraper'>
                            <textarea
                                type="text"
                                className="postDesc"
                                placeholder=' Description'
                                name='description'
                                value={postData.description}
                                onChange={changePost}
                            />
                        </div>


                        <Select
                            className="postSelectBar"
                            filterSort={(a, b) =>
                                (a.label < b.label ? -1 : 1)
                            }
                            placeholder="Select a Major"
                            onChange={changeMajor}
                            options={majorOptions}
                        />

                        <Radio.Group onChange={changeRadio} name="radiogroup" style={{ marginBottom: "8px" }} defaultValue={true}>
                            <Radio value={true}>Looking for job</Radio>
                            <Radio value={false}>Have a job</Radio>
                        </Radio.Group>


                        <FileBase64
                            className="postFile"
                            type="file"
                            multiple={false}
                            onDone={({ base64 }) => { setPost({ ...postData, file: base64 }); setTemp({ ...postTemp, file: base64.substring(0, 50) + "..." }) }}
                        />
                        <button className="btnPost" onClick={onSubmitHandler}>Post</button>

                    </form>
                </div>

                <div className="cardContainer">
                    {items && items.length > 0 ?
                        items.slice(pageSlice.minValue, pageSlice.maxValue).map(item => (

                            <div className="card" key={item._id} >

                                <div className="cardTimeWraper">
                                    <img src={clockImg} alt="Icons made by Freepik from flaticon.com" className='timeImg' />
                                    <span className="cardTime">Post created at {item.createdAt.substring(0, 10)}</span>
                                </div>

                                <hr class="hr-mid-circle" />

                                {item.file ?
                                    (<div className="cardImgContainer">
                                        <embed className="cardImage" src={item.file} />
                                    </div>)
                                    :
                                    <div style={{ marginTop: "15px" }} />}

                                <div className="titleWrapper">
                                    <Link to={`postdetail/${item._id}`} style={{color:"black", textDecoration:"none"}}>
                                        <span className="cardTitle">{item.title}</span>
                                    </Link>
                                </div>


                                <hr class="hr-mid-circle" />


                                <div className="tagWrapper">
                                    <Tag color="gold" style={{ fontSize: "11px" }}>#{item.major && item.major}</Tag>
                                    <Tag color="green" style={{ fontSize: "11px" }}>#{item.isLookForJobs ? "SeekJob" : "HaveJob"}</Tag>
                                </div>

                                {/* likes, number of comments */}
                                <div className="cardCommentWraper">

                                    <Popconfirm
                                        placement="rightBottom"
                                        title={"Selected Post will be deleted. Are you sure?"}
                                        onConfirm={deleteHandler}
                                        okText="Yes"
                                        cancelText="No"
                                        className="deleteWrapper"
                                    >
                                        <DeleteOutlined className='deleteImg' id={item._id} onClick={selectDelete} />
                                    </Popconfirm>

                                    <div className="commentWrapper">
                                        <StarOutlined className='commentImg' />
                                        <span className="cardComment">{item.stars.length}</span>
                                    </div>

                                    <div className="commentWrapper">
                                        <HeartOutlined className='commentImg' />
                                        <span className="cardComment">{item.likes.length}</span>
                                    </div>

                                    <div className="commentWrapper">
                                        <CommentOutlined className='commentImg' />
                                        <span className="cardComment">{item.comments.length}</span>
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
                defaultPageSize={6}
                total={(items.length)} style={{ marginBottom: "2rem" }} />

        </div>

    );
}

export default MyPost;








