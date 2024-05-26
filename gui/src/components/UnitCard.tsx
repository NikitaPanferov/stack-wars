import React from "react";
import { Card, Button, Badge, Table } from "antd";
import { UnitConfig } from "../types";

interface UnitCardProps {
  unitName: string;
  unitConfig: UnitConfig;
  onAdd: (unitName: string) => void;
  onRemove: (unitName: string) => void;
  unitCount: number;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  unitName,
  unitConfig,
  onAdd,
  onRemove,
  unitCount,
}) => {
  const unitData = [
    { key: "1", attribute: "HP", value: unitConfig.hp },
    { key: "2", attribute: "Damage", value: unitConfig.damage },
    { key: "3", attribute: "Defence", value: unitConfig.defence },
    { key: "4", attribute: "Dodge", value: unitConfig.dodge },
    { key: "5", attribute: "Cost", value: unitConfig.cost },
    unitConfig.range && { key: "6", attribute: "Range", value: unitConfig.range },
    unitConfig.heal_percent && { key: "7", attribute: "Heal Percent", value: unitConfig.heal_percent },
  ].filter(Boolean);

  const columns = [
    { title: "Attribute", dataIndex: "attribute", key: "attribute" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Card
        title={unitName}
        extra={
          <div>
            <Badge count={unitCount} offset={[-20, -4]}>
              <></>
            </Badge>
            <Button
              type="primary"
              title="Добавить"
              onClick={() => onAdd(unitName)}
              style={{ marginRight: "8px" }}
            >
              +
            </Button>
            <Button
              type="default"
              title="Убрать"
              onClick={() => onRemove(unitName)}
              disabled={unitCount === 0}
            >
              -
            </Button>
          </div>
        }
        style={{ marginBottom: "20px", width: "100%" }}
      >
        <Table
          dataSource={unitData}
          columns={columns}
          pagination={false}
          size="small"
          showHeader={false}
        />
      </Card>
    </div>
  );
};
