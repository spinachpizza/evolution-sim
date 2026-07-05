import type { Position } from "../../Types/Position";
import type { Food } from "../Food";
import type { Creature } from "./Creature";

export function findNearestEnemy(
    creatures: Creature[], 
    thisCreature: Creature, 
    friendlyFire: boolean)
    : Creature | undefined {

    let nearestCreature: Creature | undefined;
    let nearestDistance = thisCreature.stats.vision;

    for (const creature of creatures) {

        // ignore self
        if (creature === thisCreature)
            continue;

        // ignore same clan unless friendly fire on
        if (creature.clan === thisCreature.clan && !friendlyFire)
            continue;

        // ignore dead creatures
        if (!creature.state.alive)
            continue;

        const distance = distanceTo(creature.position, thisCreature);

        if (distance < nearestDistance) {
            nearestCreature = creature;
            nearestDistance = distance;
        }
    }

    return nearestCreature;
}

export function findNearestFood(food: Food[], thisCreature: Creature) : Food | undefined {
    
    let nearestFood: Food | undefined;
    let closestDist = thisCreature.stats.vision;

    for (const f of food) {
        const distance = distanceTo(f.position, thisCreature);

        if (distance < closestDist) {
            closestDist = distance;
            nearestFood = f;
        }
    }

    return nearestFood;
}

function distanceTo(position: Position, thisCreature: Creature): number {

    const dx = thisCreature.position.x - position.x;
    const dy = thisCreature.position.y - position.y;

    return Math.sqrt(dx * dx + dy * dy);
}