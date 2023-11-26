import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';

const cookies = new Cookies()
const SERVER_URL_SIGN_UP = `${process.env.REACT_APP_SERVER_URL}/auth/signup`

export default function NoticeBoard() {
    // 사용자가 적고 있는 이메일 
    const [email, setEmail] = useState('');
    // 사용자가 적고 있는 비밀번호
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');
    // 사용자가 적고 있는 핸드폰 번호
    const [phoneNumber, setPhoneNumber] = useState('');
    // 사용자가 적고 있는 이름
    const [name, setName] = useState('');

    // 이메일이 유효한 형식인지 확인
    const [emailValid, setEmailValid] = useState(false);
    // 비밀번호가 유효한 형식인지 확인
    const [pwValid, setPwValid] = useState(false);
    const [pw2Valid, setPw2Valid] = useState(false);
    // 핸드폰 번호가 유효한 형식인지 확인
    const [phoneNumberValid, setPhoneNumberValid] = useState(false);
    // 이름이 유효한 형식인지 확인
    const [nameValid, setNameValid] = useState(false);
    // 정보들이 유효한 형식이면 활성화
    const [notAllow, setNotAllow] = useState(true);
    const [notAllowEmailCheck, setNotAllowEmailCheck] = useState(true);
    // 서버로부터 받은 이메일
    const [enabledEmail, setEnabledEmail] = useState(false);

    // 서버에 보낼 정보
    const dataToSend = {
        email: email,
        password: pw,
        phoneNumber: phoneNumber,
        name: name
    };

    // 이메일, 비밀번호가 유효한 형식이라면 버튼 활성화
    useEffect(() => {
        if (emailValid && pwValid && phoneNumberValid && nameValid && pw2Valid && enabledEmail) {
            setNotAllow(false);
            return;
        } else {
            setNotAllow(true);
        }
    }, [emailValid, pwValid, phoneNumberValid, nameValid, pw2Valid, enabledEmail]);

    useEffect(() => {
        if (emailValid) {
            setNotAllowEmailCheck(false);
        } else {
            setNotAllowEmailCheck(true);
        }
    }, [emailValid]);

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

    const handlePw = (e) => {
        e.target.value = e.target.value.slice(0,15);
        setPw(e.target.value);
        const regex =
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'"]).{8,15}$/;
        if (regex.test(e.target.value) && e.target.value.length >= 8)  {
            setPwValid(true);
        } else {
            setPwValid(false);
        }
        if (e.target.value !== pw2) {
            setPw2Valid(false);
        }
    }

    const handlePw2 = (e) => {
        e.target.value = e.target.value.slice(0,15);
        setPw2(e.target.value);
        const regex =
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'"]).{8,15}$/;
        if (regex.test(e.target.value) && e.target.value.length >= 8 && (pw === e.target.value))  {
            setPw2Valid(true);
        } else {
            setPw2Valid(false);
        }
    }

    const handlePhoneNumber = async (e) => {
        if (e.target.value.length === 10 || e.target.value.length === 12) {
            e.target.value = e.target.value.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else if (e.target.value.length === 13) {
            e.target.value = e.target.value.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        e.target.value = e.target.value.slice(0,13);

        setPhoneNumber(e.target.value);
        
        const regex = /[0-9]+$/;
        if (regex.test(e.target.value) && (e.target.value.length === 12 || e.target.value.length === 13)) {
            setPhoneNumberValid(true);
        } else {
            setPhoneNumberValid(false);
        }
    }

    const handleName = async (e) => {
        const regex = /^[ㄱ-ㅎ가-힣a-zA-Z]+$/;
        setName(e.target.value);

        if (regex.test(e.target.value) && e.target.value.length >= 2) {
            setNameValid(true);
        } else {
            setNameValid(false);
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
    
    // 확인 버튼을 클릭했을 시 토큰 비교 (수정 필요)
    const onClickConfirmButton = async() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(SERVER_URL_SIGN_UP, dataToSend);
                alert('회원가입에 성공했습니다.');
                goToLogin();
            } catch (error) {
                alert('회원가입에 실패하였습니다.');
            }
        };
        fetchData();
    }

    const SERVER_URL_EMAIL_CHECK = `${process.env.REACT_APP_SERVER_URL}/auth/check-email?email=${email}`

    const onClickEmailCheckButton = async() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(SERVER_URL_EMAIL_CHECK);
                if (response.data === "사용 가능한 이메일입니다.") {
                    alert("사용 가능한 이메일입니다.");
                    setEnabledEmail(true);
                } else {
                    alert("중복된 이메일입니다.")
                    setEnabledEmail(false);
                    setEmailValid(false);
                }
            } catch (error) {
                alert('이메일 중복 체크에 실패하였습니다.');
            }
            
        };
        fetchData();
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const goToInfo = () => {
        navigate("/Information");
    }

    const onClickSignOutButton = () => {
        cookies.remove('accessToken');
        cookies.remove('refreshToken');
        cookies.remove('email');
        alert('로그아웃이 완료되었습니다.');
        window.location.reload(); // Reload the page after logging out
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
                <div className="SignUpWrap">
                    <div className="titleSignUp123">회원가입</div>
                    <div className="inputWrapEmailSignUp123">
                        <div className="inputWrapEmailSignUpLeft123">
                            <input
                                type = 'text'
                                className="inputEmail123"
                                placeholder="이메일"
                                value={email}
                                onChange={handleEmail}
                            />
                        </div>
                        <div className="inputWrapEmailSignUpRight123">
                            <button className='emailCheckButton' onClick={onClickEmailCheckButton} disabled={notAllowEmailCheck}>중복 체크</button>  
                        </div>
                    </div>
                    <div className="errorMessage123">
                        {
                            email.length > 0 && !emailValid && (
                                <span>올바른 이메일 형식을 입력해주세요.</span>
                            )
                        }
                    </div>

                    <div className="inputWrapPasswordSignUp123"> 
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

                    <div className="inputWrapPasswordSignUp123"> 
                        <input
                            type = 'password'
                            className="input123"
                            placeholder="비밀번호 확인"
                            value={pw2}
                            onChange={handlePw2}/>
                    </div>
                    <div className="errorMessage123">
                    {
                        pw2.length > 0 && !pw2Valid && (pw !== pw2) && (
                            <span>비밀번호와 일치하지 않습니다.</span>
                        )
                    }
                    </div>

                    <div className="inputWrapNameSignUp123"> 
                        <input
                            type = 'text'
                            className="input123"
                            placeholder="이름"
                            value={name}
                            onChange={handleName}/>
                    </div>
                    <div className="errorMessage123">
                    {
                        !nameValid && name.length !== 0 && (
                            <span>2자 이상의 한글, 영문만 입력해주세요.</span>
                        )
                    }
                    </div>

                    <div className="inputWrapNamePhoneNumber123">
                        <input
                            type = 'text'
                            className="input123"
                            placeholder="핸드폰 번호"
                            value={phoneNumber}
                            onChange={handlePhoneNumber}/>
                    </div>
                    <div className="errorMessage123">
                        {
                            !phoneNumberValid && phoneNumber.length > 0 && (
                                <span>10~11자의 숫자만 입력해주세요.</span>
                            )
                        }
                    </div>

                    <button onClick={onClickConfirmButton} disabled={notAllow} className="bottomSignUpButton123">회원가입</button>

                </div>
            </div>
        </div>
    )}