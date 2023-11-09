// import React, { useEffect, useState } from 'react'
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import { Cookies } from 'react-cookie';
// import Swal from "sweetalert2";

// const cookies = new Cookies()

// export default function FreeBulletinBoardPage(bno) {
//     const navigate = useNavigate();

//     const [postsCommentLoaded, setPostsCommentLoaded] = useState(false);

//     const [postsComment, setPostsComment] = useState([]);

//     useEffect(() => {    
//         const fetchData = async () => {
//             const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards/FREE/${bno.bno}/withImages`
//             );
//             const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/list/${bno.bno}`
//            );
//             setTitle(response.data.title);
//             setContent(response.data.content);
//             setWriter(response.data.writer);
//             setSecret(response.data.secret);
//             setFileName(response.data.fileNames[0]);
//             setBnum(response.data.bno);
//             setModDate(response.data.modDate);
//             setRegDate(response.data.regDate);
//             setPostsComment(responseComment.data);
//             setPostsCommentLoaded(true);
//             console.log(123, responseComment);
//         };
//         fetchData();
//     }, []);

//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [writer, setWriter] = useState('');
//     const [secret, setSecret] = useState('');
//     const [fileName, setFileName] = useState([]);
//     const [bnum, setBnum] = useState('');
//     const [modDate, setModDate] = useState([]);
//     const [regDate, setRegDate] = useState([]);

//     const onClickCommentRemoveButton = (rno) => {
//         Swal.fire({
//             icon: "warning",
//             // title: "게시글 삭제",
//             text: '댓글을 삭제할까요?',
//             showCancelButton: true,
//             confirmButtonText: "예",
//             cancelButtonText: "아니요",
//         })
//         .then(async (res) => {
//             if (res.isConfirmed) {
//                 try {
//                     const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/${rno}`, {
//                         headers: {
//                             'Authorization': `Bearer ${cookies.get('accessToken')}`}
//                     });
//                     console.log(response);
//                 } catch (error) {
//                     alert('Error remove data: 삭제 실패', error);
//                 }
//             }
//         });
//     }

//     const PostsComment = ({ postsComment }) => {
//         if (postsComment.total !== 0) {
//             return (
//                 <div className='postCommentList'>
//                 { postsCommentLoaded ? (
//                 postsComment.dtoList.map((postsComment) => (
//                     <div key={postsComment.rno} className='postCommentListItem'>
//                     <li className='postCommentListWriter'>
//                         {postsComment.replyer}
//                     </li>
//                     <li className='postCommentListComment'>{postsComment.replyText}</li>
//                     <li>수정</li>
//                     {/* <div className="postCommentsModifyRemoveSpace"/> */}
//                     <li onClick={() => onClickCommentRemoveButton(postsComment.rno)}>삭제</li>
//                     </div>
//                 ))
//                 ) : (
//                 <div></div>
//                 )
//                 }  </div>
//             );
//         }
//     };

//     const goToHome = () => {
//         navigate("/");
//     }

//     const goToNoticeBoard = () => {
//         navigate("/NoticeBoard");
//     }

    
//     const goToLogin = () => {
//         navigate("/Login");
//     }

//     const goToFreeBulletinBoard = () => {
//         navigate("/FreeBulletinBoard");
//     }

//     const goToReportBulletinBoard = () => {
//         navigate("/ReportBulletinBoard");
//     }

//     const [isDropdownVisible, setIsDropdownVisible] = useState(false);

//     const toggleDropdown = () => {
//         setIsDropdownVisible(!isDropdownVisible);
//     };
//     const goToFreeBulletinBoardPageWriting = () => {
//         navigate("/FreeBulletinBoardPageWriting");
//     }
    
//     const onClickRemoveButton = async () => {
//         Swal.fire({
//             icon: "warning",
//             // title: "게시글 삭제",
//             text: '게시글을 삭제할까요?',
//             showCancelButton: true,
//             confirmButtonText: "예",
//             cancelButtonText: "아니요",
//         })
//         .then(async (res) => {
//             if (res.isConfirmed) {
//                 try {
//                     const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/boards/remove/FREE/${bnum}`, {
//                         headers: {
//                             'Authorization': `Bearer ${cookies.get('accessToken')}`}
//                     });
//                     console.log('RESPONSE :', response);
//                     console.log('bnum :', bnum);
//                     console.log('url : ', `${process.env.REACT_APP_SERVER_URL}/boards/remove/FREE/${bnum}`)
//                     goToFreeBulletinBoard();
//                 } catch (error) {
//                     alert('관리자와 해당 글의 작성자만 게시글을 삭제할 수 있습니다.', error);
//                 }
//             }
//         });
//     };

//     const [comment, setComment] = useState('');

//     const handleComment = (e) => {
//         setComment(e.target.value);
//     }

//     const onClickCommentEnrollButton = async () => {
//         const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/replies/FREE/register`, {bno: bnum, replyText: comment}, {
//             headers: {
//                 'Authorization': `Bearer ${cookies.get('accessToken')}`}
//         });
//         console.log(response);
//     }

//     return (
//         <div className="page123">
//             <img src="assets/image/555.png" alt="background" className='wallPaper123'/>
//             <div className="upperSpace123">
//                 <div className="upperHomeWrap">
//                     <button class="upperHome123" onClick={goToHome}>Home</button>
//                 </div>

//                 <div className="upperNoticeWrap">
//                     <button className="upperNotice123" onClick={goToNoticeBoard}>Notice</button>
//                 </div>

//                 <div className="upperGuideWrap">
//                     <button className="upperGuide123">Guide</button>
//                 </div>

//                 <div className="upperCommunityWrap">
//                     <button className="upperCommunity123"  onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
//                         Community
//                         {isDropdownVisible && (
//                             <div className="dropdownMenu123">
//                                 <li onClick={goToFreeBulletinBoard} className="dropdownWord">자유 게시판</li>
//                                 <li onClick={goToReportBulletinBoard} className="dropdownWord">신고 게시판</li>
//                             </div>
//                         )}
//                     </button>
//                 </div>

//                 <div className="upperLoginWrap">
//                     { cookies.get('accessToken') ? (
//                         <button className="upperLogin123">Info</button>        
//                     ) : (
//                         <button className="upperLogin123" onClick={goToLogin}>Sign In</button>
//                     )}
//                 </div>

//             </div>

//             <div className="contentWrap123">
//                 <div className = "BulletinBoardUpper">
//                     <div className="BulletinBoardUpperLeft">
//                         <div className="BulletinBoardTitle123">자유 게시판</div>
//                     </div>
//                     <div className="BulletinBoardWritingUpperRight">
//                         <button className="BulletinBoardSecretButton" onClick={onClickSecretButton}>
//                             <span className='BulletinBoardImageWord'>비밀글</span>
//                             <input
//                                 type="checkbox"
//                                 className='BulletinBoardImageCheckbox'
//                                 onChange={onClickSecretButton}
//                                 />
//                         </button>

//                         <button className="BulletinBoardImageButton" onClick={onClickImageUpload}>
//                             <input
//                                 type="file"
//                                 ref={imageInput}
//                                 accept="image/*"
//                                 style={{display:'none'}}
//                                 onChange={onFileSelect}
//                             />
//                             <span className='BulletinBoardImageWord'>이미지</span>
//                             <input
//                                 type="checkbox"
//                                 className='BulletinBoardImageCheckbox'
//                                 checked={fileExist}
//                             />
//                         </button>
//                     </div>
//                 </div>
//                 <div className="BulletinBoardLongLineUpper"/>
//                 <div className = "BulletinBoardWritingMiddle">
//                         <div className = "BulletinBoardWritingTitleWrap">
//                             <input
//                                 type = 'text'
//                                 className="BulletinBoardWritingTitleInput"
//                                 placeholder="제목"
//                                 value={title}
//                                 onChange={handleTitle}/>
//                         </div>
//                         <div className="BulletinBoardShortLine"/>
//                         <div className = "BulletinBoardWritingContentsWrap">
//                             <textarea
//                                     type = 'text'
//                                     className="inputWritingContents"
//                                     placeholder="내용"
//                                     value={contents}
//                                     onChange={handleContents}
//                                     style={{ resize: 'none' }}
//                                     />
//                         </div>
//                         {fileExist && (
//                             <div className = "BulletinBoardWritingImage">
//                                 <div className="BulletinBoardShortLine"/>
//                                 <img
//                                     src={URL.createObjectURL(file)}
//                                     alt="files"
//                                     className="BulletinBoardImage"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 <div className="BulletinBoardLongLineBottom"/>
//                 <div className = "BulletinBoardBottom">
//                     <button className='BulletinBoardWritingButton' onClick={onClickWritingButton}>글쓰기</button>  
//                 </div>
//             </div>
//         </div>
//     )}