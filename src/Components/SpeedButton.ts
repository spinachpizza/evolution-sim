import { game } from "../main";

export let gameSpeed = 1;

const button = document.getElementById("speed-button")!;


button.onclick = () => {

    if (game.gameSpeed === 1) {
        game.gameSpeed = 2;
    }
    else if (game.gameSpeed === 2) {
        game.gameSpeed = 4;
    }
    else {
        game.gameSpeed = 1;
    }

    button.innerText = `Speed x${game.gameSpeed}`;
};