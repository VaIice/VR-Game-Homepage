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

    const handleContents = (e) => {
        setContents(e.target.value);
    }

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
        alert('취소 버튼 클릭');
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
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileExist(true);
            console.log('선택한 파일:', selectedFile.name);
        }
        else {
          console.log('파일이 선택되지 않았습니다.');
          setFileExist(false); // checkbox 선택 상태로 변경
        }
    };

    return (
        <div className="page">
        <img src="assets/image/wallpaper.jpg" alt="background" className='wallPaper'/>
            <div className="upper"/>
            <hr style={{display: 'white', marginTop: 97}}/>
            <div className="topLoginButton" onClick={goToLogin}/>
            <div className="topLogin" onClick={goToLogin}>Login</div>
            <div className="topNotice" onClick={goToNoticeBoard}>News</div>
            <div className="topGuide">Guide</div>
            <div
                className="topCommunity"
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
                >
                Community
            </div>

            <div className={`dropdownContent ${isDropdownVisible ? 'active' : ''}`}>
                <li className="dropdownMenu" onClick={goToFreeBulletinBoard}>자유 게시판</li>
                <li className="dropdownMenu" onClick={goToReportBulletinBoard}>신고 게시판</li>
            </div>

            <div className="topHome" onClick={goToHome}>Home</div>
            <div className="topHomeButton" onClick={goToHome}/>

            <div className='titleBoard'>자유 게시판</div>
            <div className="titleLine"/>

            <div>
                
                <div className="bulletinWritingFileButton" onClick={onClickImageUpload}/>
                <input
                    type="file"
                    ref={imageInput}
                    accept="image/*"
                    style={{display:'none'}}
                    onChange={onFileSelect}
                />
                <div className="bulletinWritingFileText" onClick={onClickImageUpload}>
                    이미지
                </div>

                <div>
                {fileExist && (
                    <div>
                    <img
                        src={URL.createObjectURL(file)} // 파일 미리보기를 위해 사용
                        alt="Selected"
                        style={{ maxWidth: '20%', position: 'absolute' }}
                    />
                    </div>
                )}
                </div>

                <input
                    type="checkbox"
                    className='checkboxImage'
                    checked={fileExist}
                />
            </div>

            <div className="bulletinWritingSecretButton"/>
            <div className='bulletinWritingSecretText'>비밀글</div>
            <div>
                <input
                    type="checkbox"
                    className='checkboxSecret'
                    onChange={onClickSecretButton}
                    />
            </div>

            <div className="bulletinTitleBottomLine"/>

            <div className="bulletinCommentsWritingButton"/>
            <div className='bulletinCommentsWritingText' onClick={onClickWritingButton}>글쓰기</div>

            <div className="bulletinCommentsWritingCancelButton"/>
            <div className='bulletinCommentsWritingCancelText' onClick={onClickCancelButton}>취소</div>

            
            <div className="bulletinTitleRectangle">
            <input
                type = 'text'
                className="bulletinTitleWord"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={handleTitle}
            />
            </div>
            
            <div className="bulletinSecretBottomLine"/>

            <div className="bulletinContentRectangle">
            <input
                type = 'text'
                className="bulletinContentWord"
                placeholder="내용을 입력해주세요."
                value={contents}
                onChange={handleContents}
            />
            </div>

        </div>
    )
}