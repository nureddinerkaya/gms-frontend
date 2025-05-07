"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

const FirstPage = () => {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    genre: '',
    photo: ''
  });
  const [newUser, setNewUser] = useState({
    name: '',
    password: ''
  });

  const router = useRouter();

  // oyun çekme kodu
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/games/getAll');
        const data = await response.json();
        if (data) {
          setGames(data);
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

  const goToLoginPage = () => {
    router.push("/login");
  };

  const handleAddGame = async () => {
    try {
      await fetch('http://localhost:8000/api/games/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame)
      });
      alert('Oyun eklendi');
      setIsAddGameModalOpen(false);
    } catch (error) {
      alert('Oyun eklenemedi');
      console.error(error);
    }
  };

  const handleAddUser = async () => {
    try {
      await fetch('http://localhost:8000/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      alert("Kullanıcı eklendi");
      setIsAddUserModalOpen(false);
    } catch (error) {
      alert("Kullanıcı eklenemedi");
      console.error(error);
    }
  };

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Game Platform</h1>
      </div>

      <div className="action-buttons">
        <button onClick={() => setIsAddGameModalOpen(true)}>Add Game</button>
        <button onClick={() => alert("Remove Game clicked")}>Remove Game</button>
        <button onClick={() => setIsAddUserModalOpen(true)}>Add User</button>
        <button onClick={() => alert("Remove User clicked")}>Remove User</button>
        <button onClick={goToLoginPage}>Login as a User</button>
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
            </div>
          ))}
        </div>
      )}

      {/* Add Game Modal */}
      {isAddGameModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Game</h2>
            <input
              placeholder="Name"
              onChange={e => setNewGame({ ...newGame, name: e.target.value })}
            />
            <input
              placeholder="Genre(s)"
              onChange={e => setNewGame({ ...newGame, genre: e.target.value })}
            />
            <input
              placeholder="Photo URL"
              onChange={e => setNewGame({ ...newGame, photo: e.target.value })}
            />
            <button onClick={handleAddGame}>Add</button>
            <button onClick={() => setIsAddGameModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New User</h2>
            <input
              placeholder="Name"
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            />
            <button onClick={handleAddUser}>Add</button>
            <button onClick={() => setIsAddUserModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstPage;
