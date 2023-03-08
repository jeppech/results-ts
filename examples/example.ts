import { Ok, Err, type Result } from '../src';

// The generic `Result`-type must be set on the function signature
function greetings(name?: string): Result<string, Error> {
	if (name === 'jeppech') {
		return Err(new Error('I will not greet jeppech!'));
	}

	if (name === undefined) {
		return Ok('Guest');
	}

	return Ok(name);
}

// enable inlay hints in VSCode, to see the inferred types
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
