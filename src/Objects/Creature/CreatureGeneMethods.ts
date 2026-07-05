import type { Genes } from "../../Types/Genes";
import type { Stats } from "../../Types/Stats";

 export function getStatsFromGenes(genes: Genes) : Stats {

    let stats: Stats = 
    {
        speed: 2,
        maxEnergy: 120,
        metabolism: 1,
        size: 5,
        maxAge: 100,
        maxHealth: 100,
        damage: 10,
        vision: 100,
        aggression: 0,
    };

    stats.speed = 80 + (genes.speed - 5) * 8;
    stats.size = 2 + Math.pow(genes.size / 10, 1.5) * 15;

    stats.vision = 75 + (genes.vision - 5) * 10;
    stats.aggression = genes.aggression;
    stats.damage = 30 + ((genes.strength - 3) * 8 ) + ((genes.size - 3) * 2);

	stats.speed += ((genes.size -5) * - 1) * 3;
    stats.speed = Math.max(30, stats.speed);

    stats.maxEnergy = 70 + genes.size * 8;
    stats.maxHealth = 50 + ((genes.strength - 5) * 5 ) + (genes.size * 8);

    stats.maxAge = 50 + (genes.size * 5);

    stats.metabolism = calculateMetabolism(genes);

	return stats;
}

export function mutateGenes(genes: Genes) : Genes {

	const mutations = [
		"speed",
		"vision",
		"size",
		"aggression",
		"strength"
	];

	mutations.sort(() => Math.random() - 0.5);

	const mutationMultiplier = Math.random() < 0.85 ? 1 : 2;

	let mutationCount = 1;

	if (Math.random() < 0.4)
		mutationCount++;

	if (Math.random() < 0.15)
		mutationCount++;

	mutationCount = Math.min(mutationCount, mutations.length);

	for (let i = 0; i < mutationCount; i++) {

		const gene = mutations[i];

		const change = (Math.random() > 0.5 ? 1 : -1) * mutationMultiplier;

		switch (gene) {

			case "speed":
				genes.speed += change;
				break;

			case "vision":
				genes.vision += change;
				break;

			case "size":
				genes.size += change;
				break;

			case "aggression":
				genes.aggression += change;
				break;

			case "strength":
				genes.strength += change;
				break;
		}
	}

	genes.speed = Math.max(1, Math.min(10, genes.speed));
	genes.vision = Math.max(1, Math.min(10, genes.vision));
	genes.size = Math.max(1, Math.min(10, genes.size));
	genes.aggression = Math.max(1, Math.min(10, genes.aggression));
	genes.strength = Math.max(1, Math.min(10, genes.strength));

	return genes;
}

function calculateMetabolism(genes: Genes): number {
    let metabolism = 1;

    metabolism += (genes.speed - 3) * 0.15;
    metabolism += (genes.size - 3) * 0.012;
    metabolism += (genes.vision - 3) * 0.05;
    metabolism += (genes.strength - 3) * 0.05;

    return metabolism
}