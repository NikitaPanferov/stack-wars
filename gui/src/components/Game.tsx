import React, { useEffect, useRef, useState } from "react";
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
  ActionType,
  GameStatus,
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
    opacity?: SpringValue<number>;
  },
  config: Config,
  spacing?: number,
  actionState?: { [key: string]: string }
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
  const colorIntensity = Math.round((hpPercentage / 100) * 255);
  const color = `rgb(255, ${colorIntensity}, ${colorIntensity})`;

  const isAttacking =
    unit.type !== "walk_town" &&
    actionState &&
    actionState[unit.id] === "attacking";
  const isAttacked = actionState && actionState[unit.id] === "attacked";
  const isDodged =
    unit.type !== "walk_town" &&
    actionState &&
    actionState[unit.id] === "dodged";
  const isDead = actionState && actionState[unit.id] === "dead";
  const isArrowFrom = actionState && actionState[unit.id] === "arrowFrom";
  const isArrowTo = actionState && actionState[unit.id] === "arrowTo";
  const isClonedFrom = actionState && actionState[unit.id] === "clonedFrom";
  const isClonedTo = actionState && actionState[unit.id] === "clonedTo";
  const isHealedFrom = actionState && actionState[unit.id] === "healedFrom";
  const isHealedTo = actionState && actionState[unit.id] === "healedTo";

  let transformMove = "none";
  if (isAttacking) {
    transformMove =
      armyType === "alliance" ? "rotate(15deg)" : "rotate(-15deg)";
  }
  if (isAttacked || isArrowTo) {
    transformMove = "scale(1.2)";
  }
  if (isDodged) {
    transformMove = "translate(0, 10px)";
  }
  if (isDead) {
    transformMove = "scale(0.01)";
  }
  if (isArrowFrom || isClonedFrom || isHealedFrom) {
    transformMove = "translateY(-10px)";
  }

  return (
    <Tooltip title={unit.id} key={unit.id}>
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
          transform: transformMove,
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
            filter: isHealedTo ? `drop-shadow(0 0 10px rgb(0, 255, 0))` : isClonedTo ? `drop-shadow(0 0 10px rgb(0, 0, 255))` : isClonedTo ? `drop-shadow(0 0 10px rgb(255, 255, 0))` : `drop-shadow(0 0 10px ${color})`,
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

const renderArmyRow = (
  row: Unit[],
  containerWidth: number,
  rowIndex: number,
  armyType: ArmyType,
  maxHeight: number,
  springProps: {
    opacity?: SpringValue<number>;
  },
  config: Config,
  actionState?: { [key: string]: string }
) => {
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
        if (i === 0) {
          return renderUnit(
            armyType,
            unit,
            maxHeight,
            springProps,
            config,
            -20,
            actionState
          );
        }
        return renderUnit(
          armyType,
          unit,
          maxHeight,
          springProps,
          config,
          spacing,
          actionState
        );
      })}
    </div>
  );
};

const renderArmy = (
  armyType: ArmyType,
  army: Army,
  containerWidth: number,
  springProps: {
    opacity?: SpringValue<number>;
  },
  config: Config,
  actionState?: { [key: string]: string }
) => {
  const maxHeight = 128;

  return army.map((row, rowIndex) =>
    renderArmyRow(
      row,
      containerWidth,
      rowIndex,
      armyType,
      maxHeight,
      springProps,
      config,
      actionState
    )
  );
};

export type GameProps = {
  alliance: Army;
  horde: Army;
  config: Config;
  setAlliance: React.Dispatch<React.SetStateAction<Army>>;
  setHorde: React.Dispatch<React.SetStateAction<Army>>;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  setWinner: React.Dispatch<React.SetStateAction<string | null>>;
};

export const Game: React.FC<GameProps> = ({
  alliance,
  horde,
  config,
  setAlliance,
  setHorde,
  setGameStatus,
  setWinner,
}) => {
  const [width, setWidth] = useState(0);
  const divRef = useRef(null);

  const [actions, setActions] = useState<Action[]>([]);
  const [actionState, setActionState] = useState<{ [key: string]: string }>({});
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [pendingGameState, setPendingGameState] = useState<GameState | null>(
    null
  );

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
        actions &&
      actions.length > 0 &&
      currentActionIndex !== -1 &&
      currentActionIndex < actions.length
    ) {
      const action = actions[currentActionIndex];
      const newActionState: { [key: string]: string } = {};
      if (action.type === ActionType.attack) {
        newActionState[action.object] = "attacking";
        if (action.value === 0) {
          newActionState[action.subject] = "dodged";
        } else {
          newActionState[action.subject] = "attacked";
        }
      } else if (action.type === ActionType.death) {
        newActionState[action.subject] = "dead";
      } else if (action.type === ActionType.arrow) {
        newActionState[action.object] = "arrowFrom"
        newActionState[action.subject] = "arrowTo";
      } else if (action.type === ActionType.clone) {
        newActionState[action.object] = "clonedFrom";
        newActionState[action.subject] = "clonedTo";
      } else if (action.type === ActionType.heal) {
        newActionState[action.object] = "healedFrom";
        newActionState[action.subject] = "healedTo";
      } else if (action.type === ActionType.win) {
        setGameStatus(GameStatus.results);
        setWinner(action.object);
      }
      setActionState(newActionState);

      const actionTimeout = setTimeout(() => {
        setActionState({});
        if (action.type === ActionType.death) {
          setAlliance((prev) =>
            prev.map((row) => row.filter((unit) => unit.id !== action.subject))
          );
          setHorde((prev) =>
            prev.map((row) => row.filter((unit) => unit.id !== action.subject))
          );
        }
        const delayTimeout = setTimeout(() => {
          setCurrentActionIndex(currentActionIndex + 1);
        }, 500); // Задержка между действиями 500 мс

        return () => clearTimeout(delayTimeout);
      }, 200); // Длительность действия 200 мс

      return () => clearTimeout(actionTimeout);
    } else {
      setActionState({});
      if (pendingGameState) {
        setAlliance(pendingGameState.alliance);
        setHorde(pendingGameState.horde);
        setPendingGameState(null);
      }
      setCurrentActionIndex(-1);
    }
  }, [actions, currentActionIndex]);

  const [selectedStrategy, setSelectedStrategy] =
    useState<Strategy>("one_line");

  const setGameState = (gameState: GameState) => {
    console.log({ alliance, horde });

    setAlliance(gameState.alliance);
    setHorde(gameState.horde);
  };

  const nextStepMutation = useMutation(nextStep, {
    onSuccess: ({ data }) => {
      console.log(data);
      setPendingGameState(data.game_state);
      setActions(data.actions);
      setCurrentActionIndex(0);
    },
  });

  const undoMutation = useMutation(undo, {
    onSuccess: ({ data }) => {
      setPendingGameState(data.game_state);
      setActions(data.actions);
    },
  });

  const redoMutation = useMutation(redo, {
    onSuccess: ({ data }) => {
      setPendingGameState(data.game_state);
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
            alignItems: "flex-start",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "50%",
              display: "grid",
              gridTemplateRows: `repeat(${alliance.length}, 1fr)`,
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
                actionState
              )}
          </div>
          <div
            style={{
              width: "50%",
              display: "grid",
              gridTemplateRows: `repeat(${horde.length}, 1fr)`,
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
                actionState
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
