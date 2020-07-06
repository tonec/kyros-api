import _get from 'lodash/get'
import qs from 'qs'

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

  const query = qs.parse(req.getQuery())
  const paginated = res.paginate.getPaginatedResponse(data)
  const parsed = JSON.parse(JSON.stringify(paginated))

  if (parsed.data.length > 0) {
    response.meta.entityCount = data.length

    response.data.entities = parsed.data.reduce((acc, item) => {
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

    response.pages = parsed.pages
    response.pages.perPage = _get(query, 'per_page')
  } else {
    response = null
  }

  return response
}
