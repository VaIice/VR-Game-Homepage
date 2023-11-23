import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import styled from "styled-components";
import Pagination from "react-js-pagination";

const cookies = new Cookies()
const SERVER_URL_NOTICE_LIST = `${process.env.REACT_APP_SERVER_URL}/boards/NOTICE/list?page=1`;
export let secretPage = '0';

export default function NoticeBulletinBoard() {
    const navigate = useNavigate();

    const [postsLoaded, setPostsLoaded] = useState(false);

    useEffect(() => {    
        const fetchData = async () => {
            try {
                const response = await axios.get(SERVER_URL_NOTICE_LIST);
                setPosts(response.data);
                console.log(response.data);
                setPostsLoaded(true);
            } catch (error) {
                alert('Error fetching data: NoticeBulletinBoard', error);
                console.log(SERVER_URL_NOTICE_LIST);
            }
        };
        fetchData();
    }, []);

    const handlePage = async (page) => {
        const SERVER_URL_NOTICE_LIST_PAGE = `${process.env.REACT_APP_SERVER_URL}/boards/NOTICE/list?page=${page}`
        const fetchData = async () => {
            if (searchFlag === false) {
            const response = await axios.get(SERVER_URL_NOTICE_LIST_PAGE, {
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`,
                }
            });
            setPosts(response.data);
            setPostsLoaded(true);
            console.log(response.data);
        }
            else {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/NOTICE/search?type=${searchWord}&keyword=${searchKeyword}&page=${page}`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.get('accessToken')}`,
                    }
                });
                console.log(response);
                setPosts(response.data);
                setPostsLoaded(true);
                console.log(response.data);
            }
        };
        fetchData();
        setPage(page);
        console.log(page);
    }

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

    const onClickNoticeBulletinBoardPageButton = async (bno, secret) => {
        try {
            if (secret === '1') {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/NOTICE/${bno}/withImages`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.get('accessToken')}`,
                    }
                });
                console.log(`${process.env.REACT_APP_SERVER_URL}/boards/NOTICE/${bno}/withImages`);
            }
            secretPage = secret;
            navigate(`/NoticeBulletinBoardPage/${bno}`);
        } catch (error) {
            alert('해당 게시글은 관리자와 작성자만 확인가능합니다.');
        }
    }

    const goToNoticeBulletinBoardPageWriting = () => {
        if (cookies.get('accessToken') && cookies.get('refreshToken')) {
            navigate("/NoticeBulletinBoardPageWriting");
        }
        else {
            alert('로그인을 해주세요.')
            goToLogin();
        }
    }
    const [searchKeyword, setSearchKeyword] = useState('');

    const handleSearch = async (e) => {
        setSearchKeyword(e.target.value);
    }

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const onClickSearchButton = async () => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/NOTICE/search?type=${searchWord}&keyword=${searchKeyword}&page=1`);
                console.log(`${process.env.REACT_APP_SERVER_URL}/boards/NOTICE/search?type=${searchWord}&keyword=${searchKeyword}`);
                console.log(response);
                setPosts(response.data);
                setPostsLoaded(true);
                console.log(response.data);
                setPage(1);
                setSearchFlag(true);
                console.log(page);
            } catch (error) {
                alert('Error fetching data: Notice Search Button', error);
            }
        };

        fetchData();
    }

    const [searchWordKorean, setSearchWordKorean] = useState('제목');
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [searchFlag, setSearchFlag] = useState(false);

    const Posts = ({ posts }) => {
        if (posts.total !== 0) {
            return (
                <div className="postList123">
                {postsLoaded ? (
                posts.dtoList.map((post) => (
                    <div key={post.bno} className="postListItem123" onClick={() => onClickNoticeBulletinBoardPageButton(post.bno, post.secret)}>
                            {post.secret === '0' ? (
                                    <div className="postListTitle123">{post.title}</div>
                                ) : (
                                    <div className="postListTitle123">
                                        <img src="assets/image/lock.svg" alt="lock" className='lockIcon'/>
                                        비밀글입니다.
                                    </div>
                                )}
                            <div className="postListReplyCount123">
                                {post.replyCount !== 0 && `(${post.replyCount})`}
                            </div>
                            <img src="assets/image/view.svg" alt="lock" className="postListView"/>
                            <span className="postListViewNumber">1</span>
                            <div className="postListItemLine"/>
                            <div className="postListUser123">{post.writer}</div>
                            <div className="postListItemLine"/>
                            <div className="postListDate">{post.regDate[0]}-{post.regDate[1]}-{post.regDate[2]}</div>
                    </div>
                ))
                ) : (
                <div>Loading...</div>
                )}
            </div>
            );
        }
    };

    const onClickSearchDropdownButton = async () => {
        searchDropdown();
    }
    
    const [searchWord, setSearchWord] = useState('t');

    const onClickSearchWordTitle = async () => {
        searchDropdown();
        setSearchWord('t');
        setSearchWordKorean('제목');
    }

    const onClickSearchWordContent = async () => {
        searchDropdown();
        setSearchWord('c');
        setSearchWordKorean('내용');
    }

    const onClickSearchWordWriter = async () => {
        searchDropdown();
        setSearchWord('w');
        setSearchWordKorean('글쓴이');
    }

    const onClickSearchWordTitleAndContent = async () => {
        searchDropdown();
        setSearchWord('tc');
        setSearchWordKorean('제목+내용');
    }

    const searchDropdown = () => {
        setSearchDropdownVisible(!searchDropdownVisible);
    };

    const [searchDropdownVisible, setSearchDropdownVisible] = useState(false);

    const goToInfo = () => {
        navigate("/Information");
    }

    const onClickSignOutButton = () => {
        cookies.remove('accessToken');
        alert('로그아웃이 완료되었습니다.');
        window.location.reload(); // Reload the page after logging out
    }

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
                <div className = "BulletinBoardUpper">
                    <div className="BulletinBoardUpperLeft">
                        <div className="BulletinBoardTitle123">공지 게시판</div>
                    </div>
                    <div className="BulletinBoardUpperRight">
                        <div className="searchLineOuter123">
                            <div className="searchLineLeft123">
                                <div className="searchLineLeftUpper">
                                    <div className='searchWord123' >
                                        {searchWordKorean}
                                    </div>
                                    <img src={"/assets/image/dropdown.svg"} alt="dropdown" className='searchDropdownIcon123' onClick={onClickSearchDropdownButton}/>
                                </div>
                                <div className={`searchDropdownContent ${searchDropdownVisible ? 'active' : ''}`}>
                                    <li className="searchDropdownMenu" onClick={onClickSearchWordTitle}>제목</li>
                                    <li className="searchDropdownMenu" onClick={onClickSearchWordContent}>내용</li>
                                    <li className="searchDropdownMenu" onClick={onClickSearchWordWriter}>글쓴이</li>
                                    <li className="searchDropdownMenu" onClick={onClickSearchWordTitleAndContent}>제목+내용</li>
                                </div>
                            </div>
                            <div className="searchLineRight123">
                                <div className="searchLineInner123"/>
                                <input
                                    type = 'text'
                                    className="searchLineInput"
                                    placeholder="검색어를 입력해주세요."
                                    value={searchKeyword}
                                    onChange={handleSearch}
                                />
                                <img src={"/assets/image/search.svg"} alt="search" className='searchIcon123' onClick={onClickSearchButton}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="BulletinBoardLongLineUpper"/>
                <div className = "BulletinBoardMiddle">
                    <Posts posts={posts}></Posts>
                </div>
                <div className="BulletinBoardLongLineBottom"/>
                <div className = "BulletinBoardBottom">
                    <Pagination className="pagination"
                        activePage={posts.page}
                        itemsCountPerPage={posts.size}
                        totalItemsCount={posts.total}
                        pageRangeDisplayed={10}
                        prevPageText={"‹"}
                        nextPageText={"›"}
                        onChange={handlePage}
                    />
                    <button className='BulletinBoardWriteButton' onClick={goToNoticeBulletinBoardPageWriting}>글쓰기</button>  
                </div>
            </div>
        </div>
    )}