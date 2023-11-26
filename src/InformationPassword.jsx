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

        // 확인 버튼을 클릭했을 시 토큰 비교 (수정 필요)
        const onClickModifyPasswordButton = async () => {
            const fetchData = async () => {
            try {
                const response = await axios.post(SERVER_URL, dataToSend, {
                    headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`,
                }});
                alert('비밀번호가 변경되었습니다.')
                goToHome();
            } catch (error) {
                alert("비밀번호 변경에 실패하였습니다.");
            }
            };
            fetchData();
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
      };

      const handlePw = (e) => {
        e.target.value = e.target.value.slice(0,15);
        setPw(e.target.value);
        const regex =
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'"]).{8,15}$/;
        if (regex.test(e.target.value) && e.target.value.length >= 8)  {
            setPwValid(true);
            setNotAllow(false);
        } else {
            setPwValid(false);
            setNotAllow(true);
        }
    }

    const onClickSignOutButton = () => {
        cookies.remove('accessToken');
        cookies.remove('refreshToken');
        cookies.remove('email');
        alert('로그아웃이 완료되었습니다. 홈 화면으로 이동합니다.');
        goToHome();
    }

    const goToInfo = () => {
        navigate("/Information");
    }

    return (
        <div className="page123">
            <img src="/assets/image/background.jpg" alt="background" className='wallPaper123'/>
            <div className="upperSpace123">
                <div className="upperHomeWrap">
                    <button class="upperHome123" onClick={goToHome}>HOME</button>
                </div>

                <div className="upperNoticeWrap">
                    <button className="upperNotice123" onClick={goToNoticeBoard}>NOTICE</button>
                </div>

                <div className="upperGuideWrap">
                    <button className="upperGuide123" onClick={goToInfo}>GUIDE</button>
                </div>

                <div className="upperCommunityWrap">
                    <button className="upperCommunity123"  onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                        COMMUNITY
                        {isDropdownVisible && (
                            <div className="dropdownMenu123">
                                <li onClick={goToFreeBulletinBoard} className="dropdownWord">자유 게시판</li>
                                <li onClick={goToReportBulletinBoard} className="dropdownWord">신고 게시판</li>
                            </div>
                        )}
                    </button>
                </div>
                { cookies.get('accessToken') ? (
                        <div className="upperLoginAndSignOutWrap">
                            <div className="upperInfoWrap123">
                                <button className="upperLogin123" onClick={goToInfo}>INFO</button> 
                            </div>
                            <div className="upperSignOutWrap">
                                <button className="upperLogin123" onClick={onClickSignOutButton}>LOGOUT</button> 
                            </div>
                        </div>
                    ) : (
                        <div className="upperLoginWrap">
                            <button className="upperLogin123" onClick={goToLogin}>LOGIN</button>
                        </div>
                )}
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
                            <span>8~15자의 영문, 숫자, 특수문자를 포함해서 입력해주세요.</span>
                        )
                    }
                    </div>

                    <button onClick={onClickModifyPasswordButton} disabled={notAllow} className="bottomPasswordSearchButton123">비밀번호 수정</button>

                </div>
            </div>
        </div>
    )}