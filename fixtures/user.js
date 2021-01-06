import faker from 'faker'
import User from '../src/models/UserModel'
import Client from '../src/models/ClientModel'

export default async () => {
  const randomClient = await Client.random()

  const user = new User({
    firstName: 'Test',
    lastName: 'Tester',

    address1: '1 Some Street',
    address2: 'Some town',
    city: 'Some city',
    postcode: 'N1 2DS',

    email: 'test@test.com',
    password: '$2a$10$gdW96Pz2uRmkMg6Os9884OodWKdzeqWtYvdn5T0HNYQiu/ZIi6PC.',

    phone: '01234567890',
    dateOfBirth: '20/03/2000',

    super: true,
    // useGroup: randomClient._id,
    client: randomClient._id,
    permissions: 'admin',
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

      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),

      email: faker.internet.email(),
      password: '$2a$10$gdW96Pz2uRmkMg6Os9884OodWKdzeqWtYvdn5T0HNYQiu/ZIi6PC.',

      phone: faker.phone.phoneNumber(),
      dateOfBirth: '20/03/2000',

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
