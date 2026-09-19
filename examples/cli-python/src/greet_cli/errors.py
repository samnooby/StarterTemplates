class AppError(Exception):
    pass


class EmptyNameError(AppError):
    def __init__(self) -> None:
        super().__init__("name must not be empty")
