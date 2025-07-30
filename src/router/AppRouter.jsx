import { Routes, Route, Navigate } from 'react-router-dom';
import CardMain from '../components/flashcard/CardMain';
import SearchResult from '../components/SearchDic/SearchResult';
import FlashCard from '../components/flashcard/FlashCard';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CardMain />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/flashcard" element={<FlashCard />} />
        </Routes>
    )
}

export default AppRouter