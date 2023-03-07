export const OptionType = {
	Some: Symbol('_some'),
	None: Symbol('_none')
};

export type Option<T> = _Some<T> | _None<T>;

interface OptionSomeNone<T> {
	type: symbol;

	unwrap?: () => T;

	is_some(): this is _Some<T>;
	is_none(): this is _None<T>;

	map<U>(fn: (v: T) => U): Option<U>;
	and_then<U>(fn: (val: T) => Option<U>): Option<U>;
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

	map<U>(fn: (v: T) => U): Option<U> {
		return Some(fn(this.value));
	}

	and_then<U>(fn: (val: T) => Option<U>): Option<U> {
		return fn(this.value);
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

	map<U>(fn: (v: T) => U): Option<U> {
		return None();
	}

	and_then<U>(fn: (val: T) => Option<U>): Option<U> {
		return None();
	}
}

export function Some<T>(value: T): Option<T> {
	return new _Some(value);
}

const _none_instance = new _None<any>();

export function None<T>(): Option<T> {
	return _none_instance;
}
