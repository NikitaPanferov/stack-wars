import React, { useState, useEffect } from "react";
import { Army, Config, GameStatus } from "../types";
import { Button, Card } from "antd";
import { useQuery, useMutation } from "react-query";
import { fetchConfig, startGame } from "../api";
import { ArmySelection, Game, GameResult } from "../components";

export const RootPage = () => {
  const [selectedAlliance, setSelectedAlliance] = useState<string[]>([]);

  const [selectedHorde, setSelectedHorde] = useState<string[]>([]);
  console.log({ selectedAlliance, selectedHorde });
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.off);

  const [alliance, setAlliance] = useState<Army>({} as Army);
  const [horde, setHorde] = useState<Army>({} as Army);

  const [config, setConfig] = useState<Config>();

  const [winner, setWinner] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery<Config>("config", fetchConfig, {
    onSuccess: (config) => {
      setConfig(config);
    },
  });
  const mutation = useMutation(
    () => startGame(selectedAlliance, selectedHorde),
    {
      onSuccess: ({ data: { game_state } }) => {
        setGameStatus(GameStatus.game);
        setAlliance(game_state.alliance);
        setHorde(game_state.horde);
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
    return (
      config && (
        <Game
          alliance={alliance}
          horde={horde}
          setAlliance={setAlliance}
          setHorde={setHorde}
          setGameStatus={setGameStatus}
          setWinner={setWinner}
          config={config}
        />
      )
    );
  }

  if (gameStatus === GameStatus.results && !!winner) {
    return (
      <GameResult
        winner={winner}
        setGameStatus={setGameStatus}
      />
    );
  }

  return null;
};
