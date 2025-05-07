"use client"

import React, { useEffect, useState } from 'react';
import './page.css';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const router = useRouter();

  const gotoLogout = () => {
    router.push('/');
  };

  const handleAddGame = async (gameId) => {
    const userId = localStorage.getItem('user_id'); // Get userId from local storage
    if (!userId) {
      alert('Kullanıcı ID bulunamadı.');
      return;
    }

    try {
      const response = await fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/owneds/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, gameId }),
      });

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        if (responseData.status === "error") {
          alert(`Hata: ${responseData.message || 'Bilinmeyen bir hata oluştu.'}`);
        } else {
          alert('Başarıyla oyunu kütüphanenize eklediniz.');
          router.push('/user')
        }
      } else {
        const responseText = await response.text();
        alert(`Oyunu başarıyla kütüphanenize eklediniz.`);
        router.push('/user')
      }
      
    } catch (error) {
      console.error('Oyun ekleme hatası:', error);
      alert('Oyun eklenirken bir hata oluştu.');
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/games/getAll');
        const data = await response.json();
        console.log('Fetched games:', data); // Debug: Log the API response
        if (data) {
          setGames(data); // Save the data to state
        }
      } catch (error) {
        alert('Oyunlar alınırken bir hata oluştu');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="homepage-container">
      <div className="top-buttons">
        <button className="default-button" onClick={() => router.push('/home')}>Home Page</button>
        <button className="default-button" onClick={() => router.push('/user')}>User Page</button>
      </div>
      {loading ? (
        <div>Loading games...</div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.photo} alt={game.name} className="game-image" />
              <div className="game-name">{game.name}</div>
              <div className="game-genres">Genre: {game.genre}</div>
              <div className="game-playtime">Playtime: {game.playTimeOfGame} hours</div>
              <div className="game-rating">Rating: {Math.round(game.TotalRating)}</div>
              <button
                className="primary-button game-own-button"
                onClick={() => handleAddGame(game.id)} // Trigger action on button click
              >
                Ekle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
