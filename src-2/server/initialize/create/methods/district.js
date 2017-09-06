module.exports = function createRawDistrictMethods({id, $}) {

  const rawDistrictMethods = {

    id,

    $,

    _: './buffered'
  }

  return rawDistrictMethods
}
