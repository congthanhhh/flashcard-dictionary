import { Routes, Route, Navigate } from 'react-router-dom';
import CardMain from '../components/flashcard/CardMain';
import SearchResult from '../components/SearchDic/SearchResult';
import FlashCard from '../components/flashcard/FlashCard';
import CardDetail from '../components/flashcard/CardDetail';
import CardMyList from '../components/flashcard/CardMyList';
import ReviewSession from '../components/flashcard/ReviewSession';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CardMain />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/flashcard/:deckId" element={<FlashCard />} />
            <Route path="/card-detail/:deckId" element={<CardDetail />} />
            <Route path="/my-list" element={<CardMyList />} />
            <Route path="/review-session/:deckId" element={<ReviewSession />} />
        </Routes>
    )
}

export default AppRouter