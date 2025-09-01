import { Routes, Route, Navigate } from 'react-router-dom';
import CardMain from '../components/flashcard/CardMain';
import SearchResult from '../components/SearchDic/SearchResult';
import FlashCard from '../components/flashcard/FlashCard';
import CardDetail from '../components/flashcard/CardDetail';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CardMain />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/flashcard/:deckId" element={<FlashCard />} />
            <Route path="/card-detail/:deckId" element={<CardDetail />} />
        </Routes>
    )
}

export default AppRouter