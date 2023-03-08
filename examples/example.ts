import { Ok, Err, Some, None, type Result, type Option } from '../src'

interface Server {
  address: string
  port: number
  password: Option<string>
}

function find_server(): Result<Server, Error> {
  if (Math.random() > 0.5) {
    return Ok({
      address: '8.8.8.8',
      port: 53,
      password: Some('secret'),
    })
  }

  return Err(new Error('no server found!'))
}


const srv = find_server()
  .inspect_err((e) => {
    if (e instanceof Error) {
      console.error('could not find server:', e.message)
    } else {
      console.error('unknown error:', e)
    }
  }).unwrap_or({
    address: 'localhost',
    port: 53,
    password: None()
  })

console.log(`
Server is located at: ${srv.address}:${srv.port}\n
The password is: ${srv.password.unwrap_or('N/A')}
`)
