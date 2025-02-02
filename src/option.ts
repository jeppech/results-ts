import { Err, Ok, Result } from './result.js';

enum OptionType {
  None,
  Some,
}

export type Option<T> = _Some<T> | _None<T>;

abstract class BaseOption<T> {
  // This is needed to make the type guard work
  abstract readonly type: OptionType;

  /**
   * Asserts that the value is a `Some` variant.
   */
  is_some(): this is _Some<T> {
    return this instanceof _Some;
  }

  /**
   * Asserts that the value is a `None` variant.
   */
  is_none(): this is _None<T> {
    return this instanceof _None;
  }

  /**
   * Returns `true` if the option is a `Some` variant, and the inner value is equal to the given value.
   */
  eq(val: T): this is _Some<T> {
    return this.is_some() && this.unwrap() === val;
  }

  /**
   * Returns `true` if both variants are `Some` and the inner values are equal.
   */
  eq_some(val: Option<unknown>): this is _Some<T> {
    return this.is_some() && val.is_some() && this.unwrap() === val.unwrap();
  }

  /**
   * Returns `true` if both variants are `None`.
   */
  eq_none(val: Option<unknown>): this is _None<T> {
    return this.is_none() && val.is_none();
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
   * Transforms the Option<T> into a Result<T, E>. Mapping Some to Ok(v), and None to Err(err)
   */
  abstract ok_or<E>(err: E): Result<T, E>;

  /**
   * Returns the contained Some<T> value or computes a new Option<T> from the given closure.
   */
  abstract or_else(fn: () => Option<T>): Option<T>;

  /**
   * Maps the contained value to a new Option.
   */
  abstract map<U>(fn: (v: T) => U): Option<U>;

  /**
   * Maps the contained Some<T> to U, or returns opt
   */
  abstract map_or<U>(fn: (v: T) => U, opt: U): U;

  /**
   * Maps the contained Some value to a new Option<U> value.
   */
  abstract and_then<U>(fn: (val: T) => Option<U>): Option<U>;

  /**
   * Calls the given closure with the contained value if the value is a `Some` variant.
   */
  abstract inspect(fn: (val: T) => void): Option<T>;
}

class _Some<T> extends BaseOption<T> {
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

  ok_or<E>(err: E): Result<T, E> {
    return Ok(this.value);
  }

  or_else(fn: () => Option<T>): Option<T> {
    return this;
  }

  map<U>(fn: (v: T) => U): Option<U> {
    return Some(fn(this.value));
  }

  map_or<U>(fn: (v: T) => U, opt: U): U {
    return fn(this.value);
  }

  and_then<U>(fn: (val: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  inspect(fn: (val: T) => void): Option<T> {
    fn(this.value);
    return this;
  }

  toJSON() {
    return this.value;
  }

  toString() {
    if (typeof this.value === 'string') {
      return this.value;
    }

    return this.value?.toString() || '';
  }
}

class _None<T> extends BaseOption<T> {
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

  ok_or<E>(err: E): Result<T, E> {
    return Err(err);
  }

  or_else(fn: () => Option<T>): Option<T> {
    return fn();
  }

  map<U>(fn: (v: T) => U): Option<U> {
    return None;
  }

  map_or<U>(fn: (v: T) => U, opt: U): U {
    return opt;
  }

  and_then<U>(fn: (val: T) => Option<U>): Option<U> {
    return None;
  }

  inspect(fn: (val: T) => void): Option<T> {
    return this;
  }

  toJSON() {
    return undefined;
  }

  toString() {
    return '';
  }
}

export function Some<T>(value?: T): Option<T> {
  return value === undefined ? None : new _Some(value);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const None = new _None<any>();
