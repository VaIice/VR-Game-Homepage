import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Cookies} from 'react-cookie';

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/api/member/reset-password`

const cookies = new Cookies()

export default function InformationPassword() {
        // const [cookies, setCookie, removeCookie] = useCookies(['Token']);
        // 사용자가 적고 있는 비밀번호
        const [pw, setPw] = useState('');
        // 비밀번호가 유효한 형식인지 확인
        const [pwValid, setPwValid] = useState(false);
        // 이메일, 비밀번호가 유효하다면 활성화
        const [notAllow, setNotAllow] = useState(true);
        // grantType
        const [grantType, setGrantType] = useState('');
        // accessToken
        const [accessToken, setAccessToken] = useState('');
    
        // 서버에 보낼 이메일, 비밀번호
        const dataToSend = {
            newPassword: pw
        };


        const navigate = useNavigate();
        const goToHome = () => {
            navigate("/");
        }

        const goToNoticeBoard = () => {
            navigate("/NoticeBoard");
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

        const goToSignUp = () => {
            navigate("/SignUp");
        }

        // 확인 버튼을 클릭했을 시 토큰 비교 (수정 필요)
        const onClickModifyPasswordButton = async () => {
            const fetchData = async () => {
            try {
                console.log(dataToSend);
                const response = await axios.post(SERVER_URL, dataToSend, {
                    headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`,
                }});
                alert('비밀번호가 변경되었습니다.')
                goToHome();
            } catch (error) {
                alert("Error fetching data: Fail modify password", error);
            }
            };
            fetchData();
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
      };

      const handlePw = (e) => {
        e.target.value = e.target.value.slice(0,16);
        setPw(e.target.value);
        const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9]).{8,20}$/;
        if (regex.test(e.target.value) && e.target.value.length >= 8)  {
            setPwValid(true);
            setNotAllow(false);
        } else {
            setPwValid(false);
            setNotAllow(true);
        }
    }

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
                    <button className="upperGuide123">Guide</button>
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
                        <button className="upperLogin123">Info</button>        
                    ) : (
                        <button className="upperLogin123" onClick={goToLogin}>Sign In</button>
                    )}
                </div>

            </div>

            <div className="contentWrap123">
                <div className="passwordSearchWrap">
                    <div className="titleSignUp123">비밀번호 수정</div>
                    <div className="inputWrapEmailPasswordSearchWrap123">
                        <input
                                type = 'password'
                                className="input123"
                                placeholder="비밀번호"
                                value={pw}
                                onChange={handlePw}/>
                    </div>
                    <div className="errorMessage123">
                    {
                        pw.length > 0 && !pwValid && (
                            <span>8~20자의 영문, 숫자를 입력해주세요.</span>
                        )
                    }
                    </div>

                    <button onClick={onClickModifyPasswordButton} disabled={notAllow} className="bottomPasswordSearchButton123">비밀번호 수정</button>

                </div>
            </div>
        </div>
    )}