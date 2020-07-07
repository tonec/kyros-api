import faker from 'faker'
import User from '../models/UserModel'

export default async () => {
  for (let i = 0; i < 100; i++) {

    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'password',
      super: faker.random.boolean(),
    })

    await user
      .save()
      .then(success => null)
      .catch(err => {
        console.log(err)
      })
  }
}
