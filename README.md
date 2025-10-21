# JO_OX_009
HTML5 Naughts &amp; Crosses

## Enhance JO_OX_09 with score tracking and animations ( glowing win lines )

Feature	Description

Tech	Bootstrap 5 + Tailwind + Font Awesome

Design	Black background, white text, green buttons

Game	Fully playable Naughts & Crosses vs computer

Navbar	“Home” & “Contact” buttons collapse on mobile

Contact	Opens a modal → links to https://www.raiiarcom.io/contact

Footer	Credits Julius Olatokunbo with green link

Responsive	Mobile-first layout, scalable via Bootstrap


## Enhanced

Ensure the website has 

{ 

1 - Uses BOOTSTRAP, FONT-AWESOME, TAILWIND 

2 - Has BLACK background, WHITE text, GREEN buttons 

3 - Has a FOOTER with "Another website designed by Julius Olatokunbo" where "Julius Olatokunbo" redirects to https://www.raiiarcom.io 

4 - Has a Home button and a Contact button these should be scaled to a mobile menu when viewed on mobile or tablets accordingly 

5 - The contact button should link via a modal screen to https://www.raiiarcom.io/contact 

}

### Weights are assigned to squares

🧩 Concept summary


We assign weights to positions:

Center (index 4) → 3 points (most valuable)

Corners (0, 2, 6, 8) → 2 points

Edges (1, 3, 5, 7) → 1 point

The computer evaluates:

If it can win → choose that square.

If the player can win next → block it.

Otherwise, choose highest-weight empty square.

### Enhanced by adding Gomoku

🧠 Explanation Summary

Step	Description

SIZE = 8	Creates 8×8 board dynamically

WIN_LENGTH = 5	Changes win condition from 3 to 5

Weighted grid	Center has higher weight for smarter moves

Win check	Scans all 4 directions from every square

AI strategy	Win → Block → Choose best weighted empty cell

