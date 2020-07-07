import faker from 'faker'
import Resource from '../src/models/ResourceModel'

export default () => {
  const exampleTypes = {
    Barber: [
      'Skin fade',
      'Hair cut',
      'Wash & cut',
      'Hair cut & beard trim'
    ],
    Colorist: [
      'Highlights',
      'Dye'
    ],
    Stylist: [
      'Perm',
      'Hair straightening'
    ]
  }

  Object.keys(exampleTypes).forEach(exampleType => {

    exampleTypes[exampleType].forEach(async type => {
      const resource = new Resource({
        name: type,
        description: faker.lorem.sentence(),
        resourceType: exampleType,
        client: ''
      })

      await resource
        .save()
        .then(success => null)
        .catch(err => {
          console.log(err)
        })
    })
  })
}
