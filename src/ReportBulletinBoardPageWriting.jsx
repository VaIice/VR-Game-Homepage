import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useRef } from "react";
import Swal from "sweetalert2";

const cookies = new Cookies()

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/boards/register`;
const SERVER_URL_IMAGE = `${process.env.REACT_APP_SERVER_URL}/boards/api/upload`;

export default function ReportBulletinBoardPageWriting() {
    const navigate = useNavigate();
    // 이메일이 유효한지 확인
    const [titleValid, setTitleValid] = useState(false);
    // 비밀번호가 유효한지 확인
    const [contentValid, setContentValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);

    const goToHome = () => {
        navigate("/");
    }

    useEffect(() => {
        if (titleValid && contentValid) {
            setNotAllow(false);
            return;
        } else {
            setNotAllow(true);
        }
    }, [titleValid, contentValid]);

    const goToNoticeBoard = () => {
        navigate("/NoticeBoard");
        cookies.set('page', 1);
    }

    
    const goToLogin = () => {
        navigate("/Login");
    }

    const goToFreeBulletinBoard = () => {
        navigate("/FreeBulletinBoard");
        cookies.set('page', 1);
    }

    const goToReportBulletinBoard = () => {
        navigate("/ReportBulletinBoard");
        cookies.set('page', 1);
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // 사용자가 적고 있는 이메일 
    const [title, setTitle] = useState('');
    // // 사용자가 적고 있는 비밀번호
    const [contents, setContents] = useState('');

    const [secret, setSecret] = useState(0);

    const handleTitle = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (newTitle.length >= 1) {
            setTitleValid(true);
        }
        else {
            setTitleValid(false);
        }
    }

    const textarea = useRef();


    const handleContents = (e) => {
        const newContents = e.target.value;
        setContents(newContents);
        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight + 'px';
        if (newContents.length >= 1) {
            setContentValid(true);
        }
        else {
            setContentValid(false);
        }
    };

    const dataToSend = {
        title: title,
        content: contents,
        boardType: "REPORT",
        secret: secret
    };

    const [bno, setBno] = useState(-1);

    const onClickSecretButton = async () => {
        if (secret===1) {
            setSecret(0);
        }
        else {
            setSecret(1);
        }
    }


    const onClickWritingButton = async () => {
        const fetchData = async () => {
            try {
                const response = await axios.post(SERVER_URL, dataToSend, {
                    headers: {
                        'Authorization': `Bearer ${cookies.get('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                });

                const shouldShowLoading = file.some(f => f.name.toLowerCase().endsWith('.gif')) || ( file.length === 3 || file.length === 4 || file.length === 5);

                if (shouldShowLoading) {
                    const loadingSwal = Swal.fire({
                        icon: "warning",
                        title: "게시글을 등록 중입니다.",
                        showConfirmButton: false,
                        showCancelButton: false
                    });

                    if (fileExist) {
                        for (let i = 0; i < file.length; i++) {
                            const responseImage = await axios.post(SERVER_URL_IMAGE, 
                                {
                                    file: file[i],
                                    boardType: "REPORT",
                                    bno: response.data
                                },
                                {
                                    headers: {
                                        'Authorization': `Bearer ${cookies.get('accessToken')}`,
                                        'Content-Type': 'multipart/form-data'
                                    }
                            });
                        }
                        loadingSwal.close();
                    }
                    cookies.set('secret', secret, { maxAge: 60*60*24});
                    navigate(`/ReportBulletinBoardPage/${response.data}`);
                }
                else {
                    if (fileExist) {
                        for (let i = 0; i < file.length; i++) {
                            const responseImage = await axios.post(SERVER_URL_IMAGE, 
                                {
                                    file: file[i],
                                    boardType: "REPORT",
                                    bno: response.data
                                },
                                {
                                    headers: {
                                        'Authorization': `Bearer ${cookies.get('accessToken')}`,
                                        'Content-Type': 'multipart/form-data'
                                    }
                            });
                        }
                    }
                    cookies.set('secret', secret, { maxAge: 60*60*24});
                    navigate(`/ReportBulletinBoardPage/${response.data}`);
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "게시글 등록을 실패하였습니다.",
                    showCancelButton: false
                });

            }
        };

        fetchData();
    }

    const goToGuide = () => {
        navigate("/Guide");
    }

    const onClickCancelButton = async () => {
        goToReportBulletinBoard();
    }


    const imageInput = useRef(null);

    const [fileExist, setFileExist] = useState(false);

    const [file, setFile] = useState('');
    
    const onClickImageUpload = () => {
        imageInput.current.click();
    };

    const formData = new FormData();

    const onFileSelect = (e) => {
        const maxFileSize = 10 * 1024 * 1024; // 10MB
    
        if (e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
    
            // 각 파일의 크기를 확인
            const isFileSizeValid = selectedFiles.every(file => file.size < maxFileSize);
    
            if (e.target.files.length > 5) {
                Swal.fire({
                    icon: "warning",
                    title: '이미지는 5개로 제한됩니다.',
                    showCancelButton: false
                });
                e.target.value = null; // 파일 선택 창 초기화
                setFileExist(false);
            }
            else {
                if (!isFileSizeValid) {
                    Swal.fire({
                        icon: "warning",
                        title: "각 파일의 크기는 10MB를 초과할 수 없습니다.",
                        showCancelButton: false
                    });
                    e.target.value = null; // 파일 선택 창 초기화
                    setFileExist(false); // 파일 존재 상태 변경
                    return;
                }
                const selectedFiles = Array.from(e.target.files);
                setFile(selectedFiles);
                setFileExist(true);
            }
        } else {
            setFileExist(false); // 파일이 선택되지 않은 경우 checkbox 선택 상태로 변경
        }
    };

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
                    }).then(async () => {
                        goToLogin();
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
                    }).then(async () => {
                        goToLogin();
                    });
                }
            }
        });
    }

    const goToInfo = () => {
        navigate("/Information");
    }
    
    const handleDeleteImage = (index) => {
        const updatedFiles = [...file];
        updatedFiles.splice(index, 1);
        setFile(updatedFiles);

        if (!updatedFiles[0]) {
            setFileExist(false);
        }
      };

    return (
        <div className="page12345">
            <img src="/assets/image/background.jpg" alt="background" className='wallPaper123'/>
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
                <div className = "BulletinBoardWritingUpper">
                    <div className="BulletinBoardWritingUpperLeft">
                        <div className="BulletinBoardTitle123">신고 게시판</div>
                    </div>
                    <div className="BulletinBoardWritingUpperRight">
                        <button className="BulletinBoardSecretButton" onClick={onClickSecretButton}>
                            <span className='BulletinBoardImageWord'>비밀글</span>
                            <input
                                type="checkbox"
                                className='BulletinBoardImageCheckbox'
                                onChange={onClickSecretButton}
                                />
                        </button>

                        <button className="BulletinBoardImageButton" onClick={onClickImageUpload}>
                            <input
                                type="file"
                                ref={imageInput}
                                accept=".jpg, .jpeg, .png, .gif"
                                style={{display:'none'}}
                                onChange={onFileSelect}
                                multiple
                            />
                            <span className='BulletinBoardImageWord'>이미지</span>
                            <input
                                type="checkbox"
                                className='BulletinBoardImageCheckbox'
                                checked={fileExist}
                            />
                        </button>
                    </div>
                </div>
                <div className="BulletinBoardLongLineUpper"/>
                <div className = "BulletinBoardWritingMiddle">
                    <div className = "BulletinBoardWritingTitleWrap">
                        <input
                            type = 'text'
                            className="BulletinBoardWritingTitleInput"
                            placeholder="제목"
                            value={title}
                            onChange={handleTitle}/>
                    </div>
                    <div className="BulletinBoardShortLine"/>
                    <div className = "BulletinBoardWritingContentsWrap">
                        <textarea
                                ref={textarea}            
                                type = 'text'
                                className="inputWritingContents"
                                placeholder="내용"
                                value={contents}
                                onChange={handleContents}
                                />
                    </div>
                    <div className="BulletinBoardShortLine"/>
                </div>
                <div className = "BulletinBoardWritingBottom">
                    {fileExist && (
                        <div className = "BulletinBoardWritingImage">
                            {file.map((file, index) => (
                                <div key={index} className="ImageContainer">
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(file)}
                                        alt={`file-${index}`}
                                        className="BulletinBoardImage"
                                    />                                    
                                    <img src="assets/image/trash1.svg" className="trashImage" onClick={() => handleDeleteImage(index)}/>
                                </div>
                            ))}
                        </div>
                    )}
                    {fileExist && (
                        <div className="BulletinBoardWritingFileBottomLine"/>
                    )}
                    <div className = "BulletinBoardWritingButtonWrap">
                        <button className='BulletinBoardWritingButton' disabled={notAllow} onClick={onClickWritingButton}>글쓰기</button>  
                        <button className='BulletinBoardWritingCancelButton' onClick={onClickCancelButton}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    )}