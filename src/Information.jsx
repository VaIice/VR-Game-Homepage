import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';
import Swal from "sweetalert2";

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/api/member/me`

const cookies = new Cookies()

export default function SignUp() {
    // 사용자가 적고 있는 이메일 
    const [email, setEmail] = useState('');
    // 사용자가 적고 있는 비밀번호
    const [pw, setPw] = useState('');
    // 사용자가 적고 있는 핸드폰 번호
    const [phoneNumber, setPhoneNumber] = useState('');
    // 사용자가 적고 있는 이름
    const [name, setName] = useState('');
    // 비밀번호가 유효한 형식인지 확인
    const [pwValid, setPwValid] = useState(false);
    // 핸드폰 번호가 유효한 형식인지 확인
    const [phoneNumberValid, setPhoneNumberValid] = useState(false);
    // 이름이 유효한 형식인지 확인
    const [nameValid, setNameValid] = useState(false);
    // 정보들이 유효한 형식이면 활성화
    const [notAllow, setNotAllow] = useState(true);

    // 서버에 보낼 정보
    const dataToSend = {
        password: pw,
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
                setPhoneNumberValid(true);
                setNameValid(true);
            } catch (error) {
                alert('오엥', error);
            }

        };
        fetchData();
    }, []);


    // 이메일, 비밀번호가 유효한 형식이라면 버튼 활성화
    useEffect(() => {
        if (pwValid && phoneNumberValid && nameValid) {
            setNotAllow(false);
            return;
        } else {
            setNotAllow(true);
        }
    }, [pwValid, phoneNumberValid, nameValid]);

    const handlePw = (e) => {
        e.target.value = e.target.value.slice(0,16);
        setPw(e.target.value);
        const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if (regex.test(e.target.value) && e.target.value.length >= 8)  {
            setPwValid(true);
        } else {
            setPwValid(false);
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

    const goToCommunity = () => {
        navigate("/Community");
    }

    const goToLogin = () => {
        navigate("/Login");
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

    return (
        <div className="page">
        <img src="assets/image/wallpaper.jpg" alt="background" className='wallPaper'/>
            <div className="upper"/>
            <hr style={{display: 'white', marginTop: 96}}/>
            <div className="topLoginButton" onClick={goToLogin}/>
            <div className="topLogin" onClick={goToLogin}>Login</div>
            <div className="topNotice" onClick={goToNoticeBoard}>News</div>
            <div className="topGuide">Guide</div>
            <div className="topCommunity" onClick={goToCommunity}>Community</div>
            <div className="topHome" onClick={goToHome}>Home</div>
            <div className="topHomeButton" onClick={goToHome}/>

            <div className="titleSignUp">내 정보 수정</div>
            <div className="inputWrap" style={{top: 200}}> 
                <input
                    type = 'text'
                    className="input"
                    placeholder="이메일"
                    value={email}
                    />
            </div>

            <div className="inputWrap" style={{top: 310}}>
                <input
                    type = 'password'
                    className="input"
                    placeholder="비밀번호"
                    value={pw}
                    onChange={handlePw}/>
            </div>
            <div>
                {
                    pw.length > 0 && !pwValid && (
                        <div className="errorMessage" style={{top: 382}}>8~16자의 영문, 숫자, 특수문자를 입력해주세요.</div>
                    )
                }
            </div>

            <div className="inputWrap" style={{top: 420}}>
                <input
                    type = 'text'
                    className="input"
                    placeholder="핸드폰 번호"
                    value={phoneNumber}
                    onChange={handlePhoneNumber}/>
            </div>
            <div>
                {
                    !phoneNumberValid && phoneNumber.length > 0 && (
                        <div className="errorMessage" style={{top: 492}}>10~11자의 숫자만 입력해주세요.</div>
                    )
                }
            </div>

            <div className="inputWrap" style={{top: 530}}>
                <input
                    type = 'text'
                    className="input"
                    placeholder="이름"
                    value={name}
                    onChange={handleName}/>
            </div>
            <div>
                {
                    !nameValid && name.length !== 0 && (
                        <div className="errorMessage" style={{top: 602}}>2자 이상의 한글, 영문만 입력해주세요.</div>
                    )
                }
            </div>

            <div>
                <button onClick={onClickConfirmButton} disabled={notAllow} className="bottomSignUpButton">정보 수정</button>
            </div>

            <div className="withdrawalButton" onClick={onClickWithdrawalButton}>
                회원 탈퇴
            </div>

        </div>
    )
}