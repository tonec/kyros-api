import ResourceType from '../src/models/ResourceTypeModel'

export default () => {
  const exampleTypes = [
    'Barber',
    'Colorist',
    'Stylist'
  ]

  exampleTypes.forEach(async exampleType => {

    const resourceType = new ResourceType({
      name: exampleType,
    })

    await resourceType
      .save()
      .then(success => null)
      .catch(err => {
        console.log(err)
      })
  })
}
