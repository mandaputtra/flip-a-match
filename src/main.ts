import { randomString } from './utils.ts'
import './style.css'

declare global {
  interface Window {
    game: Game
  }
}

interface GameState {
  GameStatus: 'RUNNING' | 'WIN' | 'LOSE' | 'NOT_STARTED'
  is_first_time: boolean;
  boxs: {
    id: string,
    color: string,
  }[]
}


const $ = (selector: string) => document.querySelector(selector)
const COLORS = [
  "#492540",
  "#c03546",
  "#2f89fc",
  "#40514e",
  "#30e3ca",
  "#ea7dc7"
]

class Game {
  board: Element;
  state: GameState;

  constructor() {
    this.board = $('#board')!
    this.state = {
      GameStatus: 'NOT_STARTED',
      boxs: [],
      is_first_time: true,
    }
  }

  initialize(boardSize: number) {
    for (let i = 0; i < boardSize * boardSize; i++) {
      this.board.innerHTML += `<div id="${randomString(10)}"></div>`
    }
  }

  colorPair(boardSize: number) {

  }
}

window.game = new Game()
