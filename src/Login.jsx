import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Cookies} from 'react-cookie';
import Swal from "sweetalert2";


const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/auth/login`
const cookies = new Cookies()

export default function Login() {
        // const [cookies, setCookie, removeCookie] = useCookies(['Token']);
        // 사용자가 적고 있는 이메일 
        const [email, setEmail] = useState('');
        // 사용자가 적고 있는 비밀번호
        const [pw, setPw] = useState('');
        // 이메일이 유효한지 확인
        const [emailValid, setEmailValid] = useState(false);
        // 비밀번호가 유효한지 확인
        const [pwValid, setPwValid] = useState(false);
        // 이메일, 비밀번호가 유효하다면 활성화
        const [notAllow, setNotAllow] = useState(true);
        // grantType
        const [grantType, setGrantType] = useState('');
        // flagAccessToken
        const [flagAccessToken, setFlagAccessToken] = useState(false);
        // accessToken
        const [accessToken, setAccessToken] = useState('');
        // refreshToken
        const [refreshToken, setRefreshToken] = useState('');
        // accessTokenExpiresln
        const [accessTokenExpiresln, setAccessTokenExpiresln] = useState('');
    
        // 서버에 보낼 이메일, 비밀번호
        const dataToSend = {
            email: email,
            password: pw
        };

        const checkToken = async () => {
            Swal.fire({
                icon: "info",
                title: "로그인 정보가 만료되었습니다.",
                text: '로그인을 연장할까요?',
                showCancelButton: true,
                confirmButtonText: "예",
                cancelButtonText: "아니요",
            }).then(async (res) => {
                if (res.isConfirmed) {
                    try {
                        if (cookies.get('accessToken') && cookies.get('refreshToken')) {
                            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/reissue`, { accessToken: cookies.get('accessToken'), refreshToken: cookies.get('refreshToken') });
                            console.log('response', response);

                            // cookies.set('accessToken', response.data.accessToken, { maxAge: response.data.accessTokenExpiresln});
                            cookies.set('accessToken', response.data.accessToken, { maxAge: 60*30});
                            cookies.set('refreshToken', response.data.refreshToken, { maxAge: 10000000 });
    
                            console.log('재발행 response :', response);
                            setTimeout(checkToken, 60*25*1000); // 10초 후에 checkTokenInterval 함수를 다시 호출
                        }
                        else {
                            alert('세션 만료');
                            cookies.remove('accessToken');
                            cookies.remove('refreshToken');
                            console.log('쿠키 삭제');
                            goToLogin();
                        }
                    } catch (error) {
                        alert('Error fetching data: 재발행 실패', error);
                    }
                } else {
                    alert('연장 취소');
                    cookies.remove('accessToken');
                    cookies.remove('refreshToken');
                    console.log('연장 취소 버튼 쿠키 삭제')
                    goToLogin();
                }
            });
    };
    
        // 이메일, 비밀번호가 유효한 형식이라면 버튼 활성화
        useEffect(() => {
            if (emailValid && pwValid) {
                setNotAllow(false);
                return;
            } else {
                setNotAllow(true);
            }
        }, [emailValid, pwValid]);


        // 이메일이 유효한 형식인지 확인
        const handleEmail = (e) => {
            setEmail(e.target.value);
            const regex =
                /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
            if (regex.test(e.target.value)) {
                setEmailValid(true);
            } else {
                setEmailValid(false);
            }
        }
    
        // 비밀번호가 유효한 형식인지 확인
        const handlePw = (e) => {
            e.target.value = e.target.value.slice(0,15);
            setPw(e.target.value);
            const regex =
                /^(?=.*[a-zA-z])(?=.*[0-9]).{8,15}$/;
            if (regex.test(e.target.value) && e.target.value.length >= 8)  {
                setPwValid(true);
            } else {
                setPwValid(false);
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

        const goToSignUp = () => {
            navigate("/SignUp");
        }

        const goToSearchPassword = () => {
            navigate("/SearchPassword");
        }

        // 확인 버튼을 클릭했을 시 토큰 비교 (수정 필요)
        const onClickConfirmButton = async () => {
            const fetchData = async () => {
            try {
                console.log(dataToSend);
                const response = await axios.post(SERVER_URL, dataToSend);
                console.log('response: ', response);
                console.log('response.data: ', response.data);
                console.log('response.data.accessToken: ', response.data.accessToken);
                // const newAccessToken = response.data.accessToken;
                // const newRefreshToken = response.data.refreshToken;
                // const newExpireIn = response.data.accessTokenExpiresln;

                // setGrantType(response.data.grantType);
                // setAccessToken(newAccessToken);
                // setRefreshToken(newRefreshToken);
                // setAccessTokenExpiresln(newExpireIn);

                // cookies.set('accessToken', response.data.accessToken, {maxAge: response.data.accessTokenExpiresln})
                cookies.set('accessToken', response.data.accessToken, {maxAge: 60*30})
                cookies.set('refreshToken', response.data.refreshToken, {maxAge: 10000000});
                cookies.set('email', encodeURIComponent(email), {maxAge: 60*30});
                console.log('accessToken: ', response.data.accessToken);
                console.log('refreshToken: ', response.data.refreshToken);
                loginSuccess();
            } catch (error) {
                alert('등록되지 않은 정보입니다.', error);
            }
            };
        
            const loginSuccess = () => {
                axios.defaults.headers.common['Authorization'] = `${grantType} ${accessToken}`;
                // cookies.set('accessToken', accessToken, {maxAge: accessTokenExpiresln})
                // cookies.set('refreshToken', refreshToken, {maxAge: 60});
                alert('로그인에 성공했습니다.');
                goToHome();
                setTimeout(checkToken, 60*25*1000); // 10초 후에 checkTokenInterval 함수를 다시 호출
            };

            fetchData();
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
                        <button className="upperLogin123" onClick={goToLogin}>Login</button>
                    )}
                </div>

            </div>

            <div className="contentWrap123">
                <div className="SignInWrap">
                    <div className="titleLogin123">Login</div>
                    <div className="inputWrapEmail123"> 
                        <input
                            type = 'text'
                            className="input123"
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
                    <div className="inputWrapPassword123"> 
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
                            <span>8~15자의 영문, 숫자를 포함해서 입력해주세요.</span>
                        )
                    }
                    </div>

                    <button onClick={onClickConfirmButton} disabled={notAllow} className="bottomLoginButton123">Login</button>

                    <div className="signInBottom">
                        <div className="searchPassword123" onClick={goToSearchPassword}>
                            비밀번호 찾기
                        </div>

                        <div className="signUp123" onClick={goToSignUp}>
                            회원가입
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}