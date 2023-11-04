import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies()

export default function NoticeBoard() {
    // const navigate = useNavigate();

    // const goToHome = () => {
    //     navigate("/");
    // }

    // const goToNoticeBoard = () => {
    //     navigate("/NoticeBoard");
    // }

    // const goToLogin = () => {
    //     navigate("/Login");
    // }

    // const goToFreeBulletinBoard = () => {
    //     navigate("/FreeBulletinBoard");
    // }

    // const goToReportBulletinBoard = () => {
    //     navigate("/ReportBulletinBoard");
    // }

    // const goToNoticeBulletinBoardPage = () => {
    //     navigate("/NoticeBulletinBoardPage");
    // }

    // const [searchWord, setSearchWord] = useState('');

    // const handleSearch = async (e) => {
    //     setSearchWord(e.target.value);
    // }

    // const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // const toggleDropdown = () => {
    //     setIsDropdownVisible(!isDropdownVisible);
    //   };

    return (
    //     <div className="page">
    //     <img src="assets/image/wallpaper.jpg" alt="background" className='wallPaper'/>
    //         <div className="upper"/>
    //         <hr style={{display: 'white', marginTop: 97}}/>
    //         <div className="topLoginButton" onClick={goToLogin}/>
    //         <div className="topLogin" onClick={goToLogin}>Login</div>
    //         <div className="topNotice" onClick={goToNoticeBoard}>News</div>
    //         <div className="topGuide">Guide</div>
    //         <div
    //             className="topCommunity"
    //             onMouseEnter={toggleDropdown}
    //             onMouseLeave={toggleDropdown}
    //             >
    //             Community
    //         </div>

    //         <div className={`dropdownContent ${isDropdownVisible ? 'active' : ''}`}>
    //             <li className="dropdownMenu" onClick={goToFreeBulletinBoard}>자유 게시판</li>
    //             <li className="dropdownMenu" onClick={goToReportBulletinBoard}>신고 게시판</li>
    //         </div>

    //         <div className="topHome" onClick={goToHome}>Home</div>
    //         <div className="topHomeButton" onClick={goToHome}/>

    //         <div className='titleBoard'>공지 게시판</div>
    //         <div className="titleLine"/>

    //         <div className="searchLineInner"/>
    //         <div className="searchLineOuter">
    //             <input
    //                 type = 'text'
    //                 className="inputSearch"
    //                 placeholder="검색어를 입력해주세요."
    //                 value={searchWord}
    //                 onChange={handleSearch}
    //             />
    //         </div>
    //         <div className='searchWord'>제목</div>

    //         <div className="bulletinLineInner"/>
    //         <div className="bulletinLineOuter"/>
    //         <div className="bulletinWord">서버 오픈</div>
    //         <div className="commentsNumber">(1)</div>
    //         <div className="userName">administer</div>
    //         <div className="date">1시간 전</div>


    //         <div className='BottomLine'/>

    //         <div className="pageNumber">1</div>

    //         <div className="writeButton" onClick={goToNoticeBulletinBoardPage}/>
    //         <div className='writeWord' onClick={goToNoticeBulletinBoardPage}>글쓰기</div>
    //     </div>
    //)
    <div className="page123">
    <div className="upperSpace123">
    <div className="upperHome123">
        Home
    </div>
    <div className="upperNotice123">
        Notice
    </div>
    <div className="upperGuide123">
        Guide
    </div>
    <div className="upperCommunity123">
        Community
    </div>
    <div className="upperLogin123">
        Login
    </div>
</div>

<div className="contentWrap123">
  <div className="Title123">Darkest Planet</div>
  <div className="VRGame123">VRGame</div>
  <div className="Intro123">Intro</div>
</div>
</div>
    )}