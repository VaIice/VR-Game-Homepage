import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Swal from "sweetalert2";
import {FreeBulletinBoardList} from "./FreeBulletinBoard";

const cookies = new Cookies()

export default function FreeBulletinBoardPage(bno) {
    const navigate = useNavigate();

    const [postsCommentLoaded, setPostsCommentLoaded] = useState(false);

    const [postsComment, setPostsComment] = useState([]);

    useEffect(() => {    
        const fetchData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/${bno.bno}/withImages`,
             {
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`,
                }
            }
            );
            const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bno.bno}`,
            {
               headers: {
                   'Authorization': `Bearer ${cookies.get('accessToken')}`,
               }
           }
           );
            setTitle(response.data.title);
            setContent(response.data.content);
            setWriter(response.data.writer);
            setSecret(response.data.secret);
            setFileName(response.data.fileNames[0]);
            setBnum(response.data.bno);
            setModDate(response.data.modDate);
            setRegDate(response.data.regDate);
            setPostsComment(responseComment.data);
            setPostsCommentLoaded(true);
            console.log(123, response);
        };
        fetchData();
    }, []);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [writer, setWriter] = useState('');
    const [secret, setSecret] = useState('');
    const [fileName, setFileName] = useState([]);
    const [bnum, setBnum] = useState('');
    const [modDate, setModDate] = useState([]);
    const [regDate, setRegDate] = useState([]);

    const onClickCommentRemoveButton = (rno) => {
        Swal.fire({
            icon: "warning",
            // title: "게시글 삭제",
            text: '댓글을 삭제할까요?',
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니요",
        })
        .then(async (res) => {
            if (res.isConfirmed) {
                try {
                    const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/${rno}`, {
                        headers: {
                            'Authorization': `Bearer ${cookies.get('accessToken')}`}
                    });
                    console.log(response);
                } catch (error) {
                    alert('Error remove data: 삭제 실패', error);
                }
            }
        });
    }

    const PostsComment = ({ postsComment }) => {
        if (postsComment.total !== 0) {
            return (
                <div className='postCommentList'>
                { postsCommentLoaded ? (
                postsComment.dtoList.map((postsComment) => (
                    <div key={postsComment.rno} className='postCommentListItem'>
                    <li className='postCommentListWriter'>
                        {postsComment.replyer}
                    </li>
                    <li className='postCommentListComment'>{postsComment.replyText}</li>
                    <li>수정</li>
                    {/* <div className="postCommentsModifyRemoveSpace"/> */}
                    <li onClick={() => onClickCommentRemoveButton(postsComment.rno)}>삭제</li>
                    </div>
                ))
                ) : (
                <div></div>
                )
                }  </div>
            );
        }
    };

    const goToHome = () => {
        navigate("/");
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
    const goToFreeBulletinBoardPageWriting = () => {
        navigate("/FreeBulletinBoardPageWriting");
    }
    
    const onClickRemoveButton = async () => {
        Swal.fire({
            icon: "warning",
            // title: "게시글 삭제",
            text: '게시글을 삭제할까요?',
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니요",
        })
        .then(async (res) => {
            if (res.isConfirmed) {
                try {
                    const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/boards/remove/FREE/${bnum}`, {
                        headers: {
                            'Authorization': `Bearer ${cookies.get('accessToken')}`}
                    });
                    console.log(response);
                    goToFreeBulletinBoard();
                } catch (error) {
                    alert('Error remove data: 삭제 실패', error);
                }
            }
        });
    };

    const [comment, setComment] = useState('');

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const onClickCommentEnrollButton = async () => {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/register`, {bno: bnum, replyText: comment}, {
            headers: {
                'Authorization': `Bearer ${cookies.get('accessToken')}`}
        });
        console.log(response);
    }

    return (
        <div className="page">
            <img src="../assets/image/wallpaper.jpg" alt="background" className='wallPaper'/>
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

            <div className="bulletinLineInner"/>
            <div className="bulletinLineOuter"/>
            <div className="bulletinWord">{title}
            </div>
            <div className="userName">{writer}</div>
            <div className="date"></div>

            <div className="bulletinContents">{content}</div>
            <div className="bulletinContentsLine"/>

            {
                fileName? 
            <div>
                <img src={fileName} alt="이미지"/>
            </div> : <div></div>
            }
            <div className='bulletinModifyButton' onClick={goToFreeBulletinBoardPageWriting}>수정</div>
            <div className='bulletinModifyRemoveSpace'/>
            <div className='bulletinRemoveButton' onClick={onClickRemoveButton}>삭제</div>

            <div className="bulletinCommentsNumber">댓글</div>
            <div className="bulletinCommentsLine"/>

            <div className='bulletinCommentsRectangle'>
                <input
                    type = 'text'
                    className="bulletinCommentWord"
                    placeholder="댓글을 입력해주세요."
                    value={comment}
                    onChange={handleComment}
                />
            </div>
            <div className='bulletinCommentsRectangleLine'/>
            
            <div className="bulletinCommentsWordNumber">0 / 100</div>

            <div className="bulletinCommentsEnrollButton"/>
            <div className='bulletinCommentsEnrollText' onClick={onClickCommentEnrollButton}>등록</div>

            <PostsComment postsComment={postsComment}></PostsComment>

            <div className="commentsUserName">user123</div>
            {/* <div className="commentsUserNameDateSpace"/> */}
            <div className="commentsDate">1시간 전</div>
            <div className="commentsContent">신고합니다</div>

            <div className="bulletinCommentsBottomLine"/>
        </div>
    )
}