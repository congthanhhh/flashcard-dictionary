import { Routes, Route, Navigate } from 'react-router-dom';
import CardMain from '../components/flashcard/CardMain';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CardMain />} />
        </Routes>
    )
}

export default AppRouter