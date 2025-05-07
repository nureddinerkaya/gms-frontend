 import React, { useEffect, useState } from 'react';
import '../css/HomePage.css';
import minecraftImage from '../images/minecraft.webp';
import witcherImage from '../images/witcher.png';
import LolImage from '../images/lol.jpg';
import GtaImage from '../images/images (1).jfif';
import { useNavigate } from 'react-router-dom';

import { Button, Row, Col } from 'antd';
import '../css/HomePage.css';
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/games/getAll');
        console.log(response);
        if (response.data) {
          setGames(response.data); // Veriyi state'e kaydediyoruz
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

  const gotoLogout = () => {
    navigate("/");
  };

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Game Platform</h1>
        <div className="auth-buttons">
          <Button type="default" onClick={gotoLogout}>Log Out</Button>
        </div>
      </div>

      {/* ✅ TEST BUTONU */}
      <div className="action-buttons">
        <Button type="primary">Test Button</Button>
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
                <Button type="primary" block className="game-add-button">
                  Ekle
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <div className="add-button-wrapper">
        <Button type="dashed" size="large">+ Oyun Ekle</Button>
      </div>
    </div>
  );
};

export default HomePage;
