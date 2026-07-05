import type { Creature } from "../Objects/Creature/Creature";

export class CreaturePanel {

    element: HTMLElement;

    constructor() {
        this.element =
            document.getElementById("creature-panel")!;
    }


    update(creatures: Creature[]) {

        this.element.innerHTML = "";

        const alive =
            creatures.filter(c => c.state.alive);


        alive
        .slice(0, 20) // avoid huge lists
        .forEach((creature, index) => {

            const div =
                document.createElement("div");

            div.className = "creature-card";


            div.innerHTML = `
                <b>#${index}</b>
                <br>
                Clan: ${creature.clan.name}
                <br>
                Age: ${creature.state.age.toFixed(0)}
                <br>
                Energy: ${creature.state.energy.toFixed(0)}
                <br><br>

                Speed: ${creature.genes.speed}
                <br>
                Vision: ${creature.genes.vision}
                <br>
                Size: ${creature.genes.size}
                <br>
                Strength: ${creature.genes.strength}
                <br>
                Aggression: ${creature.genes.aggression}
            `;


            this.element.appendChild(div);
        });
    }
}