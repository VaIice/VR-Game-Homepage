import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies()

export default function NoticeBulletinBoardPage() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
        console.log(1, cookies.get('refreshToken'))
        console.log(2, cookies.get('accessToken'))
    }

    const goToNoticeBoard = () => {
        navigate("/NoticeBoard");
    }

    const goToLogin = () => {
        navigate("/Login");
    }

    const goToFreeBulletinBoard = () => {
        navigate("/FreeBulletinBoard");
    }

    const goToReportBulletinBoard = () => {
        navigate("/ReportBulletinBoard");
    }

    const [searchWord, setSearchWord] = useState('');

    const handleSearch = async (e) => {
        setSearchWord(e.target.value);
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <div className="page">
        <img src="assets/image/wallpaper.jpg" alt="background" className='wallPaper'/>
            <div className="upper"/>
            <hr style={{display: 'white', marginTop: 97}}/>
            <div className="topLoginButton" onClick={goToLogin}/>
            <div className="topLogin" onClick={goToLogin}>Login</div>
            <div className="topNotice" onClick={goToNoticeBoard}>News</div>
            <div className="topGuide">Guide</div>
            <div
                className="topCommunity"
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
                >
                Community
            </div>

            <div className={`dropdownContent ${isDropdownVisible ? 'active' : ''}`}>
                <li className="dropdownMenu" onClick={goToFreeBulletinBoard}>자유 게시판</li>
                <li className="dropdownMenu" onClick={goToReportBulletinBoard}>신고 게시판</li>
            </div>

            <div className="topHome" onClick={goToHome}>Home</div>
            <div className="topHomeButton" onClick={goToHome}/>

            <div className='titleBoard'>공지 게시판</div>
            <div className="titleLine"/>

            <div className="bulletinLineInner"/>
            <div className="bulletinLineOuter"/>
            <div className="bulletinWord">신고합니다</div>
            <div className="commentsNumber">(1)</div>
            <div className="userName">user123</div>
            <div className="date">1시간 전</div>

            <div className="bulletinContents">신고합니다</div>
            <div className="bulletinContentsLine"/>

            <div className='bulletinModifyButton'>수정</div>
            <div className='bulletinModifyRemoveSpace'/>
            <div className='bulletinRemoveButton'>삭제</div>

            <div className="bulletinCommentsNumber">댓글 1</div>
            <div className="bulletinCommentsLine"/>

            <div className='bulletinCommentsRectangle'/>
            <div className='bulletinCommentsRectangleLine'/>
            
            <div className="bulletinCommentsWordNumber">0 / 100</div>

            <div className="bulletinCommentsEnrollButton"/>
            <div className='bulletinCommentsEnrollText'>등록</div>

            <div className="commentsUserName">user123</div>
            <div className="commentsUserNameDateSpace"/>
            <div className="commentsDate">1시간 전</div>
            <div className="commentsContent">신고합니다</div>

            <div className='commentsModifyButton'>수정</div>
            <div className="commentsModifyRemoveSpace"/>
            <div className='commentsRemoveButton'>삭제</div>

            <div className="bulletinCommentsBottomLine"/>
        </div>
    )
}