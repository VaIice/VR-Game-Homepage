// import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './Login';
import SignUp from "./SignUp";
import Home from './Home';
import NoticeBoard from "./NoticeBoard";
import FreeBulletinBoard from "./FreeBulletinBoard";
import ReportBulletinBoard from "./ReportBulletinBoard";
import FreeBulletinBoardPage from "./FreeBulletinBoardPage";
import ReportBulletinBoardPage from "./ReportBulletinBoardPage";
import NoticeBulletinBoardPage from "./NoticeBulletinBoardPage";
import FreeBulletinBoardPageWriting from "./FreeBulletinBoardPageWriting";
import Information from "./Information";
import SearchPassword from "./SearchPassword";

function App() {
  const routes = Array.from({ length: 1000 }, (_, index) => (
    <Route
      key={index}
      path={`/FreeBulletinBoardPage/${index}`}
      element={<FreeBulletinBoardPage bno={index} />}
    />
  ));

  const routes1 = Array.from({ length: 1000 }, (_, index) => (
    <Route
      key={index}
      path={`/FreeBulletinBoardPageWriting/${index}`}
      element={<FreeBulletinBoardPageWriting bno={index} />}
    />
  ));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Information" element={<Information />} />
        <Route path="/NoticeBoard" element={<NoticeBoard />} />
        <Route path="/FreeBulletinBoard" element={<FreeBulletinBoard />} />
        <Route path="/ReportBulletinBoard" element={<ReportBulletinBoard />} />
        <Route path="/FreeBulletinBoardPage" element={<FreeBulletinBoardPage />} />
        <Route path="/ReportBulletinBoardPage" element={<ReportBulletinBoardPage />} />
        <Route path="/NoticeBulletinBoardPage" element={<NoticeBulletinBoardPage />} />
        <Route path="/FreeBulletinBoardPageWriting" element={<FreeBulletinBoardPageWriting />} />
        <Route path="/SearchPassword" element={<SearchPassword />} />
        <Route>
          {routes}
        </Route>
        <Route>
          {routes1}
        </Route>
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
