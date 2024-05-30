import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import Spritesheet from "react-responsive-spritesheet";
import { Army, ArmyType, GameState, Strategy, UnitType } from "../types";
import { spriteFactory } from "../factories";
import { Tooltip, Select, Button, Card } from "antd";
import { useMutation } from "react-query";
import { nextStep, undo, redo, changeStrategy } from "../api";

const { Option } = Select;
const AnimatedSpritesheet = animated(Spritesheet);

const renderUnit = (
  armyType: ArmyType,
  unit: UnitType,
  maxHeight: number,
  spacing?: number
) => {
  const { image, width, height, steps, fps, offsetX, offsetY } =
    spriteFactory.createSprite(armyType, unit);
  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
    config: { duration: 500 },
  });
  const isLittleUnit = armyType === 'horde' && ["light_swordsman", "heavy_swordsman", "paladin"].includes(unit)
  // if (isLittleUnit) {
  //   spacing = spacing && spacing + 16
  // }

  return (
    <Tooltip title={unit} key={unit}>
      <div
        style={{
          width: width,
          height: maxHeight,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          marginRight: (armyType === "alliance" && spacing) || 0,
          marginLeft: (armyType === "horde" && spacing) || 0,
        }}
      >
        <AnimatedSpritesheet
          style={{
            ...springProps,
            width: width,
            height: height,
            transform: armyType === "horde" ? "scaleX(-1)" : "none",
            position: "absolute",
            left: offsetX || 0,
          }}
          className={`spritesheet-${armyType}-${unit}`}
          image={image}
          widthFrame={width}
          heightFrame={height}
          steps={steps}
          fps={fps}
          autoplay
          loop
        />
      </div>
    </Tooltip>
  );
};

const renderArmy = (armyType: ArmyType, army: Army, containerWidth: number) => {
  // находим максимальные высоту юнитов для корректного выравнивания
  const maxHeight = Math.max(
    ...army.flatMap((row) =>
      row.map((unit) => spriteFactory.createSprite(armyType, unit.type).height)
    )
  );

  return army.map((row, rowIndex) => {
    // вычисляем общую ширину юнитов в строке и соответствующий spacing
    const rowUnitWidths = row.map(
      (unit) => spriteFactory.createSprite(armyType, unit.type).width
    );

    const totalRowUnitWidth = rowUnitWidths.reduce(
      (acc, width) => acc + width,
      0
    );
    let spacing = (containerWidth - totalRowUnitWidth) / (row.length - 1);
    if (spacing > 0) {
      spacing = 0;
    }

    return (
      <div
        key={`row-${rowIndex}`}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: armyType === "alliance" ? "row-reverse" : "row",
          flexWrap: "nowrap",
        }}
      >
        {row.map((unit, i) => {
          if (i === 0) {
            return renderUnit(armyType, unit.type, maxHeight, -20);
          }
          return renderUnit(armyType, unit.type, maxHeight, spacing);
        })}
      </div>
    );
  });
};

export type GameProps = {
  alliance: Army;
  horde: Army;
  setAlliance: React.Dispatch<React.SetStateAction<Army>>;
  setHorde: React.Dispatch<React.SetStateAction<Army>>;
};

export const Game: React.FC<GameProps> = ({
  alliance,
  horde,
  setAlliance,
  setHorde,
}) => {
  const [width, setWidth] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    const handleResize = (entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        resizeObserver.unobserve(divRef.current);
      }
    };
  }, []);

  const [selectedStrategy, setSelectedStrategy] =
    useState<Strategy>("one_line");

  const setGameState = (gameState: GameState) => {
    setAlliance(gameState.alliance);
    setHorde(gameState.horde);
  };

  const nextStepMutation = useMutation(nextStep, {
    onSuccess: ({ data: newGameState }) => {
      setGameState(newGameState);
    },
  });

  const undoMutation = useMutation(undo, {
    onSuccess: ({ data: newGameState }) => {
      setGameState(newGameState);
    },
  });

  const redoMutation = useMutation(redo, {
    onSuccess: ({ data: newGameState }) => {
      setGameState(newGameState);
    },
  });

  const changeStrategyMutation = useMutation(
    () => changeStrategy(selectedStrategy),
    {
      onSuccess: ({ data: newGameState }) => {
        setGameState(newGameState);
      },
    }
  );

  return (
    <Card>
      <div ref={divRef}>
        <div
          style={{
            minHeight: 600,
            backgroundColor: "#758D45",
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div>{renderArmy("alliance", alliance, width / 2)}</div>
          <div>{renderArmy("horde", horde, width / 2)}</div>
        </div>
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
          <Button
            onClick={() => nextStepMutation.mutate()}
            style={{ marginRight: "10px" }}
          >
            Следующий ход
          </Button>
          <Button
            onClick={() => undoMutation.mutate()}
            style={{ marginRight: "10px" }}
          >
            Отменить ход
          </Button>
          <Button
            onClick={() => redoMutation.mutate()}
            style={{ marginRight: "10px" }}
          >
            Повторить ход
          </Button>
          <div>
            <Select
              value={selectedStrategy}
              onChange={(value: Strategy) => setSelectedStrategy(value)}
              style={{ width: "200px", marginLeft: "10px" }}
            >
              <Option value="one_line">Одна линия</Option>
              <Option value="multi_line">Много линий</Option>
              <Option value="wall_to_wall">Стена на стену</Option>
            </Select>
            <Button
              onClick={() => changeStrategyMutation.mutate()}
              style={{ marginLeft: "10px" }}
            >
              Поменять стратегию
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
