import pytest

from greet_cli.main import EXIT_OK, EXIT_USAGE, main


def test_prints_greeting_and_exits_ok(capsys: pytest.CaptureFixture[str]) -> None:
    exit_code = main(["Sam"])

    assert exit_code == EXIT_OK
    assert capsys.readouterr().out == "Hello, Sam!\n"


def test_reports_empty_name_on_stderr(capsys: pytest.CaptureFixture[str]) -> None:
    exit_code = main([" "])

    captured = capsys.readouterr()
    assert exit_code == EXIT_USAGE
    assert captured.out == ""
    assert "name must not be empty" in captured.err
