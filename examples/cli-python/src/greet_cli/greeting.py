from greet_cli.errors import EmptyNameError


def greeting_for(name: str, *, shout: bool = False) -> str:
    cleaned = name.strip()
    if not cleaned:
        raise EmptyNameError
    message = f"Hello, {cleaned}!"
    return message.upper() if shout else message
