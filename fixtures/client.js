import faker from 'faker'
import Client from '../src/models/ClientModel'

export default async () => {
  for (let i = 0; i < 10; i++) {

    const client = new Client({
      name: faker.company.companyName(),
    })

    await client
      .save()
      .then(success => null)
      .catch(err => {
        console.log(err)
      })
  }
}
