import React, { useState, useEffect } from "react";
import { Army, GameState, GameStatus } from "../types";
import { Button, Card, Spin, Flex } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchConfig, startGame } from "../api";
import { ArmySelection, Game, GameResult } from "../components";

export const RootPage = () => {
  const [selectedAlliance, setSelectedAlliance] = useState<string[]>([]);
  const [selectedHorde, setSelectedHorde] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.off);
  const queryClient = useQueryClient();

  const [alliance, setAlliance] = useState<Army>({} as Army);
  const [horde, setHorde] = useState<Army>({} as Army);

  const { data, error, isLoading } = useQuery("config", fetchConfig);
  const mutation = useMutation(
    () => startGame(selectedAlliance, selectedHorde),
    {
      onSuccess: ({ data }) => {
        setGameStatus(GameStatus.game);
        setAlliance(data.alliance);
        setHorde(data.horde);
      },
    }
  );

  useEffect(() => {
    if (data) {
      setSelectedAlliance([]);
      setSelectedHorde([]);
    }
  }, [data]);

  const startSelect = () => {
    setGameStatus(GameStatus.select);
  };

  const handleStartGame = () => {
    mutation.mutate();
  };

  if (gameStatus === GameStatus.off) {
    return (
      <Card
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button size="large" onClick={startSelect}>
          Начать новую игру!
        </Button>
      </Card>
    );
  }

  if (gameStatus === GameStatus.select) {
    return (
      <ArmySelection
        data={data}
        isLoading={isLoading}
        error={error}
        alliance={selectedAlliance}
        setAlliance={setSelectedAlliance}
        horde={selectedHorde}
        setHorde={setSelectedHorde}
        onStartGame={handleStartGame}
      />
    );
  }

  if (gameStatus === GameStatus.game) {
    return <Game alliance={alliance} horde={horde} setAlliance={setAlliance} setHorde={setHorde}/>;
  }

  if (gameStatus === GameStatus.results) {
    return <GameResult />;
  }

  return null;
};
