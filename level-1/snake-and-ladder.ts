/**
 * Board size - mxn
 * Add snakes and ladders
 * Dice - 1 or more
 * Players
 * No loop with snake and ladder
 * System should log the player moves and state
 * System decides the winner
 */

const getRandomColor = () => {
    const colors = ['blue', 'red', 'white', 'yellow']
    return colors[Math.floor(Math.random()*colors.length)]
}

enum CellType {
    IDLE,
    SNAKE,
    LADDER
}
type Point = { x: number, y: number }

class Dice {
    private static sides: number[]
    static getValue () {
        return this.sides[Math.floor(Math.random()*this.sides.length)]
    }
}

class Snake {
    private start: Point
    private end: Point
    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }
    getPosition() {
        return { start: this.start, end: this.end };
    }
}


class Ladder {
    private start: Point
    private end: Point
    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }
    getPosition() {
        return { start: this.start, end: this.end };
    }
}

class SnakeLadderPlayer {
    private _id: string;
    public name: string;
    private color: string;
    private position: Point
    
    constructor(name: string) {
        this._id = generateUniqueId()
        this.name = name
        this.position = { x: 0, y: 0 };
        this.color = getRandomColor()
    }

    public move(moves: number, board: SnakeLadderBoard) {
        const { x, y } = board.getDimensions();
        let newX = this.position.x;
        let newY = this.position.y + moves;
        if (newY >= y) {
            newX += Math.floor(newY / y);
            newY %= y;
        }
        if (newX < x) {
            this.position = { x: newX, y: newY };
            this.checkForSnakeOrLadder(board);
        }
    }

    private checkForSnakeOrLadder(board: SnakeLadderBoard) {
        const cell = board.getCell(this.position);
        if (cell.needsRouting()) {
            this.position = cell.getRoute();
        }
    }

    public getPosition (): Point {
        return this.position
    }
}

class Cell {
    private type: CellType;
    private route: Point;

    constructor(type: CellType) {
        this.type = type;
    }
    public setType(type: CellType) {
        this.type = type;
        return this;
    }
    public setRoute(point: Point) {
        this.route = point;
        return this;
    }

    public getRoute(): Point {
        return this.route;
    }
    
    public needsRouting(): boolean {
        return [CellType.SNAKE, CellType.LADDER].includes(this.type);
    }
}

class SnakeLadderBoard {
    private m: number;
    private n: number;
    private board: Cell[][]

    constructor(m, n) {
        this.m = m;
        this.n = n;
        this.board = new Array(m).fill(null).map(_ => new Array(n).fill(0).map(_ => new Cell(CellType.IDLE)))
    }

    getDimensions(): Point {
        return { x: this.m, y: this.n }
    }

    getCell(position: Point): Cell {
        return this.board[position.x][position.y]
    }

    public placeSnake(a: Point, b: Point) {
        this.board[a.x][b.y].setType(CellType.SNAKE).setRoute(b)
    }

    public placeLadder(a: Point, b: Point) {
        this.board[a.x][b.y].setType(CellType.LADDER).setRoute(b)
    }
}

class SnakeLadderGame {
    private numberOfDices: number;
    private board: SnakeLadderBoard
    private players: SnakeLadderPlayer[]
    private currentPlayer: SnakeLadderPlayer;
    private currentPlayerIndex: number;

    constructor(board: SnakeLadderBoard, dices: number, ...players: SnakeLadderPlayer[]) {
        this.players = players;
        this.currentPlayerIndex = 0
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.numberOfDices = dices;
        this.board = board
    }
    
    private rollDices(): number {
        let rolls = this.numberOfDices;
        let moves = 0;
        while(rolls--) {
            moves += Dice.getValue();
        }
        return moves;
    }

    private hasWinner(): boolean {
        const { x, y } = this.board.getDimensions();
        return this.players.some(player => player.getPosition().x === x - 1 && player.getPosition().y === y - 1);
    }

    private switchPlayer () {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    public run() {
        while (!this.hasWinner()) {
            this.currentPlayer = this.players[this.currentPlayerIndex];
            const diceRoll = this.rollDices();
            console.log(`${this.currentPlayer.name} rolled a ${diceRoll}`);
            this.currentPlayer.move(diceRoll, this.board);
            console.log(`${this.currentPlayer.name} moved to (${this.currentPlayer.getPosition().x}, ${this.currentPlayer.getPosition().y})`);

            if (this.hasWinner()) {
                console.log(`${this.currentPlayer.name} wins the game!`);
                break;
            }
            this.switchPlayer()
        }
    }
}

class SnakeLadder {
    static run() {
        const player1 = new SnakeLadderPlayer('Sai Akhil')
        const player2 = new SnakeLadderPlayer('Katukam')
        const game = new SnakeLadderGame(new SnakeLadderBoard(20,20), 2, player1, player2);
        game.run();
    }
}

SnakeLadder.run();