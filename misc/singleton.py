from pydantic import BaseModel


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances or len(args) + len(kwargs):
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class SingletonBaseModelMeta(type(BaseModel), SingletonMeta):
    pass
