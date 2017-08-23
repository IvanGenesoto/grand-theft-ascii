module.exports = function District(
  _district = {
    index: 0,
    id: 0,
    status: '',
    scenery: [ // stratum
      [ // layer
        [ // row
          [ // column
            'images/background/far/above-top.png'
          ]
        ]
      ]
    ],
    collision: [ // stratum
      [ // layer
        [ // row
          [ // column
            [0]
          ]
        ]
      ]
    ]
  }
) {

  const $ = require

  const districtsPrototype = $('./entities-prototype')(_districts)

  return Object.create(districtsPrototype)
}
