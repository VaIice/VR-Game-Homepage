import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useRef } from "react";

const cookies = new Cookies()

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/boards/register`;
const SERVER_URL_IMAGE = `${process.env.REACT_APP_SERVER_URL}/boards/api/upload`;
export let secretPageWriting = '0';

export default function FreeBulletinBoardPageWriting() {
    const navigate = useNavigate();

    // 이메일이 유효한지 확인
    const [titleValid, setTitleValid] = useState(false);
    // 비밀번호가 유효한지 확인
    const [contentValid, setContentValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);

    const goToHome = () => {
        navigate("/");
        console.log(1, cookies.get('refreshToken'))
        console.log(2, cookies.get('accessToken'))
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
    }

    
    const goToLogin = () => {
        navigate("/Login");
    }

    const goToFreeBulletinBoard = () => {
        navigate("/FreeBulletinBoard");
    }

    const goToReportBulletinBoard = () => {
        navigate("/ReportBulletinBoard");
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // 사용자가 적고 있는 이메일 
    const [title, setTitle] = useState('');
    // // 사용자가 적고 있는 비밀번호
    const [contents, setContents] = useState('');

    const [secret, setSecret] = useState('0');

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
        boardType: "FREE",
        secret: secret
    };

    const [bno, setBno] = useState(-1);

    const onClickSecretButton = async () => {
        if (secret==='1') {
            setSecret('0');
            console.log('공개 전환');
        }
        else {
            setSecret('1');
            console.log('비공개 전환');
        }
    }

    const onClickWritingButton = async () => {
        const fetchData = async () => {
        try {
            console.log('dataToSend :', dataToSend);
            const response = await axios.post(SERVER_URL, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (fileExist) {
                console.log(file);
                for (let i = 0; i < file.length; i++) {
                    const responseImage = await axios.post(SERVER_URL_IMAGE, 
                        {
                            file: file[i],
                            boardType: "FREE",
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

            if (secret === '1') {
                secretPageWriting = '1';
            }
            console.log('게시글 등록이 완료되었습니다.')
            navigate(`/FreeBulletinBoardPage/${response.data}`);

        } catch (error) {
            alert('Error fetching data: Free Writing Button', error);
        }
        };

        fetchData();
        // console.log('파일명 :', dataToSendImage);
        console.log('글쓰기 버튼 클릭');
    }

    const onClickCancelButton = async () => {
        goToFreeBulletinBoard();
    }


    const imageInput = useRef(null);

    const [fileExist, setFileExist] = useState(false);

    const [file, setFile] = useState('');
    
    const onClickImageUpload = () => {
        imageInput.current.click();
    };

    const formData = new FormData();

    const onFileSelect = (e) => {
        if (e.target.files[0]) {
            if (e.target.files.length > 5) {
                alert('이미지는 5개로 제한됩니다.');
                e.target.value = null; // 파일 선택 창 초기화
                setFileExist(false);
            }
            else {
                const selectedFiles = Array.from(e.target.files);
                setFile(selectedFiles);
                setFileExist(true);
            }
        }
        else {
          console.log('파일이 선택되지 않았습니다.');
          setFileExist(false); // checkbox 선택 상태로 변경
        }
    };

    const onClickSignOutButton = () => {
        cookies.remove('accessToken');
        alert('로그아웃이 완료되었습니다.');
        goToHome();
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
                { cookies.get('accessToken') ? (
                        <div className="upperLoginAndSignOutWrap">
                            <div className="upperInfoWrap123">
                                <button className="upperLogin1" onClick={goToInfo}>Info</button> 
                            </div>
                            <div className="upperSignOutWrap">
                                <button className="upperLogin1" onClick={onClickSignOutButton}>Logout</button> 
                            </div>
                        </div>
                    ) : (
                        <div className="upperLoginWrap">
                            <button className="upperLogin123" onClick={goToLogin}>Login</button>
                        </div>
                )}
            </div>

            <div className="contentWrap123">
                <div className = "BulletinBoardWritingUpper">
                    <div className="BulletinBoardWritingUpperLeft">
                        <div className="BulletinBoardTitle123">자유 게시판</div>
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
                                accept="image/*"
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