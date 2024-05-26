from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from conf.config import Settings
from server.routers.config import router as config_router


def start_up():
    Settings.load_from_yaml('conf/config.yaml')


origins = [
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
    "http://localhost",
    "http://localhost:8000",
]


app = FastAPI(on_startup=[start_up])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(config_router)


