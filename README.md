# Callisto

This web appliation was made with Python's Flask Framework. Using Jinja, HTML, CSS, and JS the board game has been electronified so you and your friends can play on the go.

## Instructions

The board is a 20×20 board removing the corners (dark blue) such that an octagon with a top edge of size six remains. The pieces are a subset of the polyominoes up to size five. They include three 1×1 pieces per player that play a special role. The 1×1 pieces may be placed anywhere on the board apart from the center of the board (blue). The center consists of an octagon with width six and top edge size two. The first two moves of a player must use a 1×1 piece, the third 1×1 piece may be played anytime later. All larger pieces may be placed anywhere on the board but must touch an existing piece of the same color edge-to-edge. The score of a color is the number of squares on the board occupied by the color.

### Start phase (placing your bases)

The first 2 round start with players taking turns placing a 1x1 base. Be strategic where you place them; you cannot place them on the middle blue octagon or the dark blue triangles.
![start phase, placing bases](/assets/images/start-phase.png)

### Mid phase

Select any piece and place it on the board, so long as you still have that piece in your inventory and there is at least one cell that is adjacent to another cell owned by you.
![actions](/assets/images/actions.png)

Anytime after the start phase, players can place a new base anywhere they want not occupied by another piece already or the blue squares. Saving a new base can get you out of trouble, but waiting too long may leave you trapped easily.
![new base](/assets/images/new-base.png)

### End phase

Once a player gets to a point where they cannot play anymore pieces, they pass and let the other players continue. Once everyone is unable to play pieces anymore or they have already placed all their pieces, the winner is decided by who occupies the most space at the end.
![end phase](/assets/images/end-phase.png)

## Have Fun!
