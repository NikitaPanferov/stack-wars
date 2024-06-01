// SpriteFactoryMethod.ts
import { ArmyType, UnitType } from "../types";
import {
  AllianceSpriteFactory,
  HordeSpriteFactory,
  AbstractSpriteFactory,
} from ".";

class SpriteFactoryMethod {
  private allianceFactory: AbstractSpriteFactory;
  private hordeFactory: AbstractSpriteFactory;

  constructor() {
    this.allianceFactory = new AllianceSpriteFactory();
    this.hordeFactory = new HordeSpriteFactory();
  }

  createSprite(armyType: ArmyType, unitType: UnitType) {
    let factory: AbstractSpriteFactory;

    switch (armyType) {
      case "alliance":
        factory = this.allianceFactory;
        break;
      case "horde":
        factory = this.hordeFactory;
        break;
      default:
        throw new Error("Invalid army type");
    }

    switch (unitType) {
      case "archer":
        return factory.createArcher();
      case "heavy_swordsman":
        return factory.createHeavySwordsman();
      case "light_swordsman":
        return factory.createLightSwordsman();
      case "paladin":
        return factory.createPaladin();
      case "wizard":
        return factory.createWizard();
      case "walk_town":
        return factory.createWalkTown();
      default:
        throw new Error("Invalid unit type");
    }
  }
}

export const spriteFactory = new SpriteFactoryMethod();