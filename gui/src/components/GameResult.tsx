import React from "react";
import { Card, Button } from "antd";
import Confetti from "react-confetti";
import { GameStatus } from "../types";

export type GameResultProps = {
  winner: string;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
};

export const GameResult: React.FC<GameResultProps> = ({
  winner,
  setGameStatus,
}) => {
  const startNewGame = () => {
    setGameStatus(GameStatus.select);
  };

  return (
    <>
      <Confetti />

      <Card style={{ textAlign: "center"}}>
        <h2>Результаты игры</h2>
        <h1>Победитель: {winner == "alliance" ? "Альянс" : "Орда"}!</h1>
        <Button type="primary" onClick={startNewGame}>
          Начать новую игру
        </Button>
      </Card>
    </>
  );
};
