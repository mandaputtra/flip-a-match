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
type TileStatus = 'PAIRED' | 'SELECTED' | 'INVALID' | 'IDLE';
interface GameState {
  GameStatus: 'RUNNING' | 'NOT_STARTED'
  is_first_time: boolean;
  tiles: {
    id: string;
    color: string;
    status: TileStatus
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
      tiles: [],
      is_first_time: true,
    }
  }

  initialize(boardSize: number) {
    if (this.state.GameStatus !== 'NOT_STARTED') return

    for (let i = 0; i < boardSize * boardSize; i++) {
      const color = this.generateColorPair()
      const valueAttrs = randomString(7)
      this.board.innerHTML += `
        <div id="${valueAttrs}" class="tile">
          <div class="tile-inner">
            <div id="${valueAttrs}" class="tile-front" style=""></div>
            <div class="tile-back" style="background-color: ${color};"></div>
          </div>
        </div>
      `
      this.state.tiles.push({
        id: valueAttrs,
        color: color,
        status: 'IDLE'
      })
    }

    this.applyGridStyle(boardSize)
    this.state.GameStatus = 'RUNNING'
    this.play_button.hidden = true

    // Add listener to tile
    const tiles = $$(".tile") as NodeListOf<HTMLDivElement>

    tiles.forEach(e => e.addEventListener('click', (e) => {
      this.clickedtile(e.currentTarget)
      this.updateScore()
      this.isTheGameFinish()
    }))
  }

  clickedtile(e: EventTarget) {
    const el = e as HTMLDivElement
    const id = el.id

    const tileState = this.findTileByID(id)
    if (!tileState) return

    if (tileState.status === 'SELECTED') {
      el.classList.remove('flip')
      tileState.status = 'IDLE'
      return
    }

    // If the tile state is idle assign as selected tile
    if (tileState.status === 'IDLE') {
      el.classList.add('flip')
      tileState.status = 'SELECTED'
    }

    // If the tile doenst have match, mark them as invalid
    if (!this.findRemainingColor(tileState.color, tileState.id)) {
      el.classList.add('flip')
      el.classList.add('invalid')
      tileState.status = 'INVALID'
      this.resetSelection()
      return
    }

    const selectedTiles = this.findTileByStatus('SELECTED')
    // If there is two selected tile 
    if (!(selectedTiles.length === 2)) return

    // If the color match mark them as match.
    if (selectedTiles[0].color === selectedTiles[1].color) {
      selectedTiles.forEach(b => {
        b.status = 'PAIRED'
        $(`#${b.id}`).classList.add('flip')
      })
      return
    }

    // If not reset selection
    if (selectedTiles[0].color !== selectedTiles[1].color) {
      this.resetSelection()
      return
    }
  }

  updateScore() {
    const pairedtile = this.findTileByStatus("PAIRED")
    if (pairedtile.length < 2) {
      $('#board-score').innerHTML = `Found : 0`
    } else {
      const score = pairedtile.length / 2
      $('#board-score').innerHTML = `Found : ${score}`
    }
  }

  isTheGameFinish() {
    const idletile = this.state.tiles.filter(b => b.status === 'IDLE' || b.status == 'SELECTED')
    // If there is only one or less idle or selected tile finish the game
    if (idletile.length <= 1) {
      this.state.GameStatus = "NOT_STARTED"
      this.play_button.hidden = false
      this.state.tiles = []
      $$(".tile").forEach(e => e.remove())
      // @ts-expect-error cannot assign string on 
      this.board.style = ''
      return true
    }
    return false
  }

  resetSelection() {
    setTimeout(() => {
      this.state.tiles.forEach(b => {
        if (b.status === 'SELECTED') {
          $(`#${b.id}`).classList.remove('flip')
          b.status = 'IDLE'
        }
      })
    }, 500)
  }

  findTileByStatus(status: TileStatus) {
    return this.state.tiles.filter(b => b.status === status)
  }

  findRemainingColor(color: string, id: string) {
    return this.state.tiles.some(b => b.color === color && b.status !== 'PAIRED' && b.id !== id)
  }

  findTileByID(id: string) {
    return this.state.tiles.filter(b => b.id === id)[0]
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
