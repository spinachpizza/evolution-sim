import type { Creature } from "../Objects/Creature/Creature";
import type { Clan } from "../Types/Clan";

export class PopulationBar {

    private element: HTMLDivElement;


    constructor() {

        this.element =
            document.getElementById("population-bar") as HTMLDivElement;
    }


    update(creatures: Creature[]) {

        this.element.innerHTML = "";

        const alive = creatures.filter(c => c.state.alive);

        const counts = new Map<Clan, number>();

        for (const creature of alive) {
            counts.set(
                creature.clan,
                (counts.get(creature.clan) ?? 0) + 1
            );
        }


        const total = alive.length;


        for (const [clan, count] of counts) {

            const segment = document.createElement("div");

            segment.style.width =
                `${(count / total) * 100}%`;

            segment.style.background =
                `hsl(${clan.hue}, ${clan.saturation}%, ${clan.lightness}%)`;

            segment.className = "population-segment";


            this.element.appendChild(segment);
        }
    }
}