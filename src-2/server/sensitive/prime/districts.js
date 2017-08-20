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

  const $ = require

  const districtsPrototype = $('./entities-prototype')(_districts)

  return Object.create(districtsPrototype)
}
