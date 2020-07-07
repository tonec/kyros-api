import faker from 'faker'
import User from '../src/models/UserModel'
import Client from '../src/models/ClientModel'

export default async () => {
  for (let i = 0; i < 100; i++) {

    const randomClient = await Client.random()

    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'password',
      super: faker.random.boolean(),
      client: randomClient._id
    })

    await user
      .save()
      .then(success => null)
      .catch(err => {
        console.log(err)
      })
  }

  console.log('Users seeded...')
}
