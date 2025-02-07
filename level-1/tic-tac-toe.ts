type Marker = 'X' | 'O';

class Player {
    name: string;
    marker: Marker
    avatar?: string

    constructor(name: string, marker: Marker) {
        this.name = name;
        this.marker = marker
    }
}

class Board {
	private grid: string[][];
	private numOfMoves: number;
	private n: number;

    private row: {
        x: number,
        o: number
    }[]
    private col: {
        x: number,
        o: number
    }[]
    private fwdDiag: {
        x: number,
        o: number
    }
    private revDiag: {
        x: number,
        o: number
    }
	
    constructor(n: number) {
        this.init(n);
	}

    private init (n) {
        this.grid = new Array(n).fill(null).map(_ => new Array(n).fill('-'));
        this.numOfMoves = 0;
        this.row = new Array(n).fill(null).map(_ => ({ x: 0, o: 0 })) 
        this.col = new Array(n).fill(null).map(_ => ({ x: 0, o: 0 })) 
        this.fwdDiag = { x: 0, o: 0 }
        this.revDiag = { x: 0, o: 0 }
    }

    public isFull() {
        return this.numOfMoves == this.n*this.n
    }

    public makeMove (row: number, col: number, marker: Marker) {
        if(row<0 || col<0 || row>=this.n || col>=this.n || this.grid[row][col] != '-') {
            throw new Error('Invalid move')
        }
        this.grid[row][col] = marker;
        this.row[row][marker]++;
        this.col[col][marker]++;
        this.numOfMoves++;
        return this.hasWinner(row, col)
    }

    public hasWinner (row: number, col: number) {
        return this.row[row].x == this.n || this.col[col].x == this.n ||
                this.row[row].o == this.n || this.col[col].o == this.n ||
                this.fwdDiag.x == this.n || this.fwdDiag.x == this.n ||
                this.revDiag.o == this.n || this.revDiag.o == this.n
    }
}

class Game {
    private currentPlayer: Player;
    private board: Board;
    private gameWon: boolean = false;

    constructor(
        private player1: Player,
        private player2: Player,
    ) {}

    public play() {
        this.currentPlayer = this.player1;
        this.board = new Board(3);
        while(!this.board.isFull() && !this.gameWon) {
            const [row, col] = this.getInput();
            try {
                this.gameWon = this.board.makeMove(row, col, this.currentPlayer.marker)
                if(this.gameWon) {
                    break;
                }
                this.switchPlayer();
            } catch (err) {
                console.error(err);
            }
        }

        if (this.gameWon) {
            console.log(`${this.currentPlayer.name} wins!`);
        } else {
            console.log("It's a draw!");
        }
    }

    private switchPlayer () {
        this.currentPlayer = this.currentPlayer == this.player1 ? this.player2 : this.player1;
    }

    private getInput () {
        return [0,2];//random generator
    }
}


class TicTacToe {
    static run() {
        const player1 = new Player('Sai Akhil', 'X');
        const player2 = new Player('Katukam', 'O');
        const game = new Game(player1, player2)
        game.play();
    }
}

TicTacToe.run();