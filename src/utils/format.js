
export default ({ action = 'store', omit = [], entity, data, req, res }) => {
  let response = {
    action,
    entity,
    meta: { entityCount: 1 },
    data: { entities: [] }
  }

  if (!Array.isArray(data)) {
    const dataObj = data.toObject()

    dataObj.id = dataObj._id

    delete dataObj._id
    delete dataObj.__v

    if (omit.length) {
      omit.forEach(key => {
        delete dataObj[key]
      })
    }

    response.data.entities.push(dataObj)

    return response
  }

  const parsed = JSON.parse(JSON.stringify(data))

  if (parsed.length > 0) {
    response.meta.entityCount = data.length

    response.data.entities = parsed.reduce((acc, item) => {
      const itemObj = item

      itemObj.id = itemObj._id

      delete itemObj._id
      delete itemObj.__v

      if (omit.length) {
        omit.forEach(key => {
          delete itemObj[key]
        })
      }

      return acc.concat(itemObj)
    }, [])

  } else {
    response = null
  }

  return response
}
