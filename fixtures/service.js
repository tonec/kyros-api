import faker from 'faker'
import Service from '../src/models/ServiceModel'

export default () => {
  const exampleTypes = [
    'Wash & cut',
    'Hair cut & beard trim',
    'Highlights',
    'Dye',
    'Perm',
    'Hair straightening'
  ]

  exampleTypes.forEach(async type => {
    const service = new Service({
      name: type,
      description: faker.lorem.sentence(),
      client: ''
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
