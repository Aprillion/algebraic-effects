# JavaScript Algebraic Effects

Test implementation of concepts from https://overreacted.io/algebraic-effects-for-the-rest-of-us/ using only the language features available in 2019.

> NOT intended for production code, just exploration of the concepts!

## Usage

```bash
npm i @aprillion/algebraic-effects
```

```js
import {perform, withPerform, resumeWith} from 'algebraic-effects'

function getName(user) {
  let name = user.name
  if (name === null) {
    name = perform('ask_name')
  }
  return name
}

function makeFriends(user1, user2) {
  user1.friendNames.push(getName(user2))
  user2.friendNames.push(getName(user1))
}

const arya = {name: null, friendNames: []}
const gendry = {name: 'Gendry', friendNames: []}
withPerform(
  () => {
    makeFriends(arya, gendry)
  },
  effect => {
    if (effect === 'ask_name') {
      resumeWith('Arya Stark')
    }
  },
)
// expect(arya.friendNames).toEqual(['Gendry'])
// expect(gendry.friendNames).toEqual(['Arya Stark'])
```

See [index.test.js](./index.test.js) for more examples.

## Contribution

[GitHub Issues](../../issues) are welcome, but no promisses about response time.
