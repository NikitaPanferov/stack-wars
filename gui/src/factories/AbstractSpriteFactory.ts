export type UnitSprite = {
  image: string;
  width: number;
  height: number;
  steps: number;
  fps: number;
  offsetX?: number;
  offsetY?: number;
};

export abstract class AbstractSpriteFactory {
  abstract createArcher(): UnitSprite;
  abstract createHeavySwordsman(): UnitSprite;
  abstract createLightSwordsman(): UnitSprite;
  abstract createPaladin(): UnitSprite;
  abstract createWizard(): UnitSprite;
  abstract createWalkTown(): UnitSprite;
}

export class AllianceSpriteFactory extends AbstractSpriteFactory {
  createArcher() {
    return {
      image: "sprites/alliance/archer.png",
      width: 128,
      height: 128,
      steps: 7,
      fps: 6,
    };
  }
  createHeavySwordsman() {
    return {
      image: "sprites/alliance/heavy_swordsman.png",
      width: 128,
      height: 128,
      steps: 5,
      fps: 6,
    };
  }
  createLightSwordsman() {
    return {
      image: "sprites/alliance/light_swordsman.png",
      width: 128,
      height: 128,
      steps: 5,
      fps: 6,
      offsetX: 32,
    };
  }
  createPaladin() {
    return {
      image: "sprites/alliance/paladin.png",
      width: 128,
      height: 128,
      steps: 7,
      fps: 6,
      offsetX: 12,
    };
  }
  createWizard() {
    return {
      image: "sprites/alliance/wizard.png",
      width: 128,
      height: 128,
      steps: 7,
      fps: 6,
      offsetX: 10,
    };
  }
  createWalkTown() {
      return {
        image: "sprites/alliance/walk_town.png",
        width: 128,
        height: 128,
        steps: 11,
        fps: 30,
        offsetX: 0,
      }
  }
}

export class HordeSpriteFactory extends AbstractSpriteFactory {
  createArcher() {
    return {
      image: "sprites/horde/archer.png",
      width: 128,
      height: 128,
      steps: 7,
      fps: 6,
    };
  }
  createHeavySwordsman() {
    return {
      image: "sprites/horde/heavy_swordsman.png",
      width: 96,
      height: 96,
      steps: 5,
      fps: 6,
    };
  }
  createLightSwordsman() {
    return {
      image: "sprites/horde/light_swordsman.png",
      width: 96,
      height: 96,
      steps: 5,
      fps: 6,
    };
  }
  createPaladin() {
    return {
      image: "sprites/horde/paladin.png",
      width: 96,
      height: 96,
      steps: 5,
      fps: 6,
    };
  }
  createWizard() {
    return {
      image: "sprites/horde/wizard.png",
      width: 128,
      height: 128,
      steps: 7,
      fps: 6,
    };
  }
  createWalkTown() {
    return {
      image: "sprites/horde/walk_town.png",
      width: 128,
      height: 128,
      steps: 11,
      fps: 30,
      offsetX: 0,
    }
}
}
