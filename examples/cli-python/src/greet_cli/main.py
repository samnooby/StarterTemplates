import argparse
import sys
from collections.abc import Sequence

from greet_cli.errors import AppError
from greet_cli.greeting import greeting_for

EXIT_OK = 0
EXIT_USAGE = 2


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        print(greeting_for(args.name, shout=args.shout))
    except AppError as error:
        print(f"greet: {error}", file=sys.stderr)
        return EXIT_USAGE
    return EXIT_OK


def parse_args(argv: Sequence[str] | None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(prog="greet", description="Print a greeting.")
    parser.add_argument("name", help="who to greet")
    parser.add_argument("--shout", action="store_true", help="print in upper case")
    return parser.parse_args(argv)


if __name__ == "__main__":
    sys.exit(main())
