# Memory Sequence Game

### A small implementation of Sequence Memory Game from: https://humanbenchmark.com/tests/sequence


### This code implements a browser-based memory sequence game using RxJS.


## Live
https://sequence-memory-rxjs.vercel.app/

## Features
* A grid of 8 colored squares is displayed.
* A random sequence is generated and displayed to the user, who must then repeat it by clicking on the squares in the same order.
* If the user successfully repeats the sequence, the length of the sequence is increased by one and the game continues.
* If the user makes a mistake, the game ends and the message "GAME OVER!" is displayed.
* The user can restart the game by clicking the "Reset" button.
* The current level of the game is displayed at the top of the screen.


## Implementation Details
* The game is implemented as an RxJS observable stream that subscribes to mouse clicks and updates the state of the game accordingly.
* The sequence of random numbers is generated using the generate operator.
* The display of the sequence to the user is implemented using the interval operator, which emits a value at regular intervals.
* The user's inputs are captured using the fromEvent operator and transformed using the scan operator into an array of integers.
* The user's inputs are compared to the correct sequence using the sequenceEqual operator.
* The end of the game is determined using the switchMap operator, which switches to a new observable stream depending on the result of the comparison.

## RXjs Operators Used
* empty
* from
* fromEvent
* generate
* interval
* map
* merge
* noop
* pluck
* scan
* sequenceEqual
* switchMap
* take
* tap


## Running the Game
Open the HTML file in a browser and click on the squares to play the game.