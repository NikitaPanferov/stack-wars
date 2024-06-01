def lazy(cls):
    class LazyClass:
        # __class__ = cls.__class__

        def __init__(self, *args, **kwargs):
            self._instance = None
            self._cls = cls
            self._args = args
            self._kwargs = kwargs

        def __getattr__(self, item):
            if self._instance is None:
                if field := self._kwargs.get(item):
                    return field
                print(f"Инициализация объекта класса {self._cls.__name__}...")
                self._instance = self._cls(*self._args, **self._kwargs)
            return getattr(self._instance, item)

    LazyClass.__name__ = cls.__name__
    LazyClass.__module__ = cls.__module__
    LazyClass.__qualname__ = cls.__qualname__

    return LazyClass
