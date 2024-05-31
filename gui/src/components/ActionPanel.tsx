import { Button, Select } from "antd";
import { AxiosResponse } from "axios";
import React from "react";
import { UseMutateFunction } from "react-query";
import { GameState, Strategy } from "../types";

export type ActionPanelProps = {
  nextStep: UseMutateFunction<
    AxiosResponse<GameState, any>,
    unknown,
    void,
    unknown
  >;
  undoStep: UseMutateFunction<
    AxiosResponse<GameState, any>,
    unknown,
    void,
    unknown
  >;
  redoStep: UseMutateFunction<
    AxiosResponse<GameState, any>,
    unknown,
    void,
    unknown
  >;
  changeStrategy: UseMutateFunction<
    AxiosResponse<GameState, any>,
    unknown,
    void,
    unknown
  >;
  selectedStrategy: Strategy;
  setSelectedStrategy: React.Dispatch<React.SetStateAction<Strategy>>;
};

export const ActionPanel: React.FC<ActionPanelProps> = ({
  nextStep,
  undoStep,
  redoStep,
  changeStrategy,
  selectedStrategy,
  setSelectedStrategy,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        textAlign: "center",
      }}
    >
      <Button onClick={() => nextStep()} style={{ marginRight: "10px" }}>
        Следующий ход
      </Button>
      <Button onClick={() => undoStep()} style={{ marginRight: "10px" }}>
        Отменить ход
      </Button>
      <Button onClick={() => redoStep()} style={{ marginRight: "10px" }}>
        Повторить ход
      </Button>
      <div>
        <Select
          value={selectedStrategy}
          onChange={(value: Strategy) => setSelectedStrategy(value)}
          style={{ width: "200px", marginLeft: "10px" }}
        >
          <Select.Option value="one_line">Одна линия</Select.Option>
          <Select.Option value="multi_line">Много линий</Select.Option>
          <Select.Option value="wall_to_wall">Стена на стену</Select.Option>
        </Select>
        <Button onClick={() => changeStrategy()} style={{ marginLeft: "10px" }}>
          Поменять стратегию
        </Button>
      </div>
    </div>
  );
};
