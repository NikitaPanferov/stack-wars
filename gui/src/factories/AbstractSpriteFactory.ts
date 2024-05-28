export abstract class AbstractSpriteFactory {
  abstract createArcher(): { image: string, width: number, height: number, steps: number, fps: number };
  abstract createHeavySwordsman(): { image: string, width: number, height: number, steps: number, fps: number };
  abstract createLightSwordsman(): { image: string, width: number, height: number, steps: number, fps: number };
  abstract createPaladin(): { image: string, width: number, height: number, steps: number, fps: number };
  abstract createWizard(): { image: string, width: number, height: number, steps: number, fps: number };
}

export class AllianceSpriteFactory extends AbstractSpriteFactory {
  createArcher() {
    return { image: "sprites/alliance/archer.png", width: 128, height: 128, steps: 7, fps: 6 };
  }
  createHeavySwordsman() {
    return { image: "sprites/alliance/heavy_swordsman.png", width: 128, height: 128, steps: 5, fps: 6 };
  }
  createLightSwordsman() {
    return { image: "sprites/alliance/light_swordsman.png", width: 128, height: 128, steps: 5, fps: 6 };
  }
  createPaladin() {
    return { image: "sprites/alliance/paladin.png", width: 128, height: 128, steps: 7, fps: 6 };
  }
  createWizard() {
    return { image: "sprites/alliance/wizard.png", width: 128, height: 128, steps: 7, fps: 6 };
  }
}

export class HordeSpriteFactory extends AbstractSpriteFactory {
  createArcher() {
    return { image: "sprites/horde/archer.png", width: 128, height: 128, steps: 7, fps: 6 };
  }
  createHeavySwordsman() {
    return { image: "sprites/horde/heavy_swordsman.png", width: 96, height: 96, steps: 5, fps: 6 };
  }
  createLightSwordsman() {
    return { image: "sprites/horde/light_swordsman.png", width: 96, height: 96, steps: 5, fps: 6 };
  }
  createPaladin() {
    return { image: "sprites/horde/paladin.png", width: 96, height: 96, steps: 5, fps: 6 };
  }
  createWizard() {
    return { image: "sprites/horde/wizard.png", width: 128, height: 128, steps: 7, fps: 6 };
  }
}