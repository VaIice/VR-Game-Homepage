import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import styled from "styled-components";
import Pagination from "react-js-pagination";

export let FreeBulletinBoardList = [];

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
                FreeBulletinBoardList = response.data;
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
            FreeBulletinBoardList = response.data;
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
                FreeBulletinBoardList = response.data;
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
                FreeBulletinBoardList = response.data;
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
                <div className="postList">
                {postsLoaded ? (
                posts.dtoList.map((post) => (
                    <div key={post.bno} className="postListItem">
                    <li className="postListTitle" onClick={() => goToFreeBulletinBoardPage(post.bno)}>
                        {post.title}
                    </li>
                    <li className="postListUser">{post.writer}</li>
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

            <div className='searchWord' >
                {searchWordKorean}
            </div>

            <div className="searchLineInner"/>
            <div className="searchLineOuter">
                <input
                    type = 'text'
                    className="inputSearch"
                    placeholder="검색어를 입력해주세요."
                    value={searchKeyword}
                    onChange={handleSearch}
                />
            </div>


            <div>
                <img src={"/assets/image/dropdown.svg"} alt="dropdown" className='dropdownIcon' onClick={onClickSearchDropdownButton}/>
            </div>

            <div className={`searchDropdownContent ${searchDropdownVisible ? 'active' : ''}`}>
                <li className="searchDropdownMenu" onClick={onClickSearchWordTitle}>제목</li>
                <li className="searchDropdownMenu" onClick={onClickSearchWordContent}>내용</li>
                <li className="searchDropdownMenu" onClick={onClickSearchWordWriter}>글쓴이</li>
            </div>
            
            <div>
                <img src={"/assets/image/search.svg"} alt="search" className='searchIcon' onClick={onClickSearchButton}/>
            </div>

            {/* <div className="bulletinLineInner"/> */}
            {/* <div className="bulletinWord" onClick={goToFreeBulletinBoardPage}>신고합니다</div> */}
            {/* <div className="commentsNumber">(1)</div> */}
            {/* <div className="userName">user123</div>
            <div className="date">1시간 전</div> */}
            <div className='BottomLine'/>

            {/* <div className="pageNumber">1</div> */}
            <div className="writeButton" onClick={goToFreeBulletinBoardPageWriting}/>
            <div className='writeWord' onClick={goToFreeBulletinBoardPageWriting}>글쓰기</div>
            {/* <Posts posts={posts}></Posts> */}
            <Pagination className="pagination"
                activePage={posts.page}
                itemsCountPerPage={posts.size}
                totalItemsCount={posts.total}
                pageRangeDisplayed={10}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={handlePage}

            />
        </div>
    )
}