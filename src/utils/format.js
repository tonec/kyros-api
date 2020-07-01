import omit from 'lodash/omit'
import _get from 'lodash/get'
import qs from 'qs'

export default (type, data, req, res) => {
  let response = { status: 'ok', code: 200 }
  const query = qs.parse(req.getQuery())

  const paginated = res.paginate.getPaginatedResponse(data)
  const parsed = JSON.parse(JSON.stringify(paginated))

  if (parsed.data.length > 0) {
    response[type] = parsed.data.reduce((acc, item) => {
      let newItem = {
        id: item._id,
        ...omit(item, ['_id', '__v'])
      }

      return acc.concat(newItem)
    }, [])
    response.pages = parsed.pages
    response.pages.total = data.length
    response.pages.perPage = _get(query, 'per_page')
  } else {
    response = null
  }

  return response
}
