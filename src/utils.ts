import { Err, Ok, type Option, type Result } from './index.js';

export type Jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Jsonable[]
  | { readonly [key: string]: Jsonable }
  | { toJSON(): Jsonable };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
export type AsyncOption<T> = Promise<Option<T>>;

export function is_browser(): boolean {
  return typeof window !== 'undefined' || typeof document !== 'undefined';
}

export function base64_encode(val: string): Result<string, string> {
  try {
    if (is_browser()) {
      return Ok(window.btoa(val));
    } else {
      return Ok(Buffer.from(val).toString('base64'));
    }
  } catch (e) {
    if (e instanceof Error) {
      return Err(e.message);
    }
    return Err(String(e));
  }
}

export function base64_decode(val: string): Result<string, string> {
  try {
    if (is_browser()) {
      return Ok(window.atob(val));
    } else {
      return Ok(Buffer.from(val, 'base64').toString());
    }
  } catch (e) {
    if (e instanceof Error) {
      return Err(e.message);
    }
    return Err(String(e));
  }
}

export function json_stringify(data: Jsonable, pretty = false): Result<string, string> {
  try {
    if (!pretty) {
      return Ok(JSON.stringify(data));
    }
    return Ok(JSON.stringify(data, undefined, 2));
  } catch (err) {
    return format_exception('json_stringify error', err);
  }
}

export function json_parse<T>(
  text: string,
  reviver?: (this: unknown, key: string, value: unknown) => unknown,
): Result<T, string> {
  try {
    return Ok(JSON.parse(text, reviver));
  } catch (err) {
    return format_exception('json_parse error', err);
  }
}

function format_exception(msg: string, err: unknown): Result<never, string> {
  if (err instanceof Error) {
    return Err(`${msg}: ${err.message}`);
  }
  return Err(`${msg}: ${err}`);
}
