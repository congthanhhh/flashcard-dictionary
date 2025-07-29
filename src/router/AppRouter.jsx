import { Routes, Route, Navigate } from 'react-router-dom';
import CardMain from '../components/flashcard/CardMain';
import SearchResult from '../components/SearchDic/SearchResult';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CardMain />} />
            <Route path="/search" element={<SearchResult />} />
        </Routes>
    )
}

export default AppRouter