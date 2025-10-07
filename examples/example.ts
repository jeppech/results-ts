import { Ok, Err, type Result, Some, None } from '../src';

function inner_error(): Result<number, Error> {
  return Err(new Error('Inner error occurred'));
}

// The generic `Result`-type must be set on the function signature
function greetings(name?: string): Result<string, Error> {
  const err = inner_error();

  if (err.is_err()) {
    return Err(err.unwrap_err());
  }

  const num = err.unwrap();

  if (name === 'jeppech') {
    return Err(new Error('I will not greet jeppech!'));
  }

  if (name === undefined) {
    return Ok('Guest');
  }

  return Ok(name);
}

function bool_test(): Result<boolean, Error> {
  return Ok(true);
}

const d = bool_test().unwrap_or(false);

// Try enabling inlayHints for JS/TS on the Language Server, to see the inferred types.
// https://google.com
// Result<string, Error>
const t1 = greetings('jeppech');
// Result<number, Error>
const t2 = greetings().map((name) => name.length);
// Result<string, string>
const t3 = greetings('admin').map_err((err) => err.message);
// Option<string>
const t4 = greetings('user').ok();

// `is_ok` and `is_err` can be used to narrow the type
if (t1.is_ok()) {
  // OkResult<string, Error>
  const t4 = t1;
} else {
  // ErrResult<string, Error>
  const t4 = t1;
}

if (t1.is_err()) {
  const t4 = t1;
} else {
  const t4 = t1;
}

// Option<string>
const o1 = t4;

// `is_some` and `is_none` can be used to narrow the type
if (o1.is_none()) {
  // NoneOption<string>
  const o2 = o1;
} else if (o1.is_some()) {
  // SomeOption<string>
  const o2 = o1;
} else {
  // never
  const o2 = o1;
}

// compare an option with a value
if (o1.eq('sup')) {
  // we can now safely unwrap o1
  const o2 = o1.unwrap();
}

// compare two options
if (o1.eq_some(t4)) {
  // we can now safely unwrap o1
  const o2 = o1.unwrap();
}

if (o1.eq_none(t4)) {
  // both options are None
}

// string
const e1 = t1.expect("we do not expect the name to be 'jeppech'. This throws!");
//         ^- this is a Result<string, Error>");

// string
const e2 = o1.expect('this does not throw, because the option is not None.');
//         ^- this is a Option<string>

// Result<void, never>
const void_result = Ok();
