import { $, randomString } from './utils.ts'
import './style.css'
import './reset.css'

declare global {
  interface Window {
    game: Game
  }
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
interface GameState {
  GameStatus: 'RUNNING' | 'WIN' | 'LOSE' | 'NOT_STARTED'
  is_first_time: boolean;
  boxs: {
    id: string,
    color: string,
    is_paired: boolean;
  }[]
}



class Game {
  board: Writeable<HTMLElement>;
  state: GameState;
  colors: string[]

  constructor() {
    this.board = $('#board')! as HTMLElement
    this.colors = [
      "#492540",
      "#c03546",
      "#2f89fc",
      "#40514e",
      "#30e3ca",
      "#ea7dc7"
    ]
    this.state = {
      GameStatus: 'NOT_STARTED',
      boxs: [],
      is_first_time: true,
    }
  }

  initialize(boardSize: number) {
    for (let i = 0; i < boardSize * boardSize; i++) {
      const color = this.generateColorPair()
      const valueAttrs = randomString(7)
      this.board.innerHTML += `<span id="${valueAttrs}" style="background-color: ${color};"></span>`
      this.state.boxs.push({
        id: valueAttrs,
        color: color,
        is_paired: false
      })
    }
    this.applyGridStyle(boardSize)
  }

  generateColorPair() {
    const selected = this.colors[(Math.random() * this.colors.length | 0)] // '| 0', convert float to int
    return selected
  }

  applyGridStyle(boardSize: number) {
    this.board.style.height = '400px'
    this.board.style.border = '1px solid black'
    this.board.style.display = 'grid'
    this.board.style['grid-template-rows'] = `repeat(${boardSize}, 1fr)`
    this.board.style['grid-template-columns'] = `repeat(${boardSize}, 1fr)`
    this.board.style['grid-column-gap'] = '0px'
    this.board.style['grid-row-gap'] = '0px'
  }
}

// Assign to window so it can be accessed easily
window.game = new Game()
