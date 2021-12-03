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
    player = (props.owner === 'red') ? 'yellow' : 'red'; //Opposite of whos turn it is because last turn won
  } else if (props.count === 42) {
    // Board filled without a winner
    message = "Tie Game";
    player = 'orange';
  } else {
    // Displays the next players turn
    message = "Players Turn";
    player = props.owner;
  }

  return (
    <div style={messageStyle}>
      <Hole owner={player} id={"displayDot"} /> 
      <div>
        {message}
      </div>
    </div>
  );
}

// Hole button on the board
function Hole(props)
{
  // Owner of spot determines color
  let holesStyle = {
    backgroundColor: props.owner,
    height: '50px',
    width: '50px',
    borderRadius: '25px',
    margin: '5px'
  };
  
  return (
    <button style={holesStyle} id={props.id} onClick={props.onClick} disabled={props.disabled}></button>
  );
}

class GameBoard extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      gameBoard: new Array(6).fill(new Array(7).fill('white')), // Multi dimensional array for the board
      winner: '', // Winner of the match
      count: 0, // Number of turns played 
      playersTurn: 'red' // The player who is about to place a checker (Game starts with red player) 
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
            owner={this.state.gameBoard[posY][posX]} 
            disabled={(this.state.gameBoard[posY][posX] !== 'white' || this.state.winner !== '')}
            onClick={() => 
              {
                // Copy of the current board
                const newBoard = this.state.gameBoard.map((arr) => {
                  return arr.slice();
                });

                // Copy of the row the player clicked
                let newVal = newBoard[posY];

                // Updates the white spot to the current players color
                newVal[posX] = this.state.playersTurn;
              

                this.setState({
                  playersTurn: (this.state.playersTurn === 'red') ? 'yellow' : 'red', // Sets the turn to the other player
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
          {this.renderRow(0)}
          {this.renderRow(1)}
          {this.renderRow(2)}
          {this.renderRow(3)}
          {this.renderRow(4)}
          {this.renderRow(5)}
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
  for (let j = 0; j < 6; j++)
  {
    // For each possible position in column 
    for(let i = 0; i < 4; i++) 
    {
      if (checkFour(b[j][i], b[j][1 + i], b[j][2 + i], b[j][3 + i]))
      {
        return b[j][i];
      }
    }
  }

  // For each column |
  for (let j = 0; j < 7; j++)
  {
    // For each possible possition in a row
    for(let i = 0; i < 3; i++) 
    {
      if (checkFour(b[i][j], b[1 + i][j], b[2 + i][j], b[3 + i][j]))
      {
        return b[i][j];
      }
    }
  }

  // For each diagonal \ (negative slope)
  // For each possible possition in a column
  for (let j = 0; j < 4; j++)
  {
    // For each possible possition in a row
    for(let i = 0; i < 3; i++) 
    {
      if (checkFour(b[i][j], b[1 + i][1 + j], b[2 + i][2 + j], b[3 + i][3 + j]))
      {
        return b[i][j];
      }
    }
  }

  // For each diagonal / (positive slope)
  // For each possible possition in a column
  for (let j = 0; j < 4; j++)
  {
    // For each possible possition in a row
    for(let i = 0; i < 3; i++) 
    {
      if (checkFour(b[i][3 + j], b[1 + i][2 + j], b[2 + i][1 + j], b[3 + i][j]))
      {
        return b[i][j];
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

