import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*----- Styling for the game -----*/
// Board and Display styling
const boardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', 
  justifyContent: 'space-between', 
  height: '485px'
}

// Whole pages styling
const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', 
  justifyContent: 'space-evenly', 
  minWidth: '475px',
  minHeight: '515px',
  height: '100vh',
  backgroundColor: 'antiquewhite'
}

// Message display styling 
const messageStyle = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  padding: '5px 10px', 
  width: '175px', 
  backgroundColor: 'white', 
  border: '2px solid black', 
  borderRadius: '35px' 
};

// Button to refresh page and thus restart game
function ResetBtn(){
  return (
    <button id={"resetBtn"} onClick={() => 
                      {
                        window.location.reload(false);
                      }
                    }>
      Click To Restart
    </button>
  );
}

// User message displayed for turn and winner
function TurnMessage(props) {
  let message, player;

  if (props.win !== '') {
    // If there is a winner
    message = "Player Wins!";
    player = (props.owner === 'redSpot') ? 'yellowSpot' : 'redSpot'; //Opposite of whos turn it is because last turn won
  } else if (props.count === 42) {
    // Board filled without a winner
    message = "Tie Game";
    player = 'orangeSpot';
  } else {
    // Displays the next players turn
    message = "Players Turn";
    player = props.owner;
  }

  return (
    <div style={messageStyle}>
      <Hole owner={player} className={'boardHole ' + player} id={"displayDot"} /> 
      <div>
        {message}
      </div>
    </div>
  );
}

// Hole button on the board
function Hole(props)
{ 
  return (
    <button className={props.className} id={props.id} onClick={props.onClick} disabled={props.disabled}></button>
  );
}

class GameBoard extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      gameBoard: new Array(7).fill(new Array(6).fill('white')), // Multi dimensional array for the board
      winner: '', // Winner of the match
      count: 0, // Number of turns played 
      playersTurn: 'yedSpot' // The player who is about to place a checker (Game starts with red player) 
    }
  }

  // Renders the holes on the board 
  renderHole(posX, posY)
  {
    // Unique id for each hole
    let holeId = 'X' + posX + 'Y' + posY;

    return (
      // Owner is determined by color in the board multi dimensional array
      // Disables the button if owned by a color or winner already determined
      <Hole id={holeId}
            className={'boardHole '   + this.state.gameBoard[posX][posY]} 
            owner={this.state.gameBoard[posX][posY]} 
            disabled={(this.state.gameBoard[posX][posY] !== 'white' || this.state.winner !== '')}
            onClick={() => 
              {
                // Copy of the current board
                const newBoard = this.state.gameBoard.map((arr) => {
                  return arr.slice();
                });

                // Copy of the row the player clicked
                let newVal = newBoard[posX];

                // Updates the white spot to the current players color
                newVal[newVal.indexOf('white')] = this.state.playersTurn;
                console.log(newVal);

                this.setState({
                  playersTurn: (this.state.playersTurn === 'redSpot') ? 'yellowSpot' : 'redSpot', // Sets the turn to the other player
                  gameBoard: newBoard, // Updates the game board with the players move
                  count: (this.state.count + 1), // Increases turn count
                  winner: checkWinner(newBoard) // Checks to see if there is a winner (If no winner, sets to '')
                });
              }
          }/>
    );
  }

  // Creates a row of 7 holes at the y position
  renderRow(posY)
  {
    return (
      <div>
        {this.renderHole(0, posY)}
        {this.renderHole(1, posY)}
        {this.renderHole(2, posY)}
        {this.renderHole(3, posY)}
        {this.renderHole(4, posY)}
        {this.renderHole(5, posY)}
        {this.renderHole(6, posY)}
      </div>
    );
  }

  render() 
  {
    // Renders rows of gameboard and renders the turn message
    return (
      <div style={boardStyle}>
        <TurnMessage win={this.state.winner} count={this.state.count} owner={this.state.playersTurn} />
        <div style={{backgroundColor: 'blue', borderRadius: '25px', width: '420px', padding: '15px'}}>
          {this.renderRow(5)}
          {this.renderRow(4)}
          {this.renderRow(3)}
          {this.renderRow(2)}
          {this.renderRow(1)}
          {this.renderRow(0)}
        </div>
      </div>
    );
  }
}

// Checks if four holes are connected and if they are a players color
function checkFour(a, b, c, d)
{
  return (
          (a !== 'white' && b !== 'white' && c !== 'white' && d !== 'white') 
          && 
          (a === b && b === c && c === d)
    );
}

// Checks each row and column of the board for a winner, returns winning colour
function checkWinner(b)
{
  // For each row -
  for (let y = 0; y < 6; y++)
  {
    // For each possible position in column 
    for(let x = 0; x < 4; x++) 
    {
      if (checkFour(b[x][y], b[x + 1][y], b[x + 2][y], b[x + 3][y]))
      {
        return b[x][y];
      }
    }
  }

  // For each column |
  for (let x = 0; x < 7; x++)
  {
    // For each possible possition in a row
    for(let y = 0; y < 3; y++) 
    {
      if (checkFour(b[x][y], b[x][y + 1], b[x][y + 2], b[x][y + 3]))
      {
        return b[x][y];
      }
    }
  }

  // For each diagonal \ (negative slope)
  // For each possible possition in a column
  for (let x = 0; x < 4; x++)
  {
    // For each possible possition in a row
    for(let y = 0; y < 3; y++) 
    {
      if (checkFour(b[x][y], b[x + 1][y + 1], b[x + 2][y + 2], b[x + 3][y + 3]))
      {
        return b[x][y];
      }
    }
  }

  // For each diagonal / (positive slope)
  // For each possible possition in a column
  for (let x = 0; x < 4; x++)
  {
    // For each possible possition in a row
    for(let y = 0; y < 3; y++) 
    {
      if (checkFour(b[x][y + 3], b[x + 1][y + 2], b[x + 2][y + 1], b[x + 3][y]))
      {
        return b[x][y];
      }
    }
  }

  // Return empty string if there isnt a winner
  return '';
}

ReactDOM.render(
  <div style={pageStyle}>
    <GameBoard />
    <ResetBtn />
  </div>
  ,
  document.getElementById('root')
);

