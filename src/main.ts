import { $, $$, randomString } from './utils.ts'
import './style.css'
import './reset.css'

declare global {
  interface Window {
    game: Game
  }
}

// Overiding read only types for HTMLElement such as style, etc
type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type BoxStatus = 'PAIRED' | 'SELECTED' | 'INVALID' | 'IDLE';
interface GameState {
  GameStatus: 'RUNNING' | 'WIN' | 'LOSE' | 'NOT_STARTED'
  is_first_time: boolean;
  boxs: {
    id: string;
    color: string;
    status: BoxStatus
  }[]
}



class Game {
  board: Writeable<HTMLElement>;
  play_button: HTMLElement;
  state: GameState;
  colors: string[]

  constructor() {
    this.board = $('#board')! as HTMLElement
    this.play_button = $("#play-button")! as HTMLElement
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
    if (this.state.GameStatus !== 'NOT_STARTED') return

    for (let i = 0; i < boardSize * boardSize; i++) {
      const color = this.generateColorPair()
      const valueAttrs = randomString(7)
      this.board.innerHTML += `<span id="${valueAttrs}" style="background-color: ${color};"></span>`
      this.state.boxs.push({
        id: valueAttrs,
        color: color,
        status: 'IDLE'
      })
    }

    this.applyGridStyle(boardSize)
    this.state.GameStatus = 'RUNNING'
    this.play_button.hidden = true

    // Add listener to span box
    const boxes = $$("#board > span") as NodeListOf<HTMLSpanElement>
    boxes.forEach(e => e.addEventListener('click', (e) => {
      this.clickedBox(e)
    }))
  }

  clickedBox(e: MouseEvent) {
    const el = e.target as HTMLSpanElement
    const id = el.id

    const boxState = this.findBoxByID(id)
    if (!boxState) return
    // If the box doenst have match, mark them as invalid
    if (!this.findRemainingColor(boxState.color, boxState.id)) {
      console.log('here')
      el.classList.remove('selected-box')
      el.classList.add('invalid-box')
      boxState.status = 'INVALID'
      this.resetSelection()
      return
    }

    // If the box state is idle assign as selected box
    if (boxState.status === 'IDLE') {
      el.classList.add('selected-box')
      boxState.status = 'SELECTED'
    }

    const selectedBoxs = this.findBoxByStatus('SELECTED')
    // If there is two selected box 
    if (!(selectedBoxs.length === 2)) return

    // If the color match mark them as match.
    if (selectedBoxs[0].color === selectedBoxs[1].color) {
      selectedBoxs.forEach(b => {
        b.status = 'PAIRED'
        $(`#${b.id}`).classList.remove('selected-box')
        $(`#${b.id}`).classList.add('match-box')
      })
      return
    }

    // If not reset selection
    if (selectedBoxs[0].color !== selectedBoxs[1].color) {
      this.resetSelection()
      return
    }

  }

  resetSelection() {
    this.state.boxs = this.state.boxs.map(b => {
      if (b.status === 'SELECTED') {
        return {
          ...b,
          status: 'IDLE'
        }
      } else {
        return b
      }
    })
    $$("#board > span").forEach(e => e.classList.remove('selected-box'))
  }

  findBoxByStatus(status: BoxStatus) {
    return this.state.boxs.filter(b => b.status === status)
  }

  findRemainingColor(color: string, id: string) {
    return this.state.boxs.some(b => b.color === color && b.status !== 'PAIRED' && b.id !== id)
  }

  findBoxByID(id: string) {
    return this.state.boxs.filter(b => b.id === id)[0]
  }

  generateColorPair() {
    const selected = this.colors[(Math.random() * this.colors.length | 0)] // '| 0', convert float to int
    return selected
  }

  applyGridStyle(boardSize: number) {
    this.board.style.height = '400px'
    this.board.style.border = '2px solid black'
    this.board.style.display = 'grid'
    this.board.style['grid-template-rows'] = `repeat(${boardSize}, 1fr)`
    this.board.style['grid-template-columns'] = `repeat(${boardSize}, 1fr)`
    this.board.style['grid-column-gap'] = '0px'
    this.board.style['grid-row-gap'] = '0px'
  }
}

// Assign to window so it can be accessed easily
window.game = new Game()
