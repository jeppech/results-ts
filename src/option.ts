enum OptionType {
	Some,
	None,
}

export type Option<T> = SomeOption<T> | NoneOption<T>;

abstract class BaseOption<T> {
	// This is needed to make the type guard work
	abstract readonly type: OptionType;

	/**
	 * Asserts that the value is a `Some` variant.
	 */
	is_some(): this is SomeOption<T> {
		return this instanceof SomeOption;
	}

	/**
	 * Asserts that the value is a `None` variant.
	 */
	is_none(): this is NoneOption<T> {
		return this instanceof NoneOption;
	}

	/**
	 * Returns the contained Some value.
	 * If called on a potential `None` variant, Typescript will throw an error.
	 */
	unwrap?(): T;
	/**
	 * Returns the contained Some value. Throws an error if the Option is a `None` variant
	 *
	 * It's not recommended to catch this error, as it's meant to stop the execution of the program.
	 * @throws {Error} with the given message
	 */
	abstract expect(msg: string): T;

	/**
	 * Returns the contained Some value or a provided default.
	 */
	abstract unwrap_or(opt: T): T;

	/**
	 * Returns the contained Some value or computes it from the given closure.
	 */
	abstract unwrap_or_else(fn: () => T): T;

	/**
	 * Returns the contained Some<T> value or computes a new Option<T> from the given closure.
	 */
	abstract or_else(fn: () => Option<T>): Option<T>;

	/**
	 * Maps the contained value to a new value.
	 */
	abstract map<U>(fn: (v: T) => U): Option<U>;

	/**
	 * Maps the contained Some value to a new Option<U> value.
	 */
	abstract and_then<U>(fn: (val: T) => Option<U>): Option<U>;

	/**
	 * Calls the given closure with the contained value if the value is a `Some` variant.
	 */
	abstract inspect(fn: (val: T) => void): Option<T>;
}

class SomeOption<T> extends BaseOption<T> {
	readonly type = OptionType.Some;

	constructor(private value: T) {
		super();
	}

	expect(msg: string): T {
		return this.value;
	}

	unwrap(): T {
		return this.value;
	}

	unwrap_or(opt: T): T {
		return this.value;
	}

	unwrap_or_else(fn: () => T): T {
		return this.value;
	}

	or_else(fn: () => Option<T>): Option<T> {
		return this;
	}

	map<U>(fn: (v: T) => U): Option<U> {
		return Some(fn(this.value));
	}

	and_then<U>(fn: (val: T) => Option<U>): Option<U> {
		return fn(this.value);
	}

	inspect(fn: (val: T) => void): Option<T> {
		fn(this.value);
		return this;
	}
}

class NoneOption<T> extends BaseOption<T> {
	readonly type = OptionType.None;

	expect(msg: string): T {
		throw new Error(msg);
	}

	unwrap_or(opt: T): T {
		return opt;
	}

	unwrap_or_else(fn: () => T): T {
		return fn();
	}

	or_else(fn: () => Option<T>): Option<T> {
		return fn();
	}

	map<U>(fn: (v: T) => U): Option<U> {
		return None;
	}

	and_then<U>(fn: (val: T) => Option<U>): Option<U> {
		return None;
	}

	inspect(fn: (val: T) => void): Option<T> {
		return this;
	}
}

export function Some<T>(value?: T): Option<T> {
	return value === undefined ? None : new SomeOption(value);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const None = new NoneOption<any>();
