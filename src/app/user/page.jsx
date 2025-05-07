"use client";

import React, { useEffect, useState } from 'react';
import './page.css';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const [owneds, setOwneds] = useState([]);
    const [averageRating, setAverageRating] = useState(null); // New state for average rating
    const [gameNames, setGameNames] = useState({}); // New state for game names

    useEffect(() => {
        const userId = localStorage.getItem('user_id'); // Get user ID from local storage

        // Fetch user data
        fetch(`https://silent-space-458820-h2.oa.r.appspot.com/api/users/getById?id=${userId}`)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(err => alert(`Failed to fetch user data: ${err.message}`));

        // Fetch owned games
        fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/owneds/getAll')
            .then(response => response.json())
            .then(data => {
                const filteredOwneds = data.filter(owned => owned.user === userId);
                setOwneds(filteredOwneds);

                // Fetch game names
                const gameIds = [...new Set(filteredOwneds.map(owned => owned.game))];
                Promise.all(
                    gameIds.map(id =>
                        fetch(`https://silent-space-458820-h2.oa.r.appspot.com/api/games/getById?id=${id}`)
                            .then(response => response.json())
                            .then(game => ({ id, name: game.name }))
                            .catch(() => ({ id, name: 'Unknown Game' }))
                    )
                ).then(gameData => {
                    const namesMap = gameData.reduce((acc, game) => {
                        acc[game.id] = game.name;
                        return acc;
                    }, {});
                    setGameNames(namesMap);
                });

                // Calculate average rating
                const totalRatings = filteredOwneds.reduce((sum, owned) => sum + (owned.rating || 0), 0);
                const average = filteredOwneds.length > 0 ? (totalRatings / filteredOwneds.length).toFixed(2) : 'N/A';
                setAverageRating(average);
            })
            .catch(err => alert(`Failed to fetch owned games: ${err.message}`));
    }, []);

    const handlePlay = (id) => {
        fetch(`https://silent-space-458820-h2.oa.r.appspot.com/api/owneds/play1hour?id=${id}`, {
            method: 'PUT',
        })
            .then(response => response.text())
            .then(data => {
                if (data.startsWith('{')) {
                    const error = JSON.parse(data);
                    alert(`Error: ${error.message}`);
                } else {
                    window.location.reload();
                }
            })
            .catch(err => alert(`Failed to play 1 hour: ${err.message}`));
    };

    const handleRate = (id) => {
        const rating = prompt('Enter your rating (0-5):');
        if (rating !== null) {
            const numericRating = parseFloat(rating);
            if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
                alert('Invalid rating. Please enter a number between 0 and 5.');
                return;
            }
            fetch(`https://silent-space-458820-h2.oa.r.appspot.com/api/owneds/rate?id=${id}&rating=${numericRating}`, {
                method: 'PUT',
            })
                .then(response => response.text())
                .then(data => {
                    if (data.startsWith('{')) {
                        const error = JSON.parse(data);
                        alert(`Error: ${error.message}`);
                    } else {
                        window.location.reload();
                    }
                })
                .catch(err => alert(`Failed to submit rating: ${err.message}`));
        }
    };

    const handleComment = (id) => {
        const text = prompt('Enter your comment:');
        if (text !== null && user) {
            fetch(`https://silent-space-458820-h2.oa.r.appspot.com/api/owneds/comment?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: String(user.username),
                    comment: String(text),
                }),
            })
                .then(response => response.text())
                .then(data => {
                    if (data.startsWith('{')) {
                        const error = JSON.parse(data);
                        alert(`Error: ${error.message}`);
                    } else {
                        window.location.reload();
                    }
                })
                .catch(err => alert(`Failed to submit comment: ${err.message}`));
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-page">
            <div className="user-info">
                <h1>{user.username}</h1>
                <p>Total Play Time: {user.total_played_time} hours</p>
                <p>Most Played Game: {user.most_played_game || 'N/A'}</p>
                <p>Average of Ratings: {averageRating}</p> {/* Display average rating */}
            </div>
            <div className="owned-list">
                <h2>Owned Games</h2>
                <ul>
                    {owneds.map(owned => (
                        <li key={owned.id}>
                            <p>Game Name: {gameNames[owned.game] || 'Loading...'}</p> {/* Display game name */}
                            <p>Play Time: {owned.playTime} hours</p>
                            <p>Rating: {owned.rating}</p>
                            <div className="comments">
                                <h3>Comments:</h3>
                                <ul>
                                    {owned.comment.map((c, index) => (
                                        <li key={index}>
                                            <strong>{c.username}:</strong> {c.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => handlePlay(owned.id)}>Play 1 Hour</button>
                            <button onClick={() => handleRate(owned.id)}>Rate</button>
                            <button onClick={() => handleComment(owned.id)}>Comment</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserPage;
