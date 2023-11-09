import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';

const cookies = new Cookies()

export default function Home() {
    const navigate = useNavigate();
    
    const goToHome = () => {
        navigate("/");
    }

    const goToNoticeBoard = () => {
        navigate("/NoticeBoard");
    }

    const goToInfo = () => {
        navigate("/Information");
    }

    const goToFreeBulletinBoard = () => {
        navigate("/FreeBulletinBoard");
    }

    const goToReportBulletinBoard = () => {
        navigate("/ReportBulletinBoard");
    }

    const goToLogin = () => {
        navigate("/Login");
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
      };
    
    return (
        <div className="page123">
            <img src="assets/image/555.png" alt="background" className='wallPaper123'/>
            <div className="upperSpace123">
                <div className="upperHomeWrap">
                    <button class="upperHome123" onClick={goToHome}>Home</button>
                </div>

                <div className="upperNoticeWrap">
                    <button className="upperNotice123" onClick={goToNoticeBoard}>Notice</button>
                </div>

                <div className="upperGuideWrap">
                    <button className="upperGuide123" onClick={goToInfo}>Guide</button>
                </div>

                <div className="upperCommunityWrap">
                    <button className="upperCommunity123"  onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                        Community
                        {isDropdownVisible && (
                            <div className="dropdownMenu123">
                                <li onClick={goToFreeBulletinBoard} className="dropdownWord">자유 게시판</li>
                                <li onClick={goToReportBulletinBoard} className="dropdownWord">신고 게시판</li>
                            </div>
                        )}
                    </button>
                </div>

                <div className="upperLoginWrap">
                    { cookies.get('accessToken') ? (
                        <button className="upperLogin123" onClick={goToInfo}>Info</button>        
                    ) : (
                        <button className="upperLogin123" onClick={goToLogin}>Sign In</button>
                    )}
                </div>

            </div>

            <div className="contentWrap123">
                <div className="Title123">Darkest Planet</div>
                <div className="VRGame123">VRGame</div>
                <div className="Intro123">Intro</div>
            </div>
        </div>
    )}