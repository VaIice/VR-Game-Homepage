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

    useEffect(() => {    
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/${bno.bno}/withImages`);
                const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bno.bno}`
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
                console.log(responseComment.data);
            } catch (error) {
                alert('해당 게시글은 관리자와 작성자만 확인가능합니다.');
                goToFreeBulletinBoard();
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
                    console.log(response);
                } catch (error) {
                    alert('Error remove data: 삭제 실패', error);
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
                    console.log('RESPONSE :', response);
                    console.log('bnum :', bnum);
                    console.log('url : ', `${process.env.REACT_APP_SERVER_URL}/boards/remove/FREE/${bnum}`)
                    goToFreeBulletinBoard();
                } catch (error) {
                    alert('관리자와 해당 글의 작성자만 게시글을 삭제할 수 있습니다.', error);
                }
            }
        });
    };

    const [comment, setComment] = useState('');

    const handleComment = (e) => {
        const newComment = e.target.value;
        setComment(newComment);
        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight + 'px';
    };

    const onClickCommentEnrollButton = async () => {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/register`, {bno: bnum, replyText: comment}, {
            headers: {
                'Authorization': `Bearer ${cookies.get('accessToken')}`}
        });
        console.log(response);
    }

    const textarea = useRef();

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
                                    <button className="BulletinBoardPagePostCommentListModify">
                                        수정
                                    </button>
                                    <button className="BulletinBoardPagePostCommentListRemove" onClick={() => onClickCommentRemoveButton(postsComment.rno)}>
                                        삭제
                                    </button>
                                </div>
                                <div className="BulletinBoardPagePostCommentListReplyText">{postComment.replyText}</div>
                        </div>
                    ))
                    ) : (
                    <div>Loading...</div>
                    )}
                </div>
            );
        }
    };

    const [page, setPage] = useState(1);

    const handlePage = async (page) => {
        const SERVER_URL_COMMENT_PAGE = `${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bnum}?page=${page}`;
        console.log(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/2`);
        const fetchData = async () => {
            const response = await axios.get(SERVER_URL_COMMENT_PAGE);
            setPostsComment(response.data);
            setPostsCommentLoaded(true);
            console.log(response.data);
        };
        fetchData();
        setPage(page);
        console.log(page);
    }

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
                </div>
                <div className="BulletinBoardLongLineUpper"/>
                <div className = "BulletinBoardWritingMiddle">
                    <div className = "BulletinBoardPageTitleWrap">
                        <div className="BulletinBoardPageTitle">{title}</div>
                        <div className="BulletinBoardPageUser">{writer}</div>
                        <div className="BulletinBoardPageDate">{regDate[0]}-{regDate[1]}-{regDate[2]} {regDate[3]}:{regDate[4]}</div>
                    </div>
                    <div className="BulletinBoardShortLine"/>
                    <div className = "BulletinBoardPageContentsWrap">
                        <div className="BulletinBoardPageContents">
                            {content}
                        </div>
                        <div className="BulletinBoardPageContentsBottom">
                            <button className="BulletinBoardPageModifyButton">
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
                            <button className='BulletinBoardPageCommentButton' onClick={onClickCommentEnrollButton}>등록</button>
                        </div>
                    </div>
                    <div className="BulletinBoardShortLine"/>
                    <div className = "BulletinBoardWritingCommentWrap">
                        <PostComments postComments={postsComment}></PostComments>
                    </div>
                    <div className="BulletinBoardPageCommentDesignWrap">
                        <Pagination className="BulletinBoardPageCommentDesign"
                            activePage={postsComment.page}
                            itemsCountPerPage={postsComment.size}
                            totalItemsCount={postsComment.total}
                            pageRangeDisplayed={10}
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={handlePage}
                        />
                    </div>
                </div>
            </div>
        </div>
    )}