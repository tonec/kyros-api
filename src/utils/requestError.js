import { BadRequestError } from 'restify-errors'

export function createError(entity, error) {
  return new BadRequestError(
    {
      cause: error,
    },
    `${entity} not created`,
  )
}

export function validationError(entity, error) {
  return new BadRequestError(
    {
      cause: error,
    },
    `Validation failed creating ${entity}`,
  )
}

export function fetchError(entity, error) {
  return new BadRequestError(
    {
      cause: error,
    },
    `Error fetching ${entity}`,
  )
}

export function updateError(entity, error) {
  return new BadRequestError(
    {
      cause: error,
    },
    `Error updating ${entity}`,
  )
}

export function removeError(entity, error) {
  return new BadRequestError(
    {
      cause: error,
    },
    `Error removing ${entity}`,
  )
}
