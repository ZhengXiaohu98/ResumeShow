## Resume Show - Menu
- [About this project](#about-this-project)
- [Tools](#tools)
- [Site Looks](#site-looks)
  - [Login page](#login-page)
  - [Post page](#post-page)
  - [Home page](#home-page)
- [Use this project](#use-this-project)
- [The team](#team)
- [Dev Log](#dev-log)
********************************

## About this project
<p>
Our team wants to build a website which can store different resumes from different disciplines. For those who already have an outstanding resume, they can upload it to the website to help others.
And those who are building their resumes can use the website to learn how to build a good resume.
</P> 
<p>
Resume show is a website which allows users to upload their resumes for advice or other uses. Users can post their resumes to the website and view other people’s resumes. Each
resume will have a section for users to comment and upvote.
</p>

## Tools
- Front-end: React + Ant Design
- Back-end: Node.js
- Database: MongoDB 

## Site looks

### Login page
<p align="center">
<img src="https://user-images.githubusercontent.com/70027806/207454748-4171cec0-6af6-4e0f-b78a-b187058052a3.png" width="400"/>
</p>

We implemented **Google** and **Github** login for better user experience, but users can also register their own accounts on our site.

### Post page
<p align="center">
<img src="https://user-images.githubusercontent.com/70027806/206890363-59fdcc30-f144-46cc-b55e-e038171a6a48.png" width="800"/>
</p>

Users can view the resumes they have posted or the resumes they stared/liked.

### Home page
<p align="center">
<img src="https://user-images.githubusercontent.com/70027806/206892846-9977ee96-f539-4552-9e60-bcac392df409.png" width="800"/>
</p>

Users can view all the posted resumes on this page, and they can filter resumes by disciplines.

## Use this project

1. Clone this project
2. For server run

```bash
npm start
```

3. For client run
```bash
npm run start
```

## Team
Our team consist of two members. [Xueqi Chen](https://github.com/xqcxqc) worked on building the server and creating APIs for the front-end. [Xiaohu Zheng](https://github.com/ZhengXiaohu98)
mainly worked on building the home page for the site.

## Dev Log
- 12/16/2022 The website is now hosted. Click <a href="http://example.co](https://resumeshow.netlify.app/" target="_blank">ResumeShow</a> to see. We are experiencing issues with google && github authentication, and we are working to fix the issue. Changed some UI for Home page and Post page.
