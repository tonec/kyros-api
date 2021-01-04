import faker from 'faker'
import Client from '../src/models/ClientModel'

export default async () => {
  const client = new Client({ name: 'Test client' })

  await client
    .save()
    .then(success => null)
    .catch(err => {
      console.log(err)
    })

  for (let i = 0; i < 4; i++) {
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

  console.log('Clients seeded...')
}
