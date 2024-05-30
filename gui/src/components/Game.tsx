import React from "react";
import { useSpring, animated } from "react-spring";
import Spritesheet from "react-responsive-spritesheet";
import { Army, ArmyType, UnitType } from "../types";
import { spriteFactory } from "../factories";
import { Tooltip } from "antd";

const AnimatedSpritesheet = animated(Spritesheet);

const renderUnit = (
  armyType: ArmyType,
  unit: UnitType,
  maxHeight: number,
  spacing?: number
) => {
  console.log({ spacing });

  const { image, width, height, steps, fps, offsetX, offsetY } =
    spriteFactory.createSprite(armyType, unit);
  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
    config: { duration: 500 },
  });

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
  // находим максимальные высоту и ширину юнитов для корректного выравнивания
  const maxHeight = Math.max(
    ...army.flatMap((row) =>
      row.map((unit) => spriteFactory.createSprite(armyType, unit.type).height)
    )
  );

  const unitWidths = army.flatMap((row) =>
    row.map((unit) => spriteFactory.createSprite(armyType, unit.type).width)
  );

  const totalUnitWidth = unitWidths.reduce((acc, width) => acc + width, 0);
  let spacing = (containerWidth - totalUnitWidth) / (army[0].length - 1);

  console.log({ spacing });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: armyType === "alliance" ? "row-reverse" : "row",
        flexWrap: "nowrap",
      }}
    >
      {army.flatMap((row) =>
        row.map((unit, i) => {
          console.log({unit, i});
          if (i === 0) {
            return renderUnit(armyType, unit.type, maxHeight, 0);
          }
          return renderUnit(armyType, unit.type, maxHeight, spacing);
        })
      )}
    </div>
  );
};

export type GameProps = {
  alliance: Army;
  horde: Army;
};

export const Game: React.FC<GameProps> = ({ alliance, horde }) => {
  const containerWidth = 1000; // ширина контейнера
  console.log({alliance});
  

  return (
    <div
      style={{
        width: containerWidth,
        height: 600,
        backgroundColor: "#10bb99",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div>{renderArmy("alliance", alliance, containerWidth / 2)}</div>
      <div>{renderArmy("horde", horde, containerWidth / 2)}</div>
    </div>
  );
};
