const Entities = require('./entities')

module.exports = function Districts(
  _districts = {
    status: [''],
    rooms: [[0]],
    characters: [[0]],
    vehicles: [[0]],
    unwelcomes: [[0]],
    scenery: [ // district
      [ // stratum
        [ // layer
          [ // row
            [ // column
              'images/background/far/above-top.png'
            ]
          ]
        ]
      ]
    ],
    collision: [ // district
      [ // stratum
        [ // layer
          [ // row
            [ // column
              [0]
            ]
          ]
        ]
      ]
    ]
  }
) {
  const districts = Entities(_districts)
  return Object.freeze(Object.create(districts))
}
