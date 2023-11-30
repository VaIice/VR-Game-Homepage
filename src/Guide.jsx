import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Pagination from "react-js-pagination";
import Swal from "sweetalert2";

const cookies = new Cookies()
const SERVER_URL_FREE_LIST = `${process.env.REACT_APP_SERVER_URL}/boards/FREE/list?page=1`;

export default function Guide() {
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
        cookies.set('page', 1);
    }

    const goToLogin = () => {
        navigate("/Login");
    }

    const goToFreeBulletinBoard = () => {
        navigate("/FreeBulletinBoard");
        cookies.set('page', 1);
    }

    const goToReportBulletinBoard = () => {
        navigate("/ReportBulletinBoard");
        cookies.set('page', 1);
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
                        text: '홈 화면으로 이동합니다.',
                        showCancelButton: false
                    }).then(async () => {
                        goToHome();
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
                    }).then(async () => {
                        goToLogin();
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
                    }).then(async () => {
                        goToLogin();
                    });
                }
            }
        });
    }

    const goToInfo = () => {
        navigate("/Information");
    }

    const goToGuide = () => {
        navigate("/Guide");
    }

    return (
        <div className="page123">
            <img src="assets/image/background.jpg" alt="background" className='wallPaper123'/>
            <div className="upperSpace1234">
                <div className="upperHomeWrap">
                    <button class="upperHome123" onClick={goToHome}>HOME</button>
                </div>

                <div className="upperNoticeWrap">
                    <button className="upperNotice123" onClick={goToNoticeBoard}>NOTICE</button>
                </div>

                <div className="upperGuideWrap">
                    <button className="upperGuide123" onClick={goToGuide}>GUIDE</button>
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
                                <button className="upperLogin12345" onClick={goToInfo}>INFO</button> 
                            </div>
                            <div className="upperSignOutWrap">
                                <button className="upperLogin1234" onClick={onClickSignOutButton}>LOGOUT</button> 
                            </div>
                        </div>
                    ) : (
                        <div className="upperLoginWrap">
                            <button className="upperLogin123" onClick={goToLogin}>LOGIN</button>
                        </div>
                )}
            </div>

            <div className="contentWrap123">
                <div className = "GuideUpper">
                    <div className="BulletinBoardUpperLeft">
                        <div className="BulletinBoardTitle123">가이드</div>
                    </div>
                </div>
                <div className="BulletinBoardLongLineUpper"/>
                <div className = "GuideMiddle">
                    <div className = "GuideMiddleDivision">
                        <div className="GuideSubTitle">스토리</div>
                        <div className="GuideLine"/>
                        <div className="GuideStory">
<br/> 1편 [서막의 시작] <br/>
<br />퀘이사 왕조 31년 7월 23일 [800~1200년 사이 중세] <br/>
나는 21살 농사를 지으며 혼자 살아가는 농부이다.<br/>
원래는 부모님과 함께 살았지만, 6살 즈음에 알 수 없는 이유로 부모님을 잃게 되었다.<br/>
마을 사람들은 부모님이 산책을 하러 마을 밖으로 나가 다시 돌아오지 않아서 그대로 사라졌다고 말하며, 곧 돌아올 것이라 믿으라고 얘기했다.<br/>
마을 사람들의 이야기로는 부모님이 산책을 하러 마을 밖으로 나간 후 마을로 돌아오지 않고 그대로 사라졌다고 곧 돌아 올거라고 믿으라는 말을 들었다.<br/>
그러나 아직까지 부모님은 돌아오지 않으셨다.<br/><br/>

내가 심은 작물들이 잘 자라는지 살펴보던 중 하늘이 매우 검은 구름으로 덮이기 시작했다.<br/>
얼마나 검은지 낮임에도 불구하고 밤보다 더 어두워서 횃불을 들고 다녀야 할 정도였다.<br/>
이런 검은 색깔의 구름은 생애 처음이었으며 약간의 불길함을 느끼고 있었지만, 내 걱정은 딱 거기까지였다.<br/>
검은 구름이 몰려오자 마을 사람들은 구름이 물을 많이 내뿜어 올해 농사를 망칠까 두려워 밭에서 물이 빠져 강으로 흘러나가게끔 길을 만들고 있었다.<br/>
또한, 1년 중 이 시기쯤에는 항상 거무틱틱한 구름이 때로 몰려와 하늘에서 물이 폭포 마냥 떨어지곤 했기에, 항상 나와 마을 사람들은 밭에 씨를 뿌리면서 하늘의 신에게 이번 해에는 슬프지 않고 좋은 일만 있기를 빌곤 하였다.<br/><br/>

하지만 모두가 걱정한 대로 엄청난 비가 내리기 시작했다.<br/>
마을 사람들은 서로 소리치고 분주해졌고, 나도 내 밭에 물이 점점 차오르는 것을 보고 마음이 급해졌다.<br/>
농사가 망하면 더 이상 비축한 돈이나 식량이 없어 굶어 죽을 것이기 때문에 손은 찢어져 피가 나도록 아프게 느껴지고, 팔에는 감각이 사라지고, 힘이 빠지면서도 내 온몸을 사용해 땅을 팠다.<br/><br/>

하늘의 신이 화났을 때는 구름이 번개가 아니라 큰 소리와 흰색 빛을 내뿜는다.<br/>
마을 사람들의 이야기로는 그 빛을 직면으로 받아들인 사람이 있는데, 1초도 안 되어서 몸에 검은 줄기가 생기고 탄 냄새가 났으며, 그 상태로 생을 마감했다고 전해졌다.<br/>
참 착한 사람인데 어떻게 하늘의 신의 분노를 받게 되어 그런 형벌을 받았는지는 알 수 없는 노릇이라고 했다.<br/>
이번에는 하늘의 신이 얼마나 화가 났는지 귀 안쪽이 찢어질 듯한 소리를 지르며 흰색 광채를 내뿜었다.<br/>
땅을 파다가 삽자루가 부러져 새 것으로 교체하려고 집 문고리를 잡으려는 순간이었다.<br/>

갑자기 강력한 붉은 번개가 내 집을 내리쳤고, 너무나도 큰 소리에 나는 다리에 힘이 풀린 채 무릎에 상처가 나도록 털썩 주저앉아 아무 생각도, 아무 소리도 들을 수 없는 상태로 몇 초간 앉아 있었다.<br/>
넋이 나가있을 때, 내 뒷통수를 세게 후려치며 나를 깨워준 사람은 내 친구인 쿨르였다.<br/>
쿨르가 손으로 내 집을 가리키며 나에게 말을 하는데, 자그마하게 들려 무슨 말을 하는지는 정확히 알 수 없었다.<br/><br/>

내 집은 나무 기둥에 흙으로 벽을 만들고 나무로 만든 지붕의 집이다.<br/>
그런데 이게 무슨 일인가? 내 집이 완전히 까맣게 변해버렸다.<br/>
마치 새까만 그림을 보는 듯한 느낌이었다.<br/>
원래 집이라 하면 앞과 옆 그리고 뒤가 있지 않은가?<br/>
하지만 내 집은 각 면을 구분하기 힘들 정도로 새까맣게 변해버렸다.<br/>
나는 너무 놀란 나머지, 세상에 이런 일이 일어날 수 있는 것인지 생각했다.<br/>
처음에는 내 집이 불에 탄 것인 줄 알았다.<br/>
하지만 불에 탔다고 이 정도의 색이 될 순 없다.<br/>
이 정도의 검은 색은 마치 공허하게 느껴졌다.<br/>
손으로 만져보니 나무와 흙으로 만든 벽의 질감이라곤, 탄 나무와 탄 도자기의 질감이라곤 생각할 수 없었다.<br/><br/>

내 집도 문제이지만, 당장 더 큰 문제가 있다.<br/>
바로 내 농작물이다.<br/>
얼른 삽을 바꿔가야 한다.<br/>
하지만 집의 문고리를 아무리 잡아당겨도 열리지 않는 것이 아닌가?<br/>
내 마음은 너무 급해졌고 부러진 삽으로 힘껏 내 집을 내리쳤지만, 누군가 나를 밀치는 느낌에 나뒹굴어 떨어졌다.<br/>
이 상황에 쿨르는 나에게 지금 무엇을 하고 있냐며 빨리 삽을 바꾸고 오라고 소리쳤다.<br/>
나도 서둘러 행동하고 싶은데, 뜻대로 안 되는 것을 어쩌라는 말인가?<br/><br/>

그런데 붉은 번개가 치자 금세 먹구름이 걷혀 비도 그치기 시작했다.<br/>
어찌 이럴수가 있는가.<br/>
나는 부모 없이도 한 평생을 남의 것을 훔치거나 갈취하지 않고 착하게 살아왔다.<br/>
하지만 어떻게 내가 하늘의 신의 분노의 대상이 된 것인가?<br/>
부모 없이 자랐기에 억울한 일도 많은데 혹시나 하늘의 신이 나를 오해한 것이 아닌가? 생각하였다.<br/>
붉은 번개가 내 집을 강하게 친 모습을 본 마을 사람들은 하늘의 신의 원흉이 마치 나를 향한 것이라 생각하는 것 같았다.<br/>
이로 인해 나를 향한 태도가 전보다 확연히 달라진 것을 느꼈다.<br/>
내가 얼마나 착하게 살아왔고, 이 마을 사람들을 도우면서 얼마나 많은 선행을 했는데, 이런 상황에서 분노와 배신감이 내 마음을 가득 채우고 있었다.<br/>
그 순간, 집 주변에서 흩어지는 검은 연기를 보며 나는 문득 어릴 적 들었던 이야기가 떠올랐다.<br/><br/>

그 이야기 제목은 '검은 행성'이라는 이야기였다.<br/>
검은 행성은 세상의 불리함이 있는 곳에 검은 기운이 생겨나 모든 것을 삼켜 없애 평등하게 만든다는 이야기이다.<br/>
그래서 내가 잘못된 행동을 할 때면 검은 악마가 나를 삼킨다고 겁을 주곤 했다.<br/>
검은 구름이 몰려와 붉은 번개를 내리치고, 검은 연기를 내뿜고 있는 나의 집 그리고 항상 검은 행성 이야기를 들려주었던, 어느날 사라지신 나의 부모님.<br/>
나는 부모님이 갑자기 사라지게된 이유가 지금 이 상황과 관련이 있을거라고 생각하였다.<br/><br/>

마을 사람들은 나를 버려둔 채, 검은 연기를 내뿜는 내 집에 대한 대책을 논의하기 위해 가장들을 모으기로 했다.<br/>
나는 마음 속의 배신감과 더불어 튕겨져 나간 삽을 주워 들려는 찰나, 문이 갑자기 활짝 열리며 쾅 하는 소리가 울렸다.<br/>
문이 열린 순간, 태풍 같은 바람이 내 앞으로 쏟아져 나를 한 번 더 날렸다.<br/>
그러나 문이 열렸음에도 불구하고 내 집 안은 무언가에 가려져 있는 듯 어둠으로 가득 차 어떠한 것도 볼 수 없었다.<br/>
그 순간 손가락을 문에 가볍게 대자, 연기처럼 사라지고 손가락이 문 안쪽으로 들어갔다.<br/>
이 집은 나의 집이며, 나의 소중한 것들이 담겨 있는 곳이다.<br/>
나의 소장의 돈, 부모님의 물건, 그리고 1년 전 병으로 세상을 떠난 아내의 편지와 반지가 그 안에 있었기 때문에 나는 이 집 안으로 들어가야만 했다.<br/><br/>

나를 제외한 마을 사람들은 모두 가족을 가진 채, 안정되고 행복한 삶을 살아가고 있었다.<br/>
이런 불공평함이 참으로 억울하게 다가왔다.<br/>
왜 나는 어린 시절 가족을 잃고, 사랑하는 아내를 잃었으며, 항상 이렇게 불행한 일들을 겪어야 하는 걸까?<br/>
부모님과 아내가 사라진 이유, 그리고 내가 겪어온 불평등한 세상에 대한 의문이 머릿속을 지나갔다.<br/>
혹시 지금의 이 상황과 관련이 있는 것은 아닐까?<br/><br/>

그 순간, 집 주변의 검은 연기가 더욱 짙어지는 듯한 기분이 들었다.<br/>
열린 문을 향해 걸어가려 했지만, 친구와 마을 사람들이 나를 불러 세우며 말렸다.<br/>
쿨르는 마을 사람들의 회의가 끝날 때까지 기다리라고 조언했다.<br/>
쿨르는 나를 가장 소중한 친구로 여기며 나를 악마로 여기지 않는 유일한 존재였다.<br/>
하지만 나는 쿨르의 제안을 거절하였다.<br/>
검게 타버린 집이 나를 강력하게 끌어당기는 듯한 느낌이 들었기 때문이다.<br/><br/>

나와 쿨르의 이야기를 듣던 사람들은 내가 얼른 집에 들어가 무슨 일이 생긴 건지 알아보기를 원하는 눈빛이었다.<br/>
내가 기어이 들어가려 하자, 쿨르는 나에게 칼날이 손바닥만한 크기이지만, 매우 예리한 검과 횃불을 주었다.<br/>
그리고 혹시 모를 위험한 상황이 닥쳤을 때, 내가 소리를 치면 자신이 칼 두 자루를 들고 달려와 나를 도와줄 것이라고 하였다.<br/>
난 쿨르가 준 횃불과 검을 들고 검은 집 안에 한 발자국 내딛었다.<br/><br/>
                        </div>
                        <div className="GuideLine"/>
                    </div>
                    {/* <div className = "GuideMiddleDivision">
                        <div className="GuideSubTitle">조작 방법</div>
                        <div className="GuideLine"/>
                    </div>
                    <div className = "GuideMiddleDivision">
                        <div className="GuideSubTitle">시작 화면</div>
                        <div className="GuideLine"/>
                    </div> */}
                </div>
                <div className="BulletinBoardLongLineBottom"/>
                <div className = "BulletinBoardBottom">
                </div>
            </div>
        </div>
    )}