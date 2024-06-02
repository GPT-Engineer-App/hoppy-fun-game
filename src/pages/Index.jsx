import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Flex } from '@chakra-ui/react';

const Index = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const gridSize = 10;
  const goalPosition = { x: gridSize - 1, y: gridSize - 1 };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver || gameWon) return;

      let newPosition = { ...playerPosition };
      if (event.key === 'ArrowUp') newPosition.y = Math.max(0, newPosition.y - 1);
      if (event.key === 'ArrowDown') newPosition.y = Math.min(gridSize - 1, newPosition.y + 1);
      if (event.key === 'ArrowLeft') newPosition.x = Math.max(0, newPosition.x - 1);
      if (event.key === 'ArrowRight') newPosition.x = Math.min(gridSize - 1, newPosition.x + 1);

      setPlayerPosition(newPosition);

      if (newPosition.x === goalPosition.x && newPosition.y === goalPosition.y) {
        setGameWon(true);
      }

      if (obstacles.some(obstacle => obstacle.x === newPosition.x && obstacle.y === newPosition.y)) {
        setGameOver(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition, gameOver, gameWon, obstacles]);

  useEffect(() => {
    const generateObstacles = () => {
      let newObstacles = [];
      for (let i = 0; i < 10; i++) {
        newObstacles.push({
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        });
      }
      setObstacles(newObstacles);
    };

    generateObstacles();
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleButtonPress = (direction) => {
    if (gameOver || gameWon) return;

    let newPosition = { ...playerPosition };
    if (direction === 'up') newPosition.y = Math.max(0, newPosition.y - 1);
    if (direction === 'down') newPosition.y = Math.min(gridSize - 1, newPosition.y + 1);
    if (direction === 'left') newPosition.x = Math.max(0, newPosition.x - 1);
    if (direction === 'right') newPosition.x = Math.min(gridSize - 1, newPosition.x + 1);

    setPlayerPosition(newPosition);

    if (newPosition.x === goalPosition.x && newPosition.y === goalPosition.y) {
      setGameWon(true);
    }

    if (obstacles.some(obstacle => obstacle.x === newPosition.x && obstacle.y === newPosition.y)) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setPlayerPosition({ x: 0, y: 0 });
    setGameOver(false);
    setGameWon(false);
    setObstacles([]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Text fontSize="2xl" mb={4}>Frogger Inspired Game</Text>
      <Box display="grid" gridTemplateColumns={`repeat(${gridSize}, 40px)`} gridTemplateRows={`repeat(${gridSize}, 40px)`} gap={1}>
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const isPlayer = playerPosition.x === x && playerPosition.y === y;
          const isGoal = goalPosition.x === x && goalPosition.y === y;
          const isObstacle = obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);

          return (
            <Box key={index} width="40px" height="40px" display="flex" alignItems="center" justifyContent="center" bg={isPlayer ? 'green.500' : isGoal ? 'blue.500' : isObstacle ? 'red.500' : 'gray.200'}>
              {isPlayer && '🐸'}
              {isGoal && '🏁'}
              {isObstacle && '🚧'}
            </Box>
          );
        })}
      </Box>
      {gameOver && <Text fontSize="xl" color="red.500" mt={4}>Game Over!</Text>}
      {gameWon && <Text fontSize="xl" color="green.500" mt={4}>You Win!</Text>}
      {(gameOver || gameWon) && <Button mt={4} onClick={resetGame}>Restart Game</Button>}
      {isMobile && (
        <Flex mt={4} direction="column" alignItems="center">
          <Button onClick={() => handleButtonPress('up')} mb={2}>Up</Button>
          <Flex>
            <Button onClick={() => handleButtonPress('left')} mr={2}>Left</Button>
            <Button onClick={() => handleButtonPress('down')} mr={2}>Down</Button>
            <Button onClick={() => handleButtonPress('right')}>Right</Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default Index;