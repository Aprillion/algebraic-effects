const {perform, withPerform, resumeWith} = require('algebraic-effects')

test('simple', () => {
  withPerform(() => expect(perform()).toBe(1), () => resumeWith(1))
  withPerform(() => expect(perform()).toBe('a'), () => resumeWith('a'))
})

test('from readme', () => {
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
  expect(arya.friendNames).toEqual(['Gendry'])
  expect(gendry.friendNames).toEqual(['Arya Stark'])
})

test('nested', done => {
  withPerform(
    () => {
      withPerform(
        () => {
          expect(perform('inner')).toBe('a')
          expect(perform('outer')).toBe('b')
          expect(perform('xyz')).toBe(undefined)
          done()
        },
        effect => {
          if (effect === 'inner') {
            resumeWith('a')
          }
        },
      )
    },
    effect => {
      withPerform(
        () => {
          if (effect === 'outer') {
            resumeWith(perform('expect c') === 'c' && 'b')
          }
        },
        effect => {
          if (effect === 'expect c') {
            resumeWith('c')
            resumeWith('d')
          } else {
            resumeWith('e')
          }
        },
      )
    },
  )
})
