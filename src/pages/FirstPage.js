import React, { useEffect, useState } from 'react';
import '../css/FirstPage.css';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Modal, Input, message } from 'antd';
import axios from "axios";

const FirstPage = () => {
  const navigate = useNavigate();
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

  // oyun çekme kodu
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/games/getAll');
        if (response.data) {
          setGames(response.data);
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
    navigate("/login");
  };

  const handleAddGame = async () => {
    try {
      await axios.post('http://localhost:8000/api/games/add', newGame);
      message.success('Oyun eklendi');
      setIsAddGameModalOpen(false);
    } catch (error) {
      message.error('Oyun eklenemedi');
      console.error(error);
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/add', newUser);
      message.success("Kullanıcı eklendi");
      setIsAddUserModalOpen(false);
    } catch (error) {
      message.error("Kullanıcı eklenemedi");
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
        <Button onClick={() => message.info("Remove Game clicked")}>Remove Game</Button>
        <Button onClick={() => setIsAddUserModalOpen(true)}>Add User</Button>
        <Button onClick={() => message.info("Remove User clicked")}>Remove User</Button>
        <Button onClick={goToLoginPage}>Login as a User</Button>
      </div>

      {loading ? (
        <div>Loading games...</div>
      ) : (
        <Row gutter={[16, 24]} className="games-grid">
          {games.map((game) => (
            <Col key={game.id} xs={24} sm={12} md={8} lg={6}>
              <div className="game-card">
                <img src={game.photo} alt={game.name} className="game-image" />
                <div className="game-name">{game.name}</div>
                <div className="game-genres">Genre: {game.genre}</div>
                <div className="game-playtime">Playtime: {game.playTimeOfGame} hours</div>
                <div className="game-rating">Rating: {game.totalRating}</div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Game Modal */}
      <Modal
        title="Add New Game"
        open={isAddGameModalOpen}
        onCancel={() => setIsAddGameModalOpen(false)}
        onOk={handleAddGame}
      >
        <Input placeholder="Name" onChange={e => setNewGame({ ...newGame, name: e.target.value })} />
        <Input placeholder="Genre(s)" onChange={e => setNewGame({ ...newGame, genre: e.target.value })} />
        <Input placeholder="Photo URL" onChange={e => setNewGame({ ...newGame, photo: e.target.value })} />


      </Modal>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isAddUserModalOpen}
        onCancel={() => setIsAddUserModalOpen(false)}
        onOk={handleAddUser}
      >
        <Input placeholder="Name" onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
        <Input.Password placeholder="Password" onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
      </Modal>
    </div>
  );
};

export default FirstPage;
