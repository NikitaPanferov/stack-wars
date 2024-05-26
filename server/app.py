from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from conf.config import Settings
from server.routers.config import router as config_router


def start_up():
    Settings.load_from_yaml('conf/config.yaml')


app = FastAPI(on_startup=[start_up])

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(config_router)


