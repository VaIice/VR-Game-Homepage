import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useRef } from "react";

const cookies = new Cookies()

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/boards/register`;
const SERVER_URL_IMAGE = `${process.env.REACT_APP_SERVER_URL}/boards/api/upload`;

export default function FreeBulletinBoardPageWriting() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
        console.log(1, cookies.get('refreshToken'))
        console.log(2, cookies.get('accessToken'))
    }

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
        setTitle(e.target.value);
    }

    const textarea = useRef();


    const handleContents = (e) => {
        const newContents = e.target.value;
        setContents(newContents);
        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight + 'px';
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
                dataToSendImage.bno = response.data;
                const responseImage = await axios.post(SERVER_URL_IMAGE, dataToSendImage, {
                    headers: {
                        'Authorization': `Bearer ${cookies.get('accessToken')}`,
                        'Content-Type': 'multipart/form-data', // 파일 업로드에 필요한 Content-Type
                    }
                });
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

    const dataToSendImage = {
        file: file,
        boardType: "FREE",
        bno: bno
    };
    
    const onClickImageUpload = () => {
        imageInput.current.click();
    };

    const onFileSelect = (e) => {
        if (e.target.files[0]) {
            const selectedFiles = Array.from(e.target.files);
            setFile(selectedFiles);
            setFileExist(true);
            console.log('선택한 파일:', selectedFiles.map(file => selectedFiles.name));
        }
        else {
          console.log('파일이 선택되지 않았습니다.');
          setFileExist(false); // checkbox 선택 상태로 변경
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
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt={`file-${index}`}
                                    className="BulletinBoardImage"
                                />
                            ))}
                        </div>
                    )}
                    {fileExist && (
                        <div className="BulletinBoardWritingFileBottomLine"/>
                    )}
                    <div className = "BulletinBoardWritingButtonWrap">
                        <button className='BulletinBoardWritingButton' onClick={onClickWritingButton}>글쓰기</button>  
                        <button className='BulletinBoardWritingCancelButton' onClick={onClickCancelButton}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    )}