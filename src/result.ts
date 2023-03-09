import { Some, None, type Option } from './option';

export enum ResultType {
	Ok,
	Err,
}

export type Result<T, E> = OkResult<T, E> | ErrResult<T, E>;

export function Ok<T>(value: T): Result<T, never> {
	return new OkResult(value);
}

export function Err<E>(error: E): Result<never, E> {
	return new ErrResult(error);
}

abstract class ResultBase<T, E> {
	abstract readonly type: ResultType;

	is_ok(): this is OkResult<T, E> {
		return this.type === ResultType.Ok;
	}

	is_err(): this is ErrResult<T, E> {
		return this.type === ResultType.Err;
	}

	/**
	 * Returns the contained Ok value.
	 * If called on a potential `Err` variant, it'll fail at compile time.
	 */
	unwrap?(): T;

	/**
	 * Returns the contained Err value.
	 * If called on a potential `Ok` variant, it'll fail at compile time.
	 */
	unwrap_err?(): E;

	/**
	 * Returns an Option<T> containing the value if the result is an `Ok` variant, otherwise returns None.
	 */
	abstract ok(): Option<T>;

	/**
	 * Returns an Option<E> containing the error if the result is `Err`, otherwise returns None.
	 */
	abstract err(): Option<E>;

	/**
	 * Returns the contained Ok value. Throws an error if the result is an `Err` variant.
	 *
	 * It's not recommended to catch this error, as it's meant to stop the execution of the program.
	 * @throws {Error} with the given message
	 */
	abstract expect(msg: string): T;

	/**
	 * Returns the contained Ok value or a provided default.
	 */
	abstract unwrap_or(opt: T): T;

	/**
	 * Returns the contained Ok value or computes it from the given closure.
	 */
	abstract unwrap_or_else(fn: (err: E) => T): T;

	/**
	 * Maps the contained Err value to a new Result<T, E>. Leaves the `Ok` value untouched.
	 */
	abstract or_else(fn: (err: E) => Result<T, E>): Result<T, E>;

	/**
	 * Maps the contained Ok<T> value to a new Ok<U> value. Leaves the `Err` value untouched.
	 */
	abstract map<U>(fn: (val: T) => U): Result<U, E>;

	/**
	 * Maps the contained Err<E> value to a new Err<F> value. Leaves the `Ok` value untouched.
	 */
	abstract map_err<F>(fn: (err: E) => F): Result<T, F>;

	/**
	 * Maps the Result<T, E> to Result<U, E> by applying a function to a contained Ok value, leaving an Err value untouched.
	 */
	abstract and_then<U>(fn: (val: T) => Result<U, E>): Result<U, E>;

	/**
	 * Calls the given closure with the contained value if the value is an `Ok` variant.
	 */
	abstract inspect(fn: (val: T) => void): Result<T, E>;

	/**
	 * Calls the given closure with the contained error if the value is an `Err` variant.
	 */
	abstract inspect_err(fn: (err: E) => void): Result<T, E>;
}

class OkResult<T, E> extends ResultBase<T, E> {
	public readonly type = ResultType.Ok;
	constructor(private value: T) {
		super();
	}

	ok(): Option<T> {
		return Some(this.value);
	}

	err(): Option<E> {
		return None;
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

	unwrap_or_else(fn: (err: E) => T): T {
		return this.value;
	}

	or_else(fn: (err: E) => Result<T, E>): Result<T, E> {
		return this;
	}

	map<U>(fn: (val: T) => U): Result<U, E> {
		return Ok(fn(this.value));
	}

	map_err<F>(fn: (err: E) => F): Result<T, F> {
		return this as unknown as Result<T, F>;
	}

	and_then<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
		return fn(this.value);
	}

	inspect(fn: (val: T) => void): Result<T, E> {
		fn(this.value);
		return this;
	}

	inspect_err(fn: (err: E) => void): Result<T, E> {
		return this;
	}
}

class ErrResult<T, E> extends ResultBase<T, E> {
	public readonly type = ResultType.Err;

	constructor(private error: E) {
		super();
	}

	ok(): Option<T> {
		return None;
	}

	err(): Option<E> {
		return Some(this.error);
	}

	expect(msg: string): T {
		throw new Error(msg);
	}

	unwrap_err(): E {
		return this.error;
	}

	unwrap_or(opt: T): T {
		return opt;
	}

	unwrap_or_else(fn: (err: E) => T): T {
		return fn(this.error);
	}

	or_else(fn: (err: E) => Result<T, E>): Result<T, E> {
		return fn(this.error);
	}

	map<U>(fn: (val: T) => U): Result<U, E> {
		// We could return a new instance of _Err, to satisfy the return type.
		// But instead we just return the same instance, since it's already an error.
		return this as unknown as Result<U, E>;
	}

	map_err<F>(fn: (err: E) => F): Result<T, F> {
		return Err(fn(this.error));
	}

	and_then<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
		return this as unknown as Result<U, E>;
	}

	inspect(fn: (val: T) => void): Result<T, E> {
		return this;
	}

	inspect_err(fn: (err: E) => void): Result<T, E> {
		fn(this.error);
		return this;
	}
}
