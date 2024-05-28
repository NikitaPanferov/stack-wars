import React from "react";
import { useSpring, animated } from "react-spring";
import Spritesheet from "react-responsive-spritesheet";
import { Army, ArmyType, UnitType } from "../types";
import { spriteFactory } from "../factories";

const unitSpacing = 5; // расстояние между юнитами

export type GameProps = {
  alliance: Army;
  horde: Army;
};

const AnimatedSpritesheet = animated(Spritesheet);

export const Game: React.FC<GameProps> = ({ alliance, horde }) => {
  const renderUnit = (armyType: ArmyType, unit: UnitType, x: number, y: number, maxHeight: number) => {
    const { image, width, height, steps, fps } = spriteFactory.createSprite(armyType, unit);
    const springProps = useSpring({
      to: { opacity: 1 },
      from: { opacity: 0 },
      reset: true,
      config: { duration: 500 }
    });

    const offsetY = maxHeight - height; // смещение по оси Y для выравнивания по нижнему краю

    return (
      <AnimatedSpritesheet
        style={{
          ...springProps,
          position: 'absolute',
          left: x,
          top: y + offsetY, // учитываем смещение по оси Y
          width: width,
          height: height,
          transform: armyType === 'horde' ? 'scaleX(-1)' : 'none'
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
    );
  };

  const renderArmy = (armyType: ArmyType, army: Army, xOffset: number, yOffset: number) => {
    // находим максимальную высоту юнитов для корректного выравнивания
    const maxHeight = Math.max(...army.flatMap(row => row.map(unit => spriteFactory.createSprite(armyType, unit.type).height)));

    return army.flatMap((row, rowIndex) =>
      row.map((unit, colIndex) => {
        const x = xOffset + colIndex * (unitSpacing + 64); // включая spacing и размер
        const y = yOffset + rowIndex * (maxHeight + unitSpacing); // учитываем максимальную высоту юнита
        return renderUnit(armyType, unit.type, x, y, maxHeight);
      })
    );
  };

  return (
    <div style={{ width: 800, height: 600, backgroundColor: '#10bb99', position: 'relative' }}>
      {renderArmy('alliance', alliance, 50, 50)}
      {renderArmy('horde', horde, 400, 50)}
    </div>
  );
};
