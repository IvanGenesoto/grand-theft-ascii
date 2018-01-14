module.exports = function createPlayerIDsByToken(modules) {
  const {filter} = modules.initialize

  const _playerIDsByToken = {'': 0}

  return {

    get: (token) => _playerIDsByToken[token],

    add(id, token) {
      const entityType = this.entityType
      filter.typeofValue(id, 'integer', '', 'id', entityType)
      filter.typeofValue(token, false, 'string', 'token', entityType)
      _playerIDsByToken[token] = id
    }
  }
}
