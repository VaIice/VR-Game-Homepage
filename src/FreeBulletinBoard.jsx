import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import styled from "styled-components";
import Pagination from "react-js-pagination";

const cookies = new Cookies()
const SERVER_URL_FREE_LIST = `${process.env.REACT_APP_SERVER_URL}/boards/FREE/list?page=1`;

export default function FreeBulletinBoard() {
    const navigate = useNavigate();

    const [postsLoaded, setPostsLoaded] = useState(false);

    useEffect(() => {    
        const fetchData = async () => {
            try {
                const response = await axios.get(SERVER_URL_FREE_LIST);
                setPosts(response.data);
                console.log(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/list?page=1`);
                setPostsLoaded(true);
            } catch (error) {
                alert('Error fetching data: FreeBulletinBoard', error);
                console.log(SERVER_URL_FREE_LIST);
            }
        };
        fetchData();
    }, []);

    const handlePage = async (page) => {
        const SERVER_URL_FREE_LIST_PAGE = `${process.env.REACT_APP_SERVER_URL}/boards/FREE/list?page=${page}`
        const fetchData = async () => {
            if (searchFlag === false) {
            const response = await axios.get(SERVER_URL_FREE_LIST_PAGE, {
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`,
                }
            });
            setPosts(response.data);
            setPostsLoaded(true);
            console.log(response.data);
        }
            else {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/search?type=${searchWord}&keyword=${searchKeyword}&page=${page}`, {
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

    const goToFreeBulletinBoardPage = (bno) => {
        navigate(`/FreeBulletinBoardPage/${bno}`);
    }

    const goToFreeBulletinBoardPageWriting = () => {
        // if (cookies.get('accessToken') && cookies.get('refreshToken')) {
        //     navigate("/FreeBulletinBoardPageWriting");
        // }
        // else {
        //     alert('로그인을 해주세요.')
        //     goToLogin();
        // }
        navigate("/FreeBulletinBoardPageWriting");
        console.log(cookies.get('accessToken')&&cookies.get('refreshToken'));
        console.log('cookies :', cookies.get('accessToken'));
        console.log('refresh: ', cookies.get('refreshToken'));
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
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/search?type=${searchWord}&keyword=${searchKeyword}&page=1`);
                console.log(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/search?type=${searchWord}&keyword=${searchKeyword}`);
                console.log(response);
                setPosts(response.data);
                setPostsLoaded(true);
                console.log(response.data);
                setPage(1);
                setSearchFlag(true);
                console.log(page);
            } catch (error) {
                alert('Error fetching data: Free Search Button', error);
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
                    <div key={post.bno} className="postListItem123" onClick={() => goToFreeBulletinBoardPage(post.bno)}>
                            <div className="postListTitle123">
                                {post.title}
                            </div>
                            <div className="postListUser123">{post.writer}</div>
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

    const searchDropdown = () => {
        setSearchDropdownVisible(!searchDropdownVisible);
    };

    const [searchDropdownVisible, setSearchDropdownVisible] = useState(false);



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
                <div className = "BulletinBoardUpper">
                    <div className="BulletinBoardUpperLeft">
                        <div className="BulletinBoardTitle123">자유 게시판</div>
                    </div>
                    <div className="BulletinBoardUpperRight">
                        <div className="searchLineOuter123">
                            <div className="searchLineLeft123">
                                <div className='searchWord123' >
                                    {searchWordKorean}
                                </div>
                                <div>
                                    <img src={"/assets/image/dropdown.svg"} alt="dropdown" className='searchDropdownIcon123' onClick={onClickSearchDropdownButton}/>
                                </div>
                                <div className="searchLineInner123"/>
                            </div>
                            <div className="searchLineRight123">
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
{/* 
                    <div className={`searchDropdownContent ${searchDropdownVisible ? 'active' : ''}`}>
                        <li className="searchDropdownMenu" onClick={onClickSearchWordTitle}>제목</li>
                        <li className="searchDropdownMenu" onClick={onClickSearchWordContent}>내용</li>
                        <li className="searchDropdownMenu" onClick={onClickSearchWordWriter}>글쓴이</li>
                    </div> */}
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
                    <button className='BulletinBoardWriteButton' onClick={goToFreeBulletinBoardPageWriting}>글쓰기</button>  
                </div>
            </div>
        </div>
    )}