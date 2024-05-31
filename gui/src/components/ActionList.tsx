import React from "react";
import { Action, ActionType } from "../types";
import { List } from "antd";

type ActionListProps = {
  actions: Action[];
};

const actionTypeToText = {
  [ActionType.death]: "Погиб",
  [ActionType.attack]: "Атаковал",
  [ActionType.arrow]: "Выпустил стрелу",
  [ActionType.clone]: "Клонировался",
  [ActionType.heal]: "Исцелился",
  [ActionType.move]: "Переместился",
};

export const ActionList: React.FC<ActionListProps> = ({ actions }) => {

  return (
    <List
      size="small"
      bordered
      dataSource={actions}
      renderItem={(action) => (
        <List.Item>
          {`Юнит ${action.subject} ${actionTypeToText[action.type]} юнит ${
            action.object
          } на ${action.value}`}
        </List.Item>
      )}
    />
  );
};
