import pytest

from greet_cli.errors import EmptyNameError
from greet_cli.greeting import greeting_for


def test_greets_by_name() -> None:
    assert greeting_for("Sam") == "Hello, Sam!"


def test_trims_surrounding_whitespace() -> None:
    assert greeting_for("  Sam  ") == "Hello, Sam!"


def test_shouts_when_asked() -> None:
    assert greeting_for("Sam", shout=True) == "HELLO, SAM!"


def test_rejects_an_empty_name() -> None:
    with pytest.raises(EmptyNameError):
        greeting_for("   ")
