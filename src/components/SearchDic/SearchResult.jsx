import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchCards } from "../../service/card";
import { getUserDeckById } from "../../service/deck";
import { Spin, Alert, Empty, Button, Tag } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deckInfo, setDeckInfo] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCards: 0
  });

  const searchQuery = searchParams.get('q');

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const performSearch = async (query, page = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Try multiple search strategies and combine results
      const searchPromises = [
        searchCards({ name: query }, page, 10).catch(() => ({ cards: [] })),
        searchCards({ definition: query }, page, 10).catch(() => ({ cards: [] }))
      ];

      const results = await Promise.all(searchPromises);

      // Combine and deduplicate results
      const allCards = [];
      const seenIds = new Set();

      results.forEach(result => {
        if (result.cards) {
          result.cards.forEach(card => {
            if (!seenIds.has(card._id)) {
              seenIds.add(card._id);
              allCards.push(card);
            }
          });
        }
      });

      // Use the pagination info from the first successful result
      const firstResult = results.find(r => r.cards && r.cards.length > 0) || results[0];

      setSearchResults(allCards);
      setPagination({
        currentPage: firstResult.currentPage || 1,
        totalPages: Math.ceil(allCards.length / 10),
        totalCards: allCards.length
      });

      // Fetch deck information for unique deck_ids
      const uniqueDeckIds = [...new Set(allCards.map(card => card.deck_id))];
      const deckPromises = uniqueDeckIds.map(async (deckId) => {
        try {
          const deck = await getUserDeckById(deckId);
          return { [deckId]: deck };
        } catch (err) {
          console.warn(`Failed to fetch deck ${deckId}:`, err);
          return { [deckId]: { name: 'Bộ thẻ không xác định', description: '' } };
        }
      });

      const deckResults = await Promise.all(deckPromises);
      const deckInfoMap = Object.assign({}, ...deckResults);
      setDeckInfo(deckInfoMap);

    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tìm kiếm');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    performSearch(searchQuery, page);
  };

  if (!searchQuery) {
    return (
      <div className="max-w-screen-lg mx-auto p-6 text-center">
        <SearchOutlined style={{ fontSize: '48px', color: '#ccc' }} />
        <h2 className="text-xl text-gray-500 mt-4">Nhập từ khóa để tìm kiếm</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto p-6 text-center">
        <Spin size="large" />
        <p className="mt-4">Đang tìm kiếm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-lg mx-auto p-6">
        <Alert
          message="Lỗi tìm kiếm"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          Kết quả tìm kiếm cho: "<span className="text-blue-500">{searchQuery}</span>"
        </h2>
        <Empty
          description="Không tìm thấy kết quả nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Kết quả tìm kiếm cho: "<span className="text-blue-500">{searchQuery}</span>"
        </h2>
        <p className="text-gray-600">
          Tìm thấy {pagination.totalCards} thẻ từ vựng
        </p>
      </div>

      <div className="space-y-6">
        {searchResults.map((card) => (
          <div key={card._id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
            {/* Deck Information */}
            <div className="mb-4">
              <Tag
                icon={<BookOutlined />}
                color="blue"
                className="text-sm"
              >
                {deckInfo[card.deck_id]?.name || 'Bộ thẻ không xác định'}
              </Tag>
            </div>

            <div className="flex">
              <div className="font-bold text-[30px] text-blue-500">{card.name}</div>
              <div className="text-[30px] ml-2">/{card.name}/</div>
            </div>
            <div className="border-b border-gray-950 mb-4"></div>

            {card.word_type && (
              <div className="font-bold text-xl text-center bg-gray-200 w-fit px-3 py-1 rounded mb-4">
                {card.word_type}
              </div>
            )}

            <div>
              <div className="flex mt-2">
                <div className="border-l-8 border-green-500"></div>
                <div className="font-bold text-lg ml-2">{card.definition}</div>
              </div>
            </div>

            {card.hint && (
              <div className="mt-2">
                <span className="font-semibold text-gray-600">Gợi ý: </span>
                <span className="text-gray-700">{card.hint}</span>
              </div>
            )}

            {card.example && card.example.length > 0 && (
              <div className="mt-4">
                <div className="font-bold text-lg mb-2">Ví dụ:</div>
                {card.example.map((ex, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
                      <div className="font-normal text-lg text-blue-400">{ex}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {card.category && card.category.length > 0 && (
              <div className="mt-4">
                <span className="font-semibold text-gray-600">Danh mục: </span>
                {card.category.map((cat, index) => (
                  <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-sm">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                type={page === pagination.currentPage ? "primary" : "default"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;



