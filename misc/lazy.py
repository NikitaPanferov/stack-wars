def lazy(cls):
    class LazyClass:
        def __init__(self, *args, **kwargs):
            self._instance = None
            self._cls = cls
            self._args = args
            self._kwargs = kwargs

        def __getattr__(self, item):
            if self._instance is None:
                field = self._kwargs.get(item)
                if field:
                    return field
                print(f"Инициализация объекта класса {self._cls.__name__}...")
                self._instance = self._cls(*self._args, **self._kwargs)
            return getattr(self._instance, item)

    return LazyClass
