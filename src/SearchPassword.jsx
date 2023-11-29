import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Cookies} from 'react-cookie';
import Swal from "sweetalert2";

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/send-mail/password`

const cookies = new Cookies()

export default function NoticeBoard() {
    // const [cookies, setCookie, removeCookie] = useCookies(['Token']);
    // 사용자가 적고 있는 이메일 
    const [email, setEmail] = useState('');
    // 이메일이 유효한지 확인
    const [emailValid, setEmailValid] = useState(false);
    // 이메일, 비밀번호가 유효하다면 활성화
    const [notAllow, setNotAllow] = useState(true);

    const [pushButtonTime, setPushButtonTime] = useState(3000);
    // 서버에 보낼 이메일, 비밀번호
    const dataToSend = {
        email: email
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex =
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (regex.test(e.target.value)) {
            setEmailValid(true);
            setNotAllow(false);
        } else {
            setEmailValid(false);
            setNotAllow(true);
        }
    }

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
    const onClickSendEmailButton = async () => {
        const fetchData = async () => {
            const loadingSwal = Swal.fire({
                icon: "warning",
                title: "이메일을 발송 중입니다.",
                showConfirmButton: false,
                showCancelButton: false
            });
    
            try {
                const response = await axios.post(SERVER_URL, dataToSend);
                loadingSwal.close();
                Swal.fire({
                    icon: "success",
                    title: "이메일 발송에 성공하였습니다.",
                    text: "약간의 시간이 걸릴 수 있습니다.",
                    showCancelButton: false
                });
                goToHome();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "이메일 발송에 실패하였습니다.",
                    showCancelButton: false
                });
            }
        };
    
        fetchData();
    }

    const goToGuide = () => {
        navigate("/Guide");
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
      };

    const goToInfo = () => {
        navigate("/Information");
    }

    const onClickSignOutButton = () => {
        Swal.fire({
            icon: "warning",
            title: "로그아웃 하시겠습니까?",
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니요",
        }).then(async (res) => {
            if (res.isConfirmed) {
                try {
                    cookies.remove('accessToken');
                    cookies.remove('refreshToken');
                    cookies.remove('email');
                    Swal.fire({
                        icon: "success",
                        title: '로그아웃이 완료되었습니다.',
                        text: '홈 화면으로 이동합니다.',
                        showCancelButton: false
                    }).then(async () => {
                        goToHome();
                    });
                } catch (error) {
                    cookies.remove('accessToken');
                    cookies.remove('refreshToken');
                    cookies.remove('email');
                    Swal.fire({
                        icon: "error",
                        title: '로그인 에러가 발생하였습니다.',
                        text: '다시 로그인을 진행해주세요.',
                        showCancelButton: false
                    });
                }
            } else {
                try {
                } catch (error) {
                    cookies.remove('accessToken');
                    cookies.remove('refreshToken');
                    cookies.remove('email');
                    Swal.fire({
                        icon: "error",
                        title: '로그인 에러가 발생하였습니다.',
                        text: '다시 로그인을 진행해주세요.',
                        showCancelButton: false
                    });
                }
            }
        });
    }

    return (
        <div className="page123">
            <img src="assets/image/background.jpg" alt="background" className='wallPaper123'/>
            <div className="upperSpace123">
                <div className="upperHomeWrap">
                    <button class="upperHome123" onClick={goToHome}>HOME</button>
                </div>

                <div className="upperNoticeWrap">
                    <button className="upperNotice123" onClick={goToNoticeBoard}>NOTICE</button>
                </div>

                <div className="upperGuideWrap">
                    <button className="upperGuide123" onClick={goToGuide}>GUIDE</button>
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
                                <button className="upperLogin12345" onClick={goToInfo}>INFO</button> 
                            </div>
                            <div className="upperSignOutWrap">
                                <button className="upperLogin1234" onClick={onClickSignOutButton}>LOGOUT</button> 
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
                    <div className="titleSignUp123">비밀번호 찾기</div>
                    <div className="inputWrapEmailPasswordSearchWrap123">
                            <input
                                type = 'text'
                                className="inputEmail123"
                                placeholder="이메일"
                                value={email}
                                onChange={handleEmail}
                            />
                    </div>
                    <div className="errorMessage123">
                        {
                            email.length > 0 && !emailValid && (
                                <span>올바른 이메일 형식을 입력해주세요.</span>
                            )
                        }
                    </div>

                    <button onClick={onClickSendEmailButton} disabled={notAllow} className="bottomPasswordSearchButton123">이메일 보내기</button>
                </div>
            </div>
        </div>
    )}