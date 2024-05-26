from pydantic import BaseModel, Field


class ArmyDTO(BaseModel):
    archer: int = Field(default=0, ge=0)
    heavy_swordsman: int = Field(default=0, ge=0)
    light_swordsman: int = Field(default=0, ge=0)
    paladin: int = Field(default=0, ge=0)
    wizard: int = Field(default=0, ge=0)


class InitArmiesDTO(BaseModel):
    horde: ArmyDTO
    alliance: ArmyDTO
