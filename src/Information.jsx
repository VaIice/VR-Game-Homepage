import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';
import Swal from "sweetalert2";

const cookies = new Cookies()

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/api/member/me`

export default function NoticeBoard() {
    // 사용자가 적고 있는 이메일 
    const [email, setEmail] = useState('');
    // 사용자가 적고 있는 핸드폰 번호
    const [phoneNumber, setPhoneNumber] = useState('');
    // 사용자가 적고 있는 이름
    const [name, setName] = useState('');
    // 이메일이 유효한 형식인지 확인
    const [emailValid, setEmailValid] = useState(false);
    // 핸드폰 번호가 유효한 형식인지 확인
    const [phoneNumberValid, setPhoneNumberValid] = useState(false);
    // 이름이 유효한 형식인지 확인
    const [nameValid, setNameValid] = useState(false);
    // 정보들이 유효한 형식이면 활성화
    const [notAllow, setNotAllow] = useState(true);

    // 서버에 보낼 정보
    const dataToSend = {
        phoneNumber: phoneNumber,
        name: name
    };

    useEffect(() => {    
        const fetchData = async () => {
            try {
                const response = await axios.get(SERVER_URL, {
                    headers: {
                        'Authorization': `Bearer ${cookies.get('accessToken')}`,
                    }
                });
                setEmail(response.data.email);
                setName(response.data.name);
                setPhoneNumber(response.data.phoneNumber);
                setEmailValid(true);
                setPhoneNumberValid(true);
                setNameValid(true);
                setNotAllow(true);
                console.log(notAllow);
            } catch (error) {
                alert('오엥', error);
            }

        };
        fetchData();
    }, []);


    // 이메일, 비밀번호가 유효한 형식이라면 버튼 활성화
    useEffect(() => {
        if (phoneNumberValid && nameValid) {
            setNotAllow(false);
            return;
        } else {
            setNotAllow(true);
        }
    }, [phoneNumberValid, nameValid]);

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

    const goToInformationPassword = () => {
        navigate("/InformationPassword")
    }

    const onClickConfirmButton = async() => {
        const fetchData = async () => {
            try {
                const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/member/me`, dataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.get('accessToken')}`,                        
                    }
                }
                );
                console.log(response);
                alert('회원 정보가 업데이트되었습니다.');
                goToHome();
            } catch (error) {
                alert('Error fetching data: signUp ClickButton', error);
            }
        };
        fetchData();
    }

    const onClickWithdrawalButton = async() => {
        const fetchData = async () => {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/member/me`,
                {
                    headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`,
                }});
                console.log(response);
                
            } catch (error) {
                alert('Error fetching data: signUp ClickButton', error);
            }
        };

        Swal.fire({
            icon: "warning",
            // title: "게시글 삭제",
            text: '회원을 탈퇴하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니요",
        })
        .then(async (res) => {
            if (res.isConfirmed) {
                try {
                    fetchData();
                    alert('회원 탈퇴가 완료되었습니다.');
                } catch (error) {
                    alert('Error remove data: 삭제 실패', error);
                }
            }
        });
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
                        <button className="upperLogin123" onClick={goToLogin}>Sign In</button>
                    )}
                </div>

            </div>

            <div className="contentWrap123">
                <div className="SignUpWrap">
                    <div className="titleSignUp123">Information</div>
                    <div className="inputWrapEmailInfo123">
                        <div className="inputEmailInfo123">
                            {email}
                        </div>
                    </div>
                    <div className="errorMessage123"/>

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

                    <button onClick={onClickConfirmButton} disabled={notAllow} className="bottomSignUpButton123">내 정보 수정</button>

                    <div className="signInBottom">
                        <div className="modifyPassword123" onClick={goToInformationPassword}>
                            비밀번호 수정
                        </div>

                        <div className="withdrawalButton123" onClick={onClickWithdrawalButton}>
                            회원 탈퇴
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )}