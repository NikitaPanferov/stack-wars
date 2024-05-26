from fastapi import APIRouter

from conf.config import SettingsBaseModel, Settings


router = APIRouter(prefix='/router')


@router.get('/')
async def get() -> SettingsBaseModel:
    return Settings()


@router.post('/')
async def post(settings: SettingsBaseModel):
    Settings.load_from_json(settings.json())
