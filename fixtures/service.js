import faker from 'faker'
import Service from '../src/models/ServiceModel'
import Client from '../src/models/ClientModel'

export default () => {
  const exampleTypes = [
    'Wash & cut',
    'Hair cut & beard trim',
    'Highlights',
    'Dye',
    'Perm',
    'Hair straightening',
  ]

  exampleTypes.forEach(async type => {
    const randomClient = await Client.random()

    const service = new Service({
      name: type,
      description: faker.lorem.sentence(),
      client: randomClient._id,
    })

    await service
      .save()
      .then(success => null)
      .catch(err => {
        console.log(err)
      })
  })

  console.log('Services seeded...')
}
