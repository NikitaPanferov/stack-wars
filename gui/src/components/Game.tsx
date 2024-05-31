import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSpring, animated, SpringValue } from "react-spring";
import Spritesheet from "react-responsive-spritesheet";
import {
  Action,
  Army,
  ArmyType,
  Config,
  GameState,
  Strategy,
  Unit,
} from "../types";
import { spriteFactory } from "../factories";
import { Tooltip, Card } from "antd";
import { useMutation } from "react-query";
import { nextStep, undo, redo, changeStrategy } from "../api";
import { ActionPanel } from "./ActionPanel";
import { ActionList } from "./ActionList";

const AnimatedSpritesheet = animated(Spritesheet);

const renderUnit = (
  armyType: ArmyType,
  unit: Unit,
  maxHeight: number,
  springProps: {
    opacity: SpringValue<number>;
  },
  config: Config,
  spacing?: number,
  attackState?: { [key: string]: string }
) => {
  const { image, width, height, steps, fps, offsetX, offsetY } =
    spriteFactory.createSprite(armyType, unit.type);
  const isLittleUnit =
    armyType === "horde" &&
    ["light_swordsman", "heavy_swordsman", "paladin"].includes(unit.type);
  if (isLittleUnit) {
    spacing = spacing && spacing + 16;
  }

  const maxHP = config.forces[armyType][unit.type].hp;
  const hpPercentage = unit.hp && maxHP ? (unit.hp / maxHP) * 100 : 100;
  const colorIntensity = 255 - Math.round((hpPercentage / 100) * 255);
  const color = `rgb(255, ${colorIntensity}, ${colorIntensity})`;

  const isAttacking = attackState && attackState[unit.id] === "attacking";
  const isAttacked = attackState && attackState[unit.id] === "attacked";

  return (
    <Tooltip title={unit.type} key={unit.id}>
      <div
        style={{
          width: width,
          height: maxHeight,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          marginRight:
            (armyType === "alliance" ? spacing : isLittleUnit && 16) || 0,
          marginLeft: (armyType === "horde" && spacing) || 0,
          transform: isAttacking
            ? armyType == "alliance"
              ? "rotate(15deg)"
              : "rotate(-15deg)"
            : "none",
          transition: "transform 200ms ease-in",
          transformOrigin: "bottom",
        }}
        id={unit.id}
      >
        <AnimatedSpritesheet
          style={{
            ...springProps,
            width: width,
            height: height,
            transform: armyType === "horde" ? "scaleX(-1)" : "none",
            position: "absolute",
            left: offsetX || 0,
            filter: `drop-shadow(0 0 10px ${color})`,
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

const renderArmy = (
  armyType: ArmyType,
  army: Army,
  containerWidth: number,
  springProps: {
    opacity: SpringValue<number>;
  },
  config: Config,
  attackState?: { [key: string]: string }
) => {
  const maxHeight = 128;

  return army.map((row, rowIndex) => {
    const totalRowUnitWidth = row.length * 128;
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
          return useMemo(() => {
            if (i === 0) {
              return renderUnit(
                armyType,
                unit,
                maxHeight,
                springProps,
                config,
                -20,
                attackState
              );
            }
            return renderUnit(
              armyType,
              unit,
              maxHeight,
              springProps,
              config,
              spacing,
              attackState
            );
          }, [unit, attackState]);
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
  config: Config;
};

export const Game: React.FC<GameProps> = ({
  alliance,
  horde,
  setAlliance,
  setHorde,
  config,
}) => {
  const [width, setWidth] = useState(0);
  const divRef = useRef(null);

  const [actions, setActions] = useState<Action[]>([]);
  const [attackState, setAttackState] = useState<{ [key: string]: string }>({});
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
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

  useEffect(() => {
    if (
      actions.length > 0 &&
      currentActionIndex !== -1 &&
      currentActionIndex < actions.length
    ) {
      const action = actions[currentActionIndex];
      const newAttackState: { [key: string]: string } = {};
      if (action.type === "attack") {
        newAttackState[action.subject] = "attacking";
        newAttackState[action.object] = "attacked";
      }
      setAttackState(newAttackState);

      const attackTimeout = setTimeout(() => {
        setAttackState({});
        const delayTimeout = setTimeout(() => {
          setCurrentActionIndex(currentActionIndex + 1);
        }, 500); // Задержка между атаками 500 мс

        return () => clearTimeout(delayTimeout);
      }, 200); // Длительность атаки 200 мс

      return () => clearTimeout(attackTimeout);
    } else {
      setAttackState({});
      setCurrentActionIndex(-1);
    }
  }, [actions, currentActionIndex]);

  const [selectedStrategy, setSelectedStrategy] =
    useState<Strategy>("one_line");

  const setGameState = (gameState: GameState) => {
    setAlliance(gameState.alliance);
    setHorde(gameState.horde);
  };

  const nextStepMutation = useMutation(nextStep, {
    onSuccess: ({ data }) => {
      console.log(data);
      setGameState(data.game_state);
      setActions(data.actions);
      setCurrentActionIndex(0);
    },
  });

  const undoMutation = useMutation(undo, {
    onSuccess: ({ data }) => {
      setGameState(data.game_state);
      setActions(data.actions);
    },
  });

  const redoMutation = useMutation(redo, {
    onSuccess: ({ data }) => {
      setGameState(data.game_state);
      setActions(data.actions);
    },
  });

  const changeStrategyMutation = useMutation(
    () => changeStrategy(selectedStrategy),
    {
      onSuccess: ({ data }) => {
        setGameState(data.game_state);
      },
    }
  );

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
    config: { duration: 500 },
  });

  return (
    <Card>
      <div ref={divRef}>
        <div
          style={{
            minHeight: 300,
            backgroundColor: "#758D45",
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {alliance &&
              config &&
              renderArmy(
                "alliance",
                alliance,
                width / 2,
                springProps,
                config,
                attackState
              )}
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            {horde &&
              config &&
              renderArmy(
                "horde",
                horde,
                width / 2,
                springProps,
                config,
                attackState
              )}
          </div>
        </div>
        <ActionPanel
          nextStep={nextStepMutation.mutate}
          undoStep={undoMutation.mutate}
          redoStep={redoMutation.mutate}
          changeStrategy={changeStrategyMutation.mutate}
          selectedStrategy={selectedStrategy}
          setSelectedStrategy={setSelectedStrategy}
        />
        <ActionList actions={actions} />
      </div>
    </Card>
  );
};
