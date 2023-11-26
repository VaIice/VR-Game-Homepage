import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Swal from "sweetalert2";
import { useRef } from "react";
import Pagination from "react-js-pagination";

const cookies = new Cookies()

export default function FreeBulletinBoardPage(bno) {
    const navigate = useNavigate();
    const [postsCommentLoaded, setPostsCommentLoaded] = useState(false);
    const [postsComment, setPostsComment] = useState([]);
    // 이메일, 비밀번호가 유효하다면 활성화
    const [notAllow, setNotAllow] = useState(true);
    const [notAllowModifyComment, setNotAllowModifyComment] = useState(true);

    useEffect(() => {    
        const fetchData = async () => {
            if (cookies.get('secret') === 1) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/${bno.bno}/withImages`, {
                        headers: {
                            'Authorization': `Bearer ${cookies.get('accessToken')}`,
                        }
                    });
                    const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bno.bno}`);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                    setWriter(response.data.writer);
                    setSecret(response.data.secret);
                    setFileName(response.data.fileNames);
                    setBnum(response.data.bno);
                    setModDate(response.data.modDate);
                    setRegDate(response.data.regDate);
                    setPostsComment(responseComment.data);
                    setPostsCommentLoaded(true);
                    setNotAllow(true);
                } catch (error) {
                    alert('해당 게시글은 관리자와 작성자만 확인가능합니다.');
                    goToFreeBulletinBoard();
                }
            }

            else {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/${bno.bno}/withImages`);
                    const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bno.bno}`);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                    setWriter(response.data.writer);
                    setSecret(response.data.secret);
                    setFileName(response.data.fileNames);
                    setBnum(response.data.bno);
                    setModDate(response.data.modDate);
                    setRegDate(response.data.regDate);
                    setPostsComment(responseComment.data);
                    setPostsCommentLoaded(true);
                } catch (error) {
                    alert('해당 게시글은 관리자와 작성자만 확인가능합니다.');
                    goToFreeBulletinBoard();
                }
            }
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
                    const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bno.bno}`);
                    setPostsComment(responseComment.data);
                } catch (error) {
                    alert('해당 댓글은 관리자와 작성자만 삭제 가능합니다.');
                }
            }
        });
    }

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
                    goToFreeBulletinBoard();
                } catch (error) {
                    alert('해당 게시글은 관리자와 작성자만 삭제 가능합니다.');
                }
            }
        });
    };

    const [comment, setComment] = useState('');

    const handleComment = (e) => {
        const newComment = e.target.value;
        setComment(newComment);

        if (newComment.length >= 1) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }

        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight + 'px';
    };

    const onClickCommentEnrollButton = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/register`, {bno: bnum, replyText: comment}, {
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`}
            });
            const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bno.bno}`);
            setPostsComment(responseComment.data);
            setComment('');
        }
        catch (error) {
            alert('로그인을 해주세요.');
        }
    }

    const onClickCommentModifyButton = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/${modifyCommentRno}`,
            {
                bno: bnum, replyText: modifyComment
            },
            {
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`}
            });
            const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bno.bno}`);
            setPostsComment(responseComment.data);
            setModifyCommentRno(null);
            setNotAllowModifyComment(true);
        }
        catch (error) {
            alert('댓글 수정을 실패하였습니다.');
        }
    }

    const handleModifyComment = (e) => {
        const newComments = e.target.value;
        setModifyComment(newComments);
        if (newComments.length >= 1) {
            setNotAllowModifyComment(false);
        } else {
            setNotAllowModifyComment(true);
        }
    };

    const textarea = useRef();

    const [modifyCommentRno, setModifyCommentRno] = useState(null);

    const [modifyComment, setModifyComment] = useState(null);

    const onSetModifyComment = (rno, replyer) => {
        if (decodeURIComponent(cookies.get('email')) === replyer) {
            const commentToEdit = postsComment.dtoList.find((comment) => comment.rno === rno);
            setModifyCommentRno(rno);
            setModifyComment(commentToEdit.replyText);
        }
        else {
            alert('해당 댓글은 관리자와 작성자만 수정 가능합니다.');
        }
    };

    const onClickCommentModifyCancelButton = async () => {
        setModifyCommentRno(null);
    }

    const ModifyTextArea = () => {
        const textareaRef = useRef();
        useEffect(() => {
          if (textareaRef.current) {
            const cursorPosition = modifyComment ? modifyComment.length : 0;
            textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
            textareaRef.current.focus();
          }
        }, [modifyComment]);
      
        return (
          <textarea
            ref={textareaRef}
            type="text"
            className="inputWritingComment"
            placeholder="댓글을 작성해주세요."
            value={modifyComment}
            onChange={handleModifyComment}
          />
        );
    }

    const PostComments = ({ postComments }) => {
        if (postComments.total !== 0) {
            return (
                <div className="BulletinBoardPagePostCommentList">
                    {postsCommentLoaded ? (
                    postComments.dtoList.map((postComment) => (
                        <div key={postComment.rno} className="BulletinBoardPagePostCommentListItem">
                                <div className="BulletinBoardPagePostCommentListItemUpper">
                                    <div className="BulletinBoardPagePostCommentListWriter">{postComment.replyer}</div>
                                    <div className="BulletinBoardPagePostCommentListRegDate">({postComment.regDate})</div>
                                    {modifyCommentRno === postComment.rno ? (<></>
                                    ) : (
                                        <>
                                            <button className="BulletinBoardPagePostCommentListModify" onClick={() => onSetModifyComment(postComment.rno, postComment.replyer)}>
                                                수정
                                            </button>
                                            <button className="BulletinBoardPagePostCommentListRemove" onClick={() => onClickCommentRemoveButton(postComment.rno)}>
                                                삭제
                                            </button>
                                        </>
                                    )}
                                    </div>
                                    {modifyCommentRno === postComment.rno ? (
                                    <div className="BulletinBoardWritingCommentWrap">
                                        <ModifyTextArea/>
                                        <div>
                                            <button className='BulletinBoardPageCommentModifyButton' disabled={notAllowModifyComment} onClick={onClickCommentModifyButton}>수정</button>
                                            <button className='BulletinBoardPageCommentModifyCancelButton' onClick={onClickCommentModifyCancelButton}>취소</button>
                                        </div>
                                    </div>
                                    ) : (
                                        <div className="BulletinBoardPagePostCommentListReplyText">{postComment.replyText}</div>
                                    )}
                        </div>
                    ))
                    ) : (
                    <></>
                    )}
                </div>
            );
        }
    };

    const [page, setPage] = useState(1);

    const handlePage = async (page) => {
        try {
            const SERVER_URL_COMMENT_PAGE = `${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bnum}?page=${page}`;
            const fetchData = async () => {
                const response = await axios.get(SERVER_URL_COMMENT_PAGE);
                setPostsComment(response.data);
                setPostsCommentLoaded(true);
            };
            fetchData();
            setPage(page);
        }
        catch (error) {
            alert('댓글 페이지를 불러오는데 실패하였습니다.');
        }
    }

    
    const onClickSignOutButton = () => {
        cookies.remove('accessToken');
        cookies.remove('refreshToken');
        cookies.remove('email');
        alert('로그아웃이 완료되었습니다.');
        window.location.reload(); // Reload the page after logging out
    }

    const goToInfo = () => {
        navigate("/Information");
    }

    const goToFreeBulletinBoardPageModifyWriting = () => {
        const decodedEmail = decodeURIComponent(cookies.get('email'));
        if (decodedEmail === writer && cookies.get('accessToken')) {
            navigate(`/FreeBulletinBoardPageModifyWriting/${bno.bno}`)    
        }
        else {
            alert('해당 게시글은 관리자와 작성자만 수정 가능합니다.');
        }
    }

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
                <div className = "BulletinBoardWritingUpper">
                    <div className="BulletinBoardWritingUpperLeft">
                        <div className="BulletinBoardTitle123">자유 게시판</div>
                    </div>
                </div>
                <div className="BulletinBoardLongLineUpper"/>
                <div className = "BulletinBoardWritingMiddle">
                    <div className = "BulletinBoardPageTitleWrap">
                        <div className="BulletinBoardPageTitle">{title}</div>
                        <div className="BulletinBoardPageUser">{writer}</div>
                        <div className="BulletinBoardPageDate">{regDate[0]}-{regDate[1]}-{regDate[2]} {regDate[3]}:{regDate[4]}</div>
                        {/* <div className="BulletinBoardPageDate">수정 {modDate[0]}-{modDate[1]}-{modDate[2]} {modDate[3]}:{modDate[4]}</div> */}
                    </div>
                    <div className="BulletinBoardShortLine"/>
                    <div className = "BulletinBoardPageContentsWrap">
                        {fileName.map((fileName, index) => (
                            <div>
                                <img key={index} src={fileName} className="FreeBulletinBoardPageImage" alt={`Uploaded Image ${index + 1}`} />
                            </div>
                        ))}
                        <div className="BulletinBoardPageContents">
                            {content}
                        </div>
                        <div className="BulletinBoardPageContentsBottom">
                            <button className="BulletinBoardPageModifyButton" onClick={goToFreeBulletinBoardPageModifyWriting}>
                                수정
                            </button>
                            <button className="BulletinBoardPageRemoveButton" onClick={onClickRemoveButton}>
                                삭제
                            </button>
                        </div>
                    </div>
                    <div className="BulletinBoardShortLine"/>
                </div>
                <div className = "BulletinBoardPageBottom">
                    <div className = "BulletinBoardPageCommentWrap">
                        <div className = "BulletinBoardPageComment">
                            댓글 {postsComment.total}
                        </div>
                    </div>
                    <div className="BulletinBoardShortLine"/>
                    <div className = "BulletinBoardWritingCommentWrap">
                        <textarea
                                ref={textarea}            
                                type = 'text'
                                className="inputWritingComment"
                                placeholder="댓글을 작성해주세요."
                                value={comment}
                                onChange={handleComment}
                                />
                        <div className="BulletinBoardPageCommentButtonWrap">
                            <button className='BulletinBoardPageCommentButton' disabled={notAllow} onClick={onClickCommentEnrollButton}>등록</button>
                        </div>
                    </div>
                    
                    <div className="BulletinBoardShortLine"/>
                    <div className = "BulletinBoardWritingCommentWrap">
                        <PostComments postComments={postsComment}></PostComments>
                    </div>
                    {postsComment.total !== 0 && (
                        <div className="BulletinBoardPageCommentDesignWrap">
                            <Pagination
                                className="BulletinBoardPageCommentDesign"
                                activePage={postsComment.page}
                                itemsCountPerPage={postsComment.size}
                                totalItemsCount={postsComment.total}
                                pageRangeDisplayed={10}
                                prevPageText={"‹"}
                                nextPageText={"›"}
                                onChange={handlePage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )}