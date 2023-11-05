import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';

const cookies = new Cookies()

export default function Home() {


    const [accessToken, setAccessToken] = useState('');
    // refreshToken
    const [refreshToken, setRefreshToken] = useState('');
    // accessTokenExpiresln
    const [accessTokenExpiresln, setAccessTokenExpiresln] = useState('');
      

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
        <div className="page">
        <img src="assets/image/555.png" alt="background" className='wallPaper'/>
            <div>{
                cookies.get('accessToken') ? (
                    <div className="topLoginButton" onClick={goToInfo}></div>        
                ) : (
                    <div className="topLoginButton" onClick={goToLogin}></div>
                )
            }</div>
            <div>{
                cookies.get('accessToken') ? (
                    <div className="topLogin" onClick={goToInfo}>내 정보</div>        
                ) : (
                    <div className="topLogin" onClick={goToLogin}>Login</div>
                )
            }</div>
            <div className="topNotice" onClick={goToNoticeBoard}>News</div>
            <div className="topGuide" onClick={goToInfo}>Guide</div>
            <div
                className="topCommunity"
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
                >
                Community
            </div>

            <div className={`dropdownContent ${isDropdownVisible ? 'active' : ''}`}>
                {/* <li className="dropdownMenu" onClick={goToFreeBulletinBoard}>자유 게시판</li> */}
                <li className="dropdownMenu" onClick={goToFreeBulletinBoard}>자유 게시판</li>
                <li className="dropdownMenu" onClick={goToReportBulletinBoard}>신고 게시판</li>
            </div>

            <div className="topHome" onClick={goToHome}>Home</div>
            <div>
                <img src={"/assets/image/home1.svg"} alt="home" className="topHomeButton" onClick={goToHome}/>
            </div>
            
            <div className="darkestPlanet">Darkest Planet</div>
            <div className="VRGame">VR Game</div>
            <div className="Intro">인간과 좀비의 생존을 건 전투가 치열한 세상, 망가지기 시작한 사회 속 생존자들은 결국 더욱 흉포한 위협과 마주하게 되게 된다. </div>
            <div className="DownloadButton" />
            <div className="Download">Download</div>
        </div>

        
    )
}