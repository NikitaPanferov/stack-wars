import React from "react";
import { Row, Col, Card, Table, Button } from "antd";
import { UnitConfig } from "../types";
import { UnitCard } from "./UnitCard";

interface UnitSelectorProps {
  units: Record<string, UnitConfig>;
  selectedUnits: string[];
  onAdd: (unitName: string) => void;
  onRemove: (unitName: string) => void;
  remainingCapital: number;
  onRemoveSelected: (unitName: string) => void;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({
  units,
  selectedUnits,
  onAdd,
  onRemove,
  remainingCapital,
  onRemoveSelected,
}) => {
  const unitCounts = selectedUnits.reduce((counts, unitName) => {
    counts[unitName] = (counts[unitName] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const selectedUnitData = selectedUnits.map((unitName, index) => ({
    key: index.toString(),
    name: unitName,
    count: unitCounts[unitName],
  }));

  const columns = [
    { title: "Тип юнита", dataIndex: "name", key: "name" },
    { title: "Общее количество", dataIndex: "count", key: "count" },
    {
      title: "",
      key: "action",
      render: (text: any, record: any) => (
        <Button
          type="dashed"
          onClick={() => onRemoveSelected(record.name)}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {Object.keys(units).map((unitName) => (
          <Col span={24} key={unitName}>
            <UnitCard
              unitName={unitName}
              unitConfig={units[unitName]}
              onAdd={onAdd}
              onRemove={onRemove}
              unitCount={unitCounts[unitName] || 0}
            />
          </Col>
        ))}
      </Row>
      <Card style={{ marginTop: "20px" }}>
        <h3>Выбранные юниты:</h3>
        <Table
          dataSource={selectedUnitData}
          columns={columns}
          pagination={false}
        />
        <h3>Оставшиеся деньги: {remainingCapital}</h3>
      </Card>
    </div>
  );
};
