import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Pagination from "react-js-pagination";
import Swal from "sweetalert2";

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
                setPostsLoaded(true);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: '게시글 목록을 불러오는데 실패하였습니다.',
                    showCancelButton: false
                });
            }
        };
        fetchData();
    }, []);

    const handlePage = async (page) => {
        const SERVER_URL_FREE_LIST_PAGE = `${process.env.REACT_APP_SERVER_URL}/boards/FREE/list?page=${page}`
        const fetchData = async () => {
            try {
                if (searchFlag === false) {
                    const response = await axios.get(SERVER_URL_FREE_LIST_PAGE, {
                        headers: {
                            'Authorization': `Bearer ${cookies.get('accessToken')}`,
                        }
                    });
                    setPosts(response.data);
                    setPostsLoaded(true);
                }
                else {
                        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/search?type=${searchWord}&keyword=${searchKeyword}&page=${page}`, {
                            headers: {
                                'Authorization': `Bearer ${cookies.get('accessToken')}`,
                            }
                        });
                        setPosts(response.data);
                        setPostsLoaded(true);
                    }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: '게시글 목록을 불러오는데 실패하였습니다.',
                    showCancelButton: false
                });
            }
        };
        fetchData();
        setPage(page);
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

    const onClickFreeBulletinBoardPageButton = async (bno, secret) => {
        try {
            if (secret === 0) {
                navigate(`/FreeBulletinBoardPage/${bno}`);
            }
            else {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/${bno}/withImages`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.get('accessToken')}`,
                    }
                });
                navigate(`/FreeBulletinBoardPage/${bno}`);
            }
            cookies.set('secret', secret, { maxAge: 60*60*24});
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: '해당 게시글은 관리자와 작성자만 확인가능합니다.',
                showCancelButton: false
            });
        }
    }

    const goToFreeBulletinBoardPageWriting = () => {
        if (cookies.get('accessToken') && cookies.get('refreshToken')) {
            navigate("/FreeBulletinBoardPageWriting");
        }
        else {
            Swal.fire({
                icon: "info",
                title: '로그인을 해주세요.',
                showCancelButton: false
            });
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
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/search?type=${searchWord}&keyword=${searchKeyword}&page=1`);
                setPosts(response.data);
                setPostsLoaded(true);
                setPage(1);
                setSearchFlag(true);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: '게시글 검색을 실패하였습니다.',
                    showCancelButton: false
                });
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
                    <div key={post.bno} className="postListItem123" onClick={() => onClickFreeBulletinBoardPageButton(post.bno, post.secret)}>
                            {post.secret === 0 ? (
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
                            {/* <img src="assets/image/view.svg" alt="lock" className="postListView"/>
                            <span className="postListViewNumber">1</span>
                            <div className="postListItemLine"/> */}
                            <div className="postListUser123">{post.writer}</div>
                            <div className="postListItemLine"/>
                            <div className="postListDate">{post.regDate[0]}-{post.regDate[1]}-{post.regDate[2]}</div>
                    </div>
                ))
                ) : (
                <></>
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
                        // text: '홈 화면으로 이동합니다.',
                        showCancelButton: false
                    }).then(async () => {
                        window.location.reload(); // Reload the page after logging out
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
                    });
                }
            }
        });
    }

    const goToInfo = () => {
        navigate("/Information");
    }

    return (
        <div className="page123">
            <img src="assets/image/background.jpg" alt="background" className='wallPaper123'/>
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
                <div className = "BulletinBoardUpper">
                    <div className="BulletinBoardUpperLeft">
                        <div className="BulletinBoardTitle123">자유 게시판</div>
                    </div>
                    <div className="BulletinBoardUpperRight">
                        <div className="searchLineOuter123">
                            <div className="searchLineLeft123">
                                <div className="searchLineLeftUpper">
                                    <div className='searchWord123' >
                                        {searchWordKorean}
                                    </div>
                                    <div>
                                        <img src={"/assets/image/dropdown.svg"} alt="dropdown" className='searchDropdownIcon123' onClick={onClickSearchDropdownButton}/>
                                    </div>
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
                        pageRangeDisplayed={5}
                        prevPageText={"‹"}
                        nextPageText={"›"}
                        onChange={handlePage}
                    />
                    <button className='BulletinBoardWriteButton' onClick={goToFreeBulletinBoardPageWriting}>글쓰기</button>  
                </div>
            </div>
        </div>
    )}