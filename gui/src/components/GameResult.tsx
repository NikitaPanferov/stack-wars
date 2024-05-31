import React from "react";
import { Card } from "antd";

export const GameResult: React.FC = () => {
  return (
    <Card style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <h2>Результаты игры</h2>
      <p>Здесь будут отображены результаты игры.</p>
    </Card>
  );
};
