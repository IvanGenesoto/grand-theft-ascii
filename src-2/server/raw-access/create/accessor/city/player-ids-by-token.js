module.exports = function createPlayerIDsByToken($, _) {

  const _playerIDsByToken = {'': 0}

  return {

    get: (token) => _playerIDsByToken[token],

    add(id, token) {
      const entityType = this.entityType
      $(_ + 'filter/typeof-value')(id, 'integer', '', 'id', entityType)
      $(_ + 'filter/typeof-value')(token, false, 'string', 'token', entityType)
      _playerIDsByToken[token] = id
    }
  }
}
