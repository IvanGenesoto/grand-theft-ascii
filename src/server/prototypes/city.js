const backgroundLayers = [
  {
    id: 1,
    blueprints: [],
    tag: 'canvas',
    width: 16000,
    height: 8000,
    depth: 4,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 1,
            tag: 'img',
            src: 'images/background/far/above-top.png',
            width: 1024,
            height: 367
          }
        ]
      },
      {
        id: 2,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 4,
            tag: 'img',
            src: 'images/background/far/top/top.png',
            width: 1024,
            height: 260
          },
          {
            id: 2,
            prevalence: 1,
            tag: 'img',
            src: 'images/background/far/top/top-pink-jumbotron-left.png',
            width: 1024,
            height: 260
          },
          {
            id: 3,
            prevalence: 2,
            tag: 'img',
            src: 'images/background/far/top/top-pink-jumbotron-right.png',
            width: 1024,
            height: 260
          }
        ]
      },
      {
        id: 3,
        rowCount: 48,
        variations: [
          {
            id: 1,
            prevalence: 3,
            tag: 'img',
            src: 'images/background/far/middle/middle.png',
            width: 1024,
            height: 134
          },
          {
            id: 2,
            prevalence: 2,
            tag: 'img',
            src: 'images/background/far/middle/middle-pink-jumbotron-far-left.png',
            width: 1024,
            height: 134
          },
          {
            id: 3,
            prevalence: 1,
            tag: 'img',
            src: 'images/background/far/middle/middle-pink-jumbotron-left.png',
            width: 1024,
            height: 134
          },
          {
            id: 4,
            prevalence: 1,
            tag: 'img',
            src: 'images/background/far/middle/middle-pink-jumbotron-mid-left.png',
            width: 1024,
            height: 134
          },
          {
            id: 5,
            prevalence: 2,
            tag: 'img',
            src: 'images/background/far/middle/middle-pink-jumbotron-middle.png',
            width: 1024,
            height: 134
          },
          {
            id: 6,
            prevalence: 2,
            tag: 'img',
            src: 'images/background/far/middle/middle-pink-jumbotron-right.png',
            width: 1024,
            height: 134
          },
          {
            id: 7,
            prevalence: 3,
            tag: 'img',
            src: 'images/background/far/middle/middle-blue-jumbotron-left.png',
            width: 1024,
            height: 134
          },
          {
            id: 8,
            prevalence: 2,
            tag: 'img',
            src: 'images/background/far/middle/middle-blue-jumbotron-middle.png',
            width: 1024,
            height: 134
          },
          {
            id: 9,
            prevalence: 3,
            tag: 'img',
            src: 'images/background/far/middle/middle-blue-jumbotron-right.png',
            width: 1024,
            height: 134
          }
        ]
      },
      {
        id: 4,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 1,
            tag: 'img',
            src: 'images/background/far/bottom.png',
            width: 1024,
            height: 673
          }
        ]
      }
    ]
  },
  {
    id: 2,
    blueprints: [],
    y: 7050,
    tag: 'canvas',
    width: 24000,
    height: 8000,
    depth: 2,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            width: 1024,
            height: 768,
            prevalence: 1,
            tag: 'img',
            src: 'images/background/middle.png'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    blueprints: [],
    y: 7232,
    tag: 'canvas',
    width: 32000,
    height: 8000,
    depth: 1,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            width: 1408,
            height: 768,
            prevalence: 1,
            tag: 'img',
            src: 'images/background/near.png'
          }
        ]
      }
    ]
  }
]

const foregroundLayers = [
  {
    id: 1,
    blueprints: [],
    x: 0,
    y: 7456,
    width: 32000,
    height: 8000,
    depth: 0.5,
    tag: 'canvas',
    scale: 16,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/lamp/left.png',
            width: 144,
            height: 544
          },
          {
            id: 2,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/lamp/right.png',
            width: 144,
            height: 544
          }
        ]
      }
    ]
  },
  {
    id: 2,
    blueprints: [],
    x: 32000,
    y: 7456,
    width: 32000,
    height: 8000,
    depth: 0.5,
    tag: 'canvas',
    scale: 16,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/lamp/left.png',
            width: 144,
            height: 544
          },
          {
            id: 2,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/lamp/right.png',
            width: 144,
            height: 544
          }
        ]
      }
    ]
  },
  {
    id: 3,
    blueprints: [],
    x: 0,
    y: 6800,
    width: 32000,
    height: 8000,
    depth: 0.25,
    tag: 'canvas',
    scale: 64,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/up-left.png',
            width: 448,
            height: 1248
          },
          {
            id: 2,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/up-right.png',
            width: 448,
            height: 1248
          },
          {
            id: 3,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/down-left.png',
            width: 448,
            height: 1248
          },
          {
            id: 4,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/down-right.png',
            width: 448,
            height: 1248
          },
          {
            id: 5,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/left-up.png',
            width: 1248,
            height: 448
          },
          {
            id: 6,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/left-down.png',
            width: 1248,
            height: 448
          },
          {
            id: 7,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/right-up.png',
            width: 1248,
            height: 448
          },
          {
            id: 8,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/right-down.png',
            width: 1248,
            height: 448
          }
        ]
      }
    ]
  },
  {
    id: 4,
    blueprints: [],
    x: 32000,
    y: 6800,
    width: 32000,
    height: 8000,
    depth: 0.25,
    tag: 'canvas',
    scale: 64,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/up-left.png',
            width: 448,
            height: 1248
          },
          {
            id: 2,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/up-right.png',
            width: 448,
            height: 1248
          },
          {
            id: 3,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/down-left.png',
            width: 448,
            height: 1248
          },
          {
            id: 4,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/down-right.png',
            width: 448,
            height: 1248
          },
          {
            id: 5,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/left-up.png',
            width: 1248,
            height: 448
          },
          {
            id: 6,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/left-down.png',
            width: 1248,
            height: 448
          },
          {
            id: 7,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/right-up.png',
            width: 1248,
            height: 448
          },
          {
            id: 8,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/right-down.png',
            width: 1248,
            height: 448
          }
        ]
      }
    ]
  },
  {
    id: 5,
    blueprints: [],
    x: 64000,
    y: 6800,
    width: 32000,
    height: 8000,
    depth: 0.25,
    tag: 'canvas',
    scale: 64,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/up-left.png',
            width: 448,
            height: 1248
          },
          {
            id: 2,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/up-right.png',
            width: 448,
            height: 1248
          },
          {
            id: 3,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/down-left.png',
            width: 448,
            height: 1248
          },
          {
            id: 4,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/down-right.png',
            width: 448,
            height: 1248
          },
          {
            id: 5,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/left-up.png',
            width: 1248,
            height: 448
          },
          {
            id: 6,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/left-down.png',
            width: 1248,
            height: 448
          },
          {
            id: 7,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/right-up.png',
            width: 1248,
            height: 448
          },
          {
            id: 8,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/right-down.png',
            width: 1248,
            height: 448
          }
        ]
      }
    ]
  },
  {
    id: 6,
    blueprints: [],
    x: 96000,
    y: 6800,
    width: 32000,
    height: 8000,
    depth: 0.25,
    tag: 'canvas',
    scale: 64,
    sections: [
      {
        id: 1,
        rowCount: 1,
        variations: [
          {
            id: 1,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/up-left.png',
            width: 448,
            height: 1248
          },
          {
            id: 2,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/up-right.png',
            width: 448,
            height: 1248
          },
          {
            id: 3,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/down-left.png',
            width: 448,
            height: 1248
          },
          {
            id: 4,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/down-right.png',
            width: 448,
            height: 1248
          },
          {
            id: 5,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/left-up.png',
            width: 1248,
            height: 448
          },
          {
            id: 6,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/left-down.png',
            width: 1248,
            height: 448
          },
          {
            id: 7,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/right-up.png',
            width: 1248,
            height: 448
          },
          {
            id: 8,
            prevalence: 1,
            tag: 'img',
            src: 'images/foreground/arrow/right-down.png',
            width: 1248,
            height: 448
          }
        ]
      }
    ]
  }
]

export const city = {
  width: 32000,
  height: 8000,
  backgroundLayers,
  foregroundLayers
}
