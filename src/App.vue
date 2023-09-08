<script setup>
import Element from '@/components/Element.vue';
import GameOver from '@/components/GameOver.vue';
import { reactive, ref } from 'vue';

const refs = {
  ['cell-0-0']: ref(),
  ['cell-0-1']: ref(),
  ['cell-0-2']: ref(),
  ['cell-1-0']: ref(),
  ['cell-1-1']: ref(),
  ['cell-1-2']: ref(),
  ['cell-2-0']: ref(),
  ['cell-2-1']: ref(),
  ['cell-2-2']: ref(),
}

const defaultBoard = [
  [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
  [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
  [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
]

const board = ref([ ...defaultBoard ])

const game = reactive({
  score: 0,
  combo: 1,
  isGameOver: false,
})

const random = () => {
  const res = [0, 0, 0]

  const positions = {}
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const v = [[0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0], [1, 1, 1]].filter(val => {
        for (let i = 0; i < 3; i++) {
          if (board.value[row][col][i] > 0 && val[i] > 0) {
            return false
          }
        }
        return true
      })

      v.forEach(vv => {
        const mask = (vv[2] > 0 ? 1 : 0) + (vv[1] > 0 ? 1 : 0) * 2 + (vv[0] > 0 ? 1 : 0) * 4
        if (!positions['' + mask]) {
          positions['' + mask] = vv
        }
      })
    }
  }

  const keys = Object.keys(positions)
  if (keys.length <= 0) {
    return null
  }

  const pos = positions[keys[Math.floor(Math.random() * keys.length)]]
  for (let i = 0; i < 3; i++) {
    if (pos[i] === 1) {
      res[i] = Math.floor(Math.random() * 5) + 1
    }
  }

  return res
}

const nextElement = ref(random())

const isCurrent = (e, elem) => {
  const pos = e.target.getBoundingClientRect()
  const p = elem.getBoundingClientRect()
  const left = p.left - p.width / 2
  const right = p.right + p.width / 2
  const top = p.top - p.height / 2
  const bottom = p.bottom + p.height / 2
  return pos.left >= left && pos.top >= top && pos.right <= right && pos.bottom <= bottom
}

const isAllow = cell => {
  const v = cell.split('-')
  const boardCell = board.value[v[1]][v[2]]
  const elem = nextElement.value

  for (let i = 0; i < 3; i++) {
    if (boardCell[i] > 0 && elem[i] > 0) {
      return false
    }
  }

  return true
}

const newGame = () => {
  board.value = [ ...defaultBoard ]
  game.score = 0
  nextElement.value = random()
  game.isGameOver = false
}

const checkGame = () => {
  const b = [ ...board.value ]

  const variants = [
      // rows
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      // cols
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      // diag
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
  ]

  const remove = []
  variants.forEach(cells => {
    const colors = {}
    cells.forEach(coord => {
      for (let i = 0; i < 3; i++) {
        const color = b[coord[0]][coord[1]][i]
        if (color > 0) {
          colors['' + color] = (colors['' + color] || 0) + 1
        }
      }
    })

    Object.keys(colors).forEach(color => {
      if (colors[color] >= 3) {
        // only 1 or all!!!
        let count = 0
        cells.forEach(coord => {
          for (let i = 0; i < 3; i++) {
            if (b[coord[0]][coord[1]][i] === +color) {
              count++
              break
            }
          }
        })

        if (count === 1 || count === 3) {
          cells.forEach(coord => {
            remove.push([ ...coord, +color ])
          })
        }
      }
    })
  })

  let score = 0
  remove.forEach(val => {
    for (let i = 0; i < 3; i++) {
      if (b[val[0]][val[1]][i] === val[2]) {
        b[val[0]][val[1]][i] = 0
        score++
      }
    }
  })

  if (score > 0) {
    game.score += score * game.combo
    game.combo++
  } else {
    game.combo = 1
  }
}

const move = e => {
  Object.keys(refs).forEach(cell => {
    if (refs[cell].value && refs[cell].value[0]) {
      const elem = refs[cell].value[0]
      elem.style['border-color'] = 'transparent'
      if (isCurrent(e, elem)) {
        elem.style['border-color'] = isAllow(cell) ? '#ccc' : '#ff0000'
      }
    }
  })
}

const drop = e => {
  Object.keys(refs).forEach(cell => {
    if (refs[cell].value && refs[cell].value[0]) {
      const elem = refs[cell].value[0]
      elem.style['border-color'] = 'transparent'

      if (isCurrent(e, refs[cell].value[0]) && isAllow(cell)) {
        const v = cell.split('-')
        for (let i = 0; i < 3; i++) {
          board.value[v[1]][v[2]][i] += nextElement.value[i]
        }

        const next = random()
        if (!next) {
          nextElement.value = [0, 0, 0]
          game.isGameOver = true
          return
        }

        nextElement.value = next
      }
    }
  })

  checkGame()

  e.target.style.left = 0
  e.target.style.top = 0
}
</script>

<template>
  <div class="game">
    <div class="header">
      <div class="score">{{ game.score }}</div>
    </div>

    <div class="grid">
      <template v-for="(row, ri) in board">
        <template v-for="(col, ci) in row">
          <div class="cell" :ref="refs['cell-' + ri + '-' + ci]">
            <Element :value="col" />
          </div>
        </template>
      </template>
    </div>

    <div class="footer">
      <span v-drag class="elem-drag" @v-drag-moving.stop.prevent="move" @v-drag-end.stop.prevent="drop">
        <Element :value="nextElement" :without-center="true" />
      </span>
    </div>
  </div>

  <GameOver v-if="game.isGameOver" @new-game="newGame" />
</template>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
}
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}
.cell {
  padding: 0.25rem;
  position: relative;
  border-radius: 50%;
  background: transparent;
  border: 1px solid transparent;
  width: 7rem;
  height: 7rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header .score {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  margin-top: 2rem;
}

.footer .elem-drag {
  position: relative;
}
</style>
