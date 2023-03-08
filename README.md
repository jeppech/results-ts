# Results

Utility functions for creating and handling Rust-like Result and Options types.

# Example

Try enabling `inlay` types in your IDE. The inferred types, should match the comments.

```ts
import { Ok, Err, type Result } from '@jeppech/results-ts';

// The generic `Result`-type (or `Option`-type) must be explicitly set on function signatures.
// Otherwise typescript will infer the underlaying Union type instead.
function greetings(name?: string): Result<string, Error> {
  if (name === 'jeppech') {
    return Err(new Error('I will not greet jeppech!'));
  }

  if (name === undefined) {
    return Ok('Guest');
  }

  return Ok(name);
}

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

// Option<string>
const o1 = t4;

// `is_some` and `is_none` can be used to narrow the type
if (o1.is_none()) {
  // NoneOption<string>
  const o2 = o1;
} else {
  // SomeOption<string>
  const o2 = o1;
}

// string  |- this is a Result<string, Error>
const e1 = t1.expect("we do not expect the name to be 'jeppech'. This throws!");

// string  |- this is an Option<string>
const e2 = o1.expect('this does not throw, because the option is not None.');
```

# Acknowledgement

- This is inspired by the [Monads](https://github.com/sniptt-official/monads) project
