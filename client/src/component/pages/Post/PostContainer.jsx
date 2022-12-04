import React, { useState } from 'react';
import useWindowDimensions from "../../WindowDimension/WD"
import "./PostContainer.css"

import {
    StarOutlined,
    HeartOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import Post from './MyPost/MyPost';
import Star from './MyStar/Star';
import Like from './MyLike/Like';


function getItem(label, key, icon, onTitleClick, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
        onTitleClick
    };
}


const items = [
    getItem('My Posts', '1', <FileTextOutlined />),
    getItem('Star', '2', <StarOutlined />),
    getItem('Likes', '3', <HeartOutlined />),
];




const PostContainer = () => {

//======================== Page Decision ==============================
    const [page, setPage] = useState("1")
    const handlePage = ({ item, key, keyPath, domEvent }) => {
        var toWhere = "myposts"
        if (key === "2") toWhere = "mystar";
        else if (key === "3") toWhere = "mylikes";

        setPage(key)
    }


//======================== Menu UI ==============================

    const [collapsed, setCollapsed] = useState(false);
    const showMenu = () => {
        window.innerWidth <= 910 ? setCollapsed(true): setCollapsed(false);
    };
    window.addEventListener("resize", showMenu);
    React.useEffect(() => showMenu(), []);

//=============================================================

    return (
        <div className='outside'>

            <div className="postMenuWrapper" >

                <Menu
                    className="postMenu"
                    defaultSelectedKeys={[page]}
                    mode="inline"
                    inlineCollapsed={collapsed}
                    items={items}
                    onClick={handlePage}
                />

            </div>

            {page === "1" && <Post />}
            {page === "2" && <Star />}
            {page === "3" && <Like />}


        </div>


    );
};
export default PostContainer;
