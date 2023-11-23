import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useRef } from "react";
import { secretPage, pageNumber } from './FreeBulletinBoard';

const cookies = new Cookies()

export default function FreeBulletinBoardPageModifyWriting(bnum) {
    // 사용자가 적고 있는 이메일 
    const [title, setTitle] = useState('');
    // // 사용자가 적고 있는 비밀번호
    const [contents, setContents] = useState('');
    // 이메일이 유효한 형식인지 확인
    const [titleValid, setTitleValid] = useState(true);
    // 핸드폰 번호가 유효한 형식인지 확인
    const [contentsValid, setContentsValid] = useState(true);
    const [flag, setFlag] = useState(false);
    const [imageFlag, setImageFlag] = useState(false);
    const [notAllow, setNotAllow] = useState(true);
    useEffect(() => { 
        const fetchData = async () => {
            if (secretPage === '0') {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/${bnum.bno}/withImages`);
                    console.log(response);
                    setTitle(response.data.title);
                    setContents(response.data.content);
                    setNotAllow(true);
                    setFlag(false);
                    setFile(response.data.fileNames);
                    setNotAllow(true);
                    if (response.data.fileNames[0]) {
                        setFileExist(true);
                        setImageFlag(true);
                    }
                    else {
                        setFileExist(false);
                        setImageFlag(false);
                    }
                    (response.data.secret === '0' ? setSecret(false) : setSecret(true));
                } catch (error) {
                    alert('해당 게시글은 관리자와 작성자만 확인가능합니다.');
                    goToFreeBulletinBoard();
                }
            }
            else {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/${bnum.bno}/withImages`, {
                        headers: {
                            'Authorization': `Bearer ${cookies.get('accessToken')}`,
                        }
                    });
                    setTitle(response.data.title);
                    setContents(response.data.content);
                    setSecret(response.data.secret);
                    setNotAllow(true);
                    setFlag(false);
                    setFile(response.data.fileNames);
                    setNotAllow(true);
                    if (response.data.fileNames[0]) {
                        setFileExist(true);
                        setImageFlag(true);
                    }
                    else {
                        setFileExist(false);
                        setImageFlag(false);
                    }
                } catch (error) {
                    alert('해당 게시글은 관리자와 작성자만 확인가능합니다.');
                    goToFreeBulletinBoard();
                }
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (titleValid && contentsValid && flag === true) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }

    }, [titleValid, contentsValid, title, contents, flag]);

    const [secret, setSecret] = useState(false);

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

    const handleTitle = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setFlag(true);
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
        setFlag(true);
        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight + 'px';
        if (newContents.length >= 1) {
            setContentsValid(true);
        }
        else {
            setContentsValid(false);
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
        if (secret===true) {
            setSecret(false);
            console.log('공개 전환');
        }
        else {
            setSecret(true);
            console.log('비공개 전환');
        }
        console.log(secret);
        setFlag(true);
    }

    const onClickWritingButton = async () => {
        const fetchData = async () => {
        try {
            if (secret === true) {
                dataToSend.secret = '1';
            }
            else {
                dataToSend.secret = '0';
            }
            console.log(dataToSend);
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/boards/modify/FREE/${bnum.bno}`, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(bnum.bno);
            if (fileExist && !imageFlag) {
                console.log(file[0]);
                for (let i = 0; i < file.length; i++) {
                    // `${process.env.REACT_APP_SERVER_URL}/boards/api/edit/${bnum.bno}`
                    const responseImage = await axios.post(`${process.env.REACT_APP_SERVER_URL}/boards/api/upload`, 
                        {
                            file: file[i],
                            boardType: "FREE",
                            bno: bnum.bno
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${cookies.get('accessToken')}`,
                                'Content-Type': 'multipart/form-data'
                            }
                    });
                }
            }
            console.log('게시글이 수정되었습니다.')
            navigate(`/FreeBulletinBoardPage/${bnum.bno}`);
            console.log(response);
        } catch (error) {
            alert('Error fetching data: Free Writing Button', error);
        }
        };

        fetchData();
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
        bno: bnum.bno
    };
    
    const onClickImageUpload = () => {
        imageInput.current.click();
    };

    const onFileSelect = (e) => {
        setImageFlag(false);
        setFlag(true);
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
        if (imageFlag) {
            const fetchData = async () => {
                try {
                    const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/boards/api/delete/${bnum.bno}`, {
                        headers: {
                            'Authorization': `Bearer ${cookies.get('accessToken')}`,
                        }
                    });
                } catch (error) {
                    alert('Error fetching data: Free Writing Button', error);
                }
            };

            fetchData();
        }
        const updatedFiles = [...file];
        updatedFiles.splice(index, 1);
        setFile(updatedFiles);
        setFlag(true);
        if (!updatedFiles[0]) {
            setFileExist(false);
        }
      };

    return (
        <div className="page12345">
            <img src="/assets/image/555.png" alt="background" className='wallPaper123'/>
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
                                checked={secret}
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
                    {imageFlag && fileExist && (
                        <div className = "BulletinBoardWritingImage">
                            {file.map((file, index) => (
                                <div key={index} className="ImageContainer">
                                    <img
                                        key={index}
                                        src={file}
                                        alt={`file-${index}`}
                                        className="BulletinBoardImage"
                                    />                                    
                                    <img src="/assets/image/trash1.svg" className="trashImage" onClick={() => handleDeleteImage(index)}/>
                                </div>
                            ))}
                        </div>
                    )}
                    {!imageFlag && fileExist && (
                        <div className = "BulletinBoardWritingImage">
                            {file.map((file, index) => (
                                <div key={index} className="ImageContainer">
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt={`file-${index}`}
                                    className="BulletinBoardImage"
                                />                                    
                                    <img src="/assets/image/trash1.svg" className="trashImage" onClick={() => handleDeleteImage(index)}/>
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