export const OptionType = {
	Some: Symbol('_some'),
	None: Symbol('_none')
};

export type Option<T> = _Some<T> | _None<T>;

interface OptionSomeNone<T> {
	type: symbol;

	/**
	 * Returns the contained Some value. If called on a potential `None` variant, it'll fail at compile time.
	 */
	unwrap?: () => T;

	/**
	 * Asserts that the value is a `Some` variant.
	 */
	is_some(): this is _Some<T>;

	/**
	 * Asserts that the value is a `None` variant.
	 */
	is_none(): this is _None<T>;

	/**
	 * Returns the contained Some value or a provided default.
	 */
	unwrap_or(opt: T): T;

	/**
	 * Returns the contained Some value or computes it from the given closure.
	 */
	unwrap_or_else(fn: () => T): T;

	/**
	 * Returns the contained Some<T> value or computes a new Option<T> from the given closure.
	 */
	or_else(fn: () => Option<T>): Option<T>;

	/**
	 * Maps the contained value to a new value.
	 */
	map<U>(fn: (v: T) => U): Option<U>;

	/**
	 * Maps the contained Some value to a new Option<U> value.
	 */
	and_then<U>(fn: (val: T) => Option<U>): Option<U>;

	/**
	 * Calls the given closure with the contained value if the value is a `Some` variant.
	 */
	inspect(fn: (val: T) => void): Option<T>;
}

export class _Some<T> implements OptionSomeNone<T> {
	constructor(private value: T) {}

	get type(): typeof OptionType.Some {
		return OptionType.Some;
	}

	is_some(): this is _Some<T> {
		return true;
	}

	is_none(): this is _None<T> {
		return false;
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

export class _None<T> implements OptionSomeNone<T> {
	get type(): typeof OptionType.None {
		return OptionType.None;
	}

	is_some(): this is _Some<T> {
		return false;
	}

	is_none(): this is _None<T> {
		return true;
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
		return None();
	}

	and_then<U>(fn: (val: T) => Option<U>): Option<U> {
		return None();
	}

	inspect(fn: (val: T) => void): Option<T> {
		return this;
	}
}

export function Some<T>(value: T): Option<T> {
	return new _Some(value);
}

const _none_instance = new _None<any>();

export function None<T>(): Option<T> {
	return _none_instance;
}
