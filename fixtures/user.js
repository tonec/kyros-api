import faker from 'faker'
import User from '../src/models/UserModel'
import Client from '../src/models/ClientModel'

export default async () => {
  const randomClient = await Client.random()

  const user = new User({
    firstName: 'Test',
    lastName: 'Tester',
    email: 'test@test.com',
    password: '$2a$10$gdW96Pz2uRmkMg6Os9884OodWKdzeqWtYvdn5T0HNYQiu/ZIi6PC.',
    super: true,
    role: 'admin',
    client: randomClient._id,
  })

  await user
    .save()
    .then(success => null)
    .catch(err => {
      console.log(err)
    })

  for (let i = 0; i < 100; i++) {
    const randomClient = await Client.random()

    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: '$2a$10$gdW96Pz2uRmkMg6Os9884OodWKdzeqWtYvdn5T0HNYQiu/ZIi6PC.',
      super: faker.random.boolean(),
      role: faker.helpers.randomize(['admin', 'reception', 'host']),
      client: randomClient._id,
    })

    await user
      .save()
      .then(success => null)
      .catch(err => {
        console.log(err)
      })
  }

  console.log('Users seeded...')

  process.exit()
}
