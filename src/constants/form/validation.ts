export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g
export const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/g
export const CURRENCY = /^-?(?:0|[1-9]\d{0,2}(?:,?\d{3})*)(?:\.\d+)?$/g
export const NOT_EMPTY = /([^\s])/
export const POSTAL_CODE = /^[0-9]{6}(?:-[0-9]{5})?$/
