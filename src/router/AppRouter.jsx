import { Routes, Route, Navigate } from 'react-router-dom';
import CardMain from '../components/flashcard/CardMain';
import SearchResult from '../components/SearchDic/SearchResult';
import FlashCard from '../components/flashcard/FlashCard';
import CardDetail from '../components/flashcard/CardDetail';
import Login from '../components/flashcard/Login';
import Register from '../components/flashcard/Register';
import MyList from '../components/flashcard/MyList';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CardMain />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/flashcard" element={<FlashCard />} />
            <Route path="/card-detail" element={<CardDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mylist" element={<MyList />} />
        </Routes>
    )
}

export default AppRouter