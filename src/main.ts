import { randomString } from './utils.ts'
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
  board: Writeable<HTMLElement>;
  state: GameState;

  constructor() {
    this.board = $('#board')! as HTMLElement
    this.state = {
      GameStatus: 'NOT_STARTED',
      boxs: [],
      is_first_time: true,
    }
  }

  initialize(boardSize: number) {
    for (let i = 0; i < boardSize * boardSize; i++) {
      this.board.innerHTML += `<span id="box" data-value="${randomString(7)}"></span>`
    }
    this.applyGridStyle(boardSize)
    this.colorPair(boardSize)
  }

  colorPair(boardSize: number) {

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

window.game = new Game()
