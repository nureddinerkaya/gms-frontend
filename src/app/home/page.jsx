"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, Input, Select, Spin } from 'antd';
import './page.css';

const { Option } = Select;

const FirstPage = () => {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]); // Kullanıcılar için yeni state
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isRemoveGameModalOpen, setIsRemoveGameModalOpen] = useState(false);
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false); // Remove User modal state
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // Seçilen kullanıcı id

  const [newGame, setNewGame] = useState({
    name: '',
    genre: '',
    photo: ''
  });

  const [newUser, setNewUser] = useState({
    username: '',
    password: ''
  });

  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/games/getAll');
        const data = await response.json();
        if (data) {
          setGames(data);
        }
      } catch (error) {
        window.alert('Oyunlar alınırken bir hata oluştu');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => { // Kullanıcıları çekme işlemi
      try {
        setLoading(true);
        const response = await fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/users/getAll');
        const data = await response.json();
        if (data) {
          setUsers(data);
        }
      } catch (error) {
        window.alert('Kullanıcılar alınırken bir hata oluştu');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
    fetchUsers(); // Kullanıcıları da çekiyoruz
  }, []);

  const goToLoginPage = () => {
    router.push("/login");
  };

  const handleAddGame = async () => {
    try {
      await fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/games/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame)
      });
      window.alert('Oyun başarıyla eklendi!');
      setIsAddGameModalOpen(false);
        window.location.reload();
    } catch (error) {
      window.alert('Oyun eklenemedi!');
      console.error(error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          most_played_game: "",  // most_played_game'ı boş string olarak gönderiyoruz
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kullanıcı eklenemedi: ${errorText}`);
      }

      window.alert("Kullanıcı eklendi");
      setIsAddUserModalOpen(false);
        window.location.reload();
    } catch (error) {
      window.alert(`Kullanıcı eklenemedi: ${error.message}`);
      console.error(error);
    }
  };

  const handleRemoveGame = async () => {
    if (!selectedGameId) return window.alert("Lütfen bir oyun seçin.");
    try {
      const response = await fetch(`https://silent-space-458820-h2.oa.r.appspot.com/api/games/delete?id=${selectedGameId}`, {
        method: 'DELETE',
      });

      const message = await response.text();
      console.log("Backend Response:", message);

      if (message.includes("deleted successfully")) {
        window.alert("Oyun silindi.");
        setGames(prev => prev.filter(game => game.id !== selectedGameId));
        setIsRemoveGameModalOpen(false);
          window.location.reload();
      } else {
        window.alert("Silme işlemi başarısız: " + message);
      }
    } catch (error) {
      window.alert("Oyun silinemedi.");
      console.error(error);
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedUserId) return window.alert("Lütfen bir kullanıcı seçin.");
    try {
      const response = await fetch(`https://silent-space-458820-h2.oa.r.appspot.com/api/users/delete?id=${selectedUserId}`, {
        method: 'DELETE',
      });

      const message = await response.text();
      console.log("Backend Response:", message);

      if (message.includes("User deleted successfully")) {
        window.alert("Kullanıcı silindi.");
        setUsers(prev => prev.filter(user => user.id !== selectedUserId));
        setIsRemoveUserModalOpen(false);
          window.location.reload();
      } else {
        window.alert("Silme işlemi başarısız: " + message);
      }
    } catch (error) {
      window.alert("Kullanıcı silinemedi.");
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
        <Button danger onClick={() => setIsRemoveGameModalOpen(true)}>Remove Game</Button>
        <Button type="primary" onClick={() => setIsAddUserModalOpen(true)}>Add User</Button>
        <Button danger onClick={() => setIsRemoveUserModalOpen(true)}>Remove User</Button>
        <Button onClick={() => router.push('/login')}>Login as a User</Button>
      </div>



      {/* Add Game Modal */}
      <Modal
        title="Add New Game"
        open={isAddGameModalOpen}
        onOk={handleAddGame}
        onCancel={() => setIsAddGameModalOpen(false)}
      >
        <Input placeholder="Name" onChange={e => setNewGame({ ...newGame, name: e.target.value })} />
        <Input placeholder="Genre(s)" onChange={e => setNewGame({ ...newGame, genre: e.target.value })} />
        <Input placeholder="Photo URL" onChange={e => setNewGame({ ...newGame, photo: e.target.value })} />
      </Modal>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isAddUserModalOpen}
        onOk={handleAddUser}
        onCancel={() => setIsAddUserModalOpen(false)}
      >
        <Input placeholder="Username" onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
        <Input.Password placeholder="Password" onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
      </Modal>

      {/* Remove Game Modal */}
      <Modal
        title="Remove Game"
        open={isRemoveGameModalOpen}
        onOk={handleRemoveGame}
        onCancel={() => setIsRemoveGameModalOpen(false)}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Bir oyun seçin"
          onChange={(value) => setSelectedGameId(value)}
        >
          {games.map(game => (
            <Option key={game.id} value={game.id}>{game.name}</Option>
          ))}
        </Select>
      </Modal>

      {/* Remove User Modal */}
      <Modal
        title="Remove User"
        open={isRemoveUserModalOpen}
        onOk={handleRemoveUser}
        onCancel={() => setIsRemoveUserModalOpen(false)}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Bir kullanıcı seçin"
          onChange={(value) => setSelectedUserId(value)}
        >
          {users.map(user => (
            <Option key={user.id} value={user.id}>{user.username}</Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default FirstPage;