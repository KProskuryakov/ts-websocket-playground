const BASE_POWER = 10;
const BASE_ARMOR = 5;
const BASE_HP = 50;
const BASE_ATKSPD = 2500;

export interface Character {
  name: string;
  power: number;
  armor: number;
  hp: number;
  attackSpeed: number;
  gold: number;
}

export function newCharacter(name: string): Character {
  return {
    name,
    power: BASE_POWER,
    armor: BASE_ARMOR,
    hp: BASE_HP,
    attackSpeed: BASE_ATKSPD,
    gold: 0
  }
}
