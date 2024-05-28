import React from "react";
import { Row, Col, Tag, Button, Spin, Flex, Card } from "antd";
import { UnitSelector } from "./UnitSelector";
import { Config } from "../types";

interface ArmySelectionProps {
  data: Config | undefined;
  isLoading: boolean;
  error: any;
  alliance: string[];
  setAlliance: React.Dispatch<React.SetStateAction<string[]>>;
  horde: string[];
  setHorde: React.Dispatch<React.SetStateAction<string[]>>;
  onStartGame: () => void;
}

export const ArmySelection: React.FC<ArmySelectionProps> = ({
  data,
  isLoading,
  error,
  alliance,
  setAlliance,
  horde,
  setHorde,
  onStartGame,
}) => {
  const handleAddUnit = (
    unitName: string,
    armySetter: React.Dispatch<React.SetStateAction<string[]>>,
    selectedUnits: string[],
    army: keyof Config["forces"]
  ) => {
    const unitCost = data?.forces[army][unitName].cost || 0;
    const currentCost = selectedUnits.reduce(
      (acc, name) => acc + (data?.forces[army][name].cost || 0),
      0
    );
    if (currentCost + unitCost <= data!.capital) {
      armySetter([...selectedUnits, unitName]);
    }
  };

  const handleRemoveUnit = (
    unitName: string,
    armySetter: React.Dispatch<React.SetStateAction<string[]>>,
    selectedUnits: string[]
  ) => {
    const unitIndex = selectedUnits.lastIndexOf(unitName);
    if (unitIndex !== -1) {
      const newSelectedUnits = [...selectedUnits];
      newSelectedUnits.splice(unitIndex, 1);
      armySetter(newSelectedUnits);
    }
  };

  const handleRemoveSelectedUnit = (
    unitName: string,
    armySetter: React.Dispatch<React.SetStateAction<string[]>>,
    selectedUnits: string[]
  ) => {
    const unitIndex = selectedUnits.indexOf(unitName);
    if (unitIndex !== -1) {
      const newSelectedUnits = [...selectedUnits];
      newSelectedUnits.splice(unitIndex, 1);
      armySetter(newSelectedUnits);
    }
  };

  const remainingCapital = (
    selectedUnits: string[],
    army: keyof Config["forces"]
  ) => {
    const totalCost = selectedUnits.reduce(
      (acc, name) => acc + (data?.forces[army][name].cost || 0),
      0
    );
    return (data?.capital || 0) - totalCost;
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center">
        <Spin size="large" />
      </Flex>
    );
  }

  if (error) {
    return <div>Ошибка загрузки конфигурации</div>;
  }

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>Начать новую игру</h2>
      <Row gutter={16} style={{ marginBottom: "20px", width: "100%" }}>
        <Col
          span={12}
          style={{ borderRight: "1px solid #ddd", padding: "0 2rem" }}
        >
          <Tag
            color="blue"
            style={{
              margin: "1rem 0",
              fontSize: "1.5rem",
              height: "2.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 1rem",
            }}
          >
            Альянс
          </Tag>
          <UnitSelector
            units={data!.forces.alliance}
            selectedUnits={alliance}
            onAdd={(unitName) =>
              handleAddUnit(unitName, setAlliance, alliance, "alliance")
            }
            onRemove={(unitName) =>
              handleRemoveUnit(unitName, setAlliance, alliance)
            }
            remainingCapital={remainingCapital(alliance, "alliance")}
            onRemoveSelected={(unitName) =>
              handleRemoveSelectedUnit(unitName, setAlliance, alliance)
            }
          />
        </Col>
        <Col span={12} style={{ padding: "0 2rem" }}>
          <Tag
            color="red"
            style={{
              margin: "1rem 0",
              fontSize: "1.5rem",
              height: "2.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 1rem",
            }}
          >
            Орда
          </Tag>
          <UnitSelector
            units={data!.forces.horde}
            selectedUnits={horde}
            onAdd={(unitName) =>
              handleAddUnit(unitName, setHorde, horde, "horde")
            }
            onRemove={(unitName) => handleRemoveUnit(unitName, setHorde, horde)}
            remainingCapital={remainingCapital(horde, "horde")}
            onRemoveSelected={(unitName) =>
              handleRemoveSelectedUnit(unitName, setHorde, horde)
            }
          />
        </Col>
      </Row>
      <Button
        type="primary"
        size="large"
        onClick={onStartGame}
        disabled={alliance.length === 0 || horde.length === 0}
      >
        Начать новую игру!
      </Button>
    </Card>
  );
};
