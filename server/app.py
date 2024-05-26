from fastapi import FastAPI

from conf.config import Settings
from server.routers.config import router as config_router


def start_up():
    Settings.load_from_yaml('conf/config.yaml')


app = FastAPI(on_startup=[start_up])

app.include_router(config_router)


