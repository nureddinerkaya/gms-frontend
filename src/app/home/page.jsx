"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, Input, Spin, Alert } from 'antd';
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
        Alert.error('Oyunlar alınırken bir hata oluştu');
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
      Alert.success('Oyun eklendi');
      setIsAddGameModalOpen(false);
    } catch (error) {
      Alert.error('Oyun eklenemedi');
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
      Alert.success("Kullanıcı eklendi");
      setIsAddUserModalOpen(false);
    } catch (error) {
      Alert.error("Kullanıcı eklenemedi");
      console.error(error);
    }
  };

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Game Platform</h1>
      </div>

      <div className="action-buttons">
        <Button type="primary" onClick={() => setIsAddGameModalOpen(true)}>Add Game</Button>
        <Button danger onClick={() => Alert.info("Remove Game clicked")}>Remove Game</Button>
        <Button type="primary" onClick={() => setIsAddUserModalOpen(true)}>Add User</Button>
        <Button danger onClick={() => Alert.info("Remove User clicked")}>Remove User</Button>
        <Button onClick={goToLoginPage}>Login as a User</Button>
      </div>

      {loading ? (
        <Spin tip="Loading games..." />
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
      <Modal
        title="Add New Game"
        visible={isAddGameModalOpen}
        onOk={handleAddGame}
        onCancel={() => setIsAddGameModalOpen(false)}
      >
        <Input
          placeholder="Name"
          onChange={e => setNewGame({ ...newGame, name: e.target.value })}
        />
        <Input
          placeholder="Genre(s)"
          onChange={e => setNewGame({ ...newGame, genre: e.target.value })}
        />
        <Input
          placeholder="Photo URL"
          onChange={e => setNewGame({ ...newGame, photo: e.target.value })}
        />
      </Modal>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        visible={isAddUserModalOpen}
        onOk={handleAddUser}
        onCancel={() => setIsAddUserModalOpen(false)}
      >
        <Input
          placeholder="Name"
          onChange={e => setNewUser({ ...newUser, name: e.target.value })}
        />
        <Input.Password
          placeholder="Password"
          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default FirstPage;
