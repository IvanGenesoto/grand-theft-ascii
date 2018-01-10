module.exports = function createPlayerIDsByToken($) {

  const _playerIDsByToken = {'': 0}

  return {

    get: (token) => _playerIDsByToken[token],

    add(id, token) {
      const entityType = this.entityType
      $('./filter/typeof-value')(id, 'integer', '', 'id', entityType)
      $('./filter/typeof-value')(token, false, 'string', 'token', entityType)
      _playerIDsByToken[token] = id
    }
  }
}
