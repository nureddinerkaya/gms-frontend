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

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/games/getAll');
        const data = await response.json();
        console.log(data);
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
      

      <div className="action-buttons">
        <button className="primary-button">Test Button</button>
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
              <div className="game-rating">Rating: {game.totalRating}</div>
              <button className="primary-button game-add-button">Ekle</button>
            </div>
          ))}
        </div>
      )}

      <div className="add-button-wrapper">
        <button className="dashed-button large-button">+ Oyun Ekle</button>
      </div>
    </div>
  );
};

export default HomePage;
