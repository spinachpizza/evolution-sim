import type { Clan } from "../../Types/Clan";
import { CreatureState } from "../../Types/CreatureState";
import type { Genes } from "../../Types/Genes";
import type { Position } from "../../Types/Position";
import type { Stats } from "../../Types/Stats";
import type { Food } from "../Food";
import { addDamageFlash, addDeathAnimation, addEyes, getColor } from "./CreatureDrawingMethods";
import { getStatsFromGenes, mutateGenes } from "./CreatureGeneMethods";
import { findNearestEnemy, findNearestFood } from "./CreatureMovementMethods";

export class Creature {

    public position: Position = {
        x: 0,
        y: 0
    }

    public velocity = {
        x: 1,
        y: 0
    }

    public stats: Stats;

    public state = {
        energy: 100,
        health: 100,
        age: 0,
        alive: true
    }

    public targetCreature?: Creature;

    public genes: Genes;

    public clan: Clan;

    public deathTimer: number = 0;
    public deathDuration: number = 1;

    public damageFlash = 0;
    public damageFlashDuration = 0.2;

    public behaviour: CreatureState = CreatureState.Wandering;

    private targetFood?: Food;

    private friendlyFire: boolean;

    constructor(
        x: number, 
        y: number,
        clan: Clan,
        genes: Genes,
        friendlyFire: boolean,
        firstSpawn: boolean = false) {
            
        this.position.x = x;
        this.position.y = y;

        const angle = Math.random() * Math.PI * 2;
        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);

        this.clan = clan;
        this.genes = genes;
        this.friendlyFire = friendlyFire;

        this.stats = getStatsFromGenes(genes);

        this.state.health = this.stats.maxHealth;

        this.state.energy = firstSpawn 
            ? this.stats.maxEnergy
            : this.stats.maxEnergy * 0.5;
    }

    public update(canvas: HTMLCanvasElement, delta: number, food: Food[], creatures: Creature[]) {

        if (!this.state.alive) {
            this.deathTimer += delta;
            return;
        }

        if (this.damageFlash > 0) {
            this.damageFlash -= delta;
        }

        if (this.state.age > this.stats.maxAge || this.state.energy <= 0)
        {
            this.die();
        }

        this.updateBehaviour(food, creatures);

        switch (this.behaviour) {

            case CreatureState.Foraging:
                this.moveTowardsFood(food, delta);
                break;

            case CreatureState.Hunting:
                this.moveTowardsCreature(delta, this.targetCreature);
                break;

            case CreatureState.Wandering:
                this.wander(canvas, delta);
                break;
        }

        if (this.shouldReproduce()) {
            return this.reproduce();
        }

        this.state.energy -= (5 * this.stats.metabolism) * delta;
        this.state.age += 1 * delta;
    }

    private updateBehaviour(food: Food[], creatures: Creature[]) {

        if (this.behaviour === CreatureState.Hunting) {

            if (this.state.energy < this.stats.maxEnergy * 0.25) {

                this.targetCreature = undefined;
                this.behaviour = CreatureState.Wandering;
                return;
            }

            if (!this.targetCreature || !this.targetCreature.state.alive) {
                this.targetCreature = undefined;
                this.behaviour = CreatureState.Wandering;
            }

            return;
        }

        const enemy = findNearestEnemy(creatures, this, this.friendlyFire);

        if (enemy) {
            if (this.shouldHunt(enemy)) {
                this.targetCreature = enemy;
                this.behaviour = CreatureState.Hunting;
                return;
            }
        }

        const targetFood = findNearestFood(food, this);


        if (
            targetFood &&
            this.state.energy < this.stats.maxEnergy * 0.95
        ) {
            this.targetFood = targetFood;
            this.behaviour = CreatureState.Foraging;
            return;
        }


        this.targetFood = undefined;
        this.behaviour = CreatureState.Wandering;
    }


    private shouldHunt(enemy: Creature): boolean {

        if (enemy.state.age < 10 || this.state.age < 10)
            return false;

        // non-linear aggression curve
        let aggressionFactor = (this.genes.aggression / 10) ** 2;
        let chance = 0.005 + aggressionFactor * 0.6;

        // size advantage matters, but secondary
        chance += (this.stats.size - enemy.stats.size) * 0.02;

        // clamp
        chance = Math.max(0, Math.min(1, chance));

        return Math.random() < chance;
    }

    private moveTowardsCreature(delta: number, target?: Creature) {

        if (!target)
            return;

        this.moveTowards(
            target.position.x,
            target.position.y,
            delta
        );
    }

    private reproduce(): Creature {
        this.state.energy *= 0.5; // split energy with child

        let childGenes = {
            speed: this.genes.speed,
            size: this.genes.size,
            vision: this.genes.vision,
            aggression: this.genes.aggression,
            strength: this.genes.strength
        };

        childGenes = mutateGenes(childGenes);

        const child = new Creature(
            this.position.x + (Math.random() - 0.5) * 20,
            this.position.y + (Math.random() - 0.5) * 20,
            this.clan,
            childGenes,
            this.friendlyFire
        );

        return child;
    }

    private shouldReproduce(): boolean {

        // must have enough energy
        if (this.state.energy < this.stats.maxEnergy * 0.9)
            return false;

        // don't reproduce too young
        if (this.state.age < 5)
            return false;

        // smaller creatures reproduce more
        let sizeFactor: number;

        if (this.genes.size < 5) {
            sizeFactor = 1 + (5 - this.genes.size) * 0.08;
        }
        else {
            sizeFactor = 1 - (this.genes.size - 5) * 0.12;
        }

        const reproductionChance = 0.01 * sizeFactor;

        if (Math.random() > reproductionChance)
            return false;

        return true;
    }

    private tryEat(food: Food, foodArray: Food[]): boolean {

        const dx = food.position.x - this.position.x;
        const dy = food.position.y - this.position.y;

        const dist = Math.sqrt(dx * dx + dy * dy);


        if (dist < this.stats.size + 2) {

            this.state.energy += food.energy;

            if (this.state.energy > this.stats.maxEnergy) {
                this.state.energy = this.stats.maxEnergy;
            }


            const index = foodArray.indexOf(food);

            if (index > -1) {
                foodArray.splice(index, 1);
            }

            return true;
        }

        return false;
    }

    private moveTowardsFood(food: Food[], delta: number) {

        if (!this.targetFood)
            return;

        this.moveTowards(this.targetFood.position.x, this.targetFood.position.y, delta);

        if (this.tryEat(this.targetFood, food)) {
            this.targetFood = undefined;
            this.behaviour = CreatureState.Wandering;
        }
    }

    private moveTowards(xpos: number, ypos: number, delta: number) {
        const dx = xpos - this.position.x;
        const dy = ypos - this.position.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance === 0)
            return;


        const targetX = dx / distance;
        const targetY = dy / distance;

        const responsiveness = 3 + this.stats.speed * 0.3;
        const turnStrength = 1 - Math.exp(-responsiveness * delta);


        this.velocity.x += 
            (targetX - this.velocity.x) * turnStrength;

        this.velocity.y += 
            (targetY - this.velocity.y) * turnStrength;


        const speedLength = Math.sqrt(
            this.velocity.x ** 2 +
            this.velocity.y ** 2
        );


        if (speedLength > 0) {
            this.velocity.x /= speedLength;
            this.velocity.y /= speedLength;
        }

        this.move(this.velocity.x, this.velocity.y, delta);
    }

    private wander(canvas: HTMLCanvasElement, delta: number) {
        const turnStrength = 0.3;

        this.velocity.x += (Math.random() - 0.5) * turnStrength;
        this.velocity.y += (Math.random() - 0.5) * turnStrength;

        const length = Math.sqrt(
            this.velocity.x * this.velocity.x +
            this.velocity.y * this.velocity.y
        );

        this.velocity.x /= length;
        this.velocity.y /= length;

        this.move(this.velocity.x, this.velocity.y, delta);
        this.stayInsideBounds(canvas);
    }

    private move(dirX: number, dirY: number, delta: number) {
        const energyRatio = this.state.energy / this.stats.maxEnergy;
        const ageRatio = this.state.age / this.stats.maxAge;

        let slowness = 1;

        if (energyRatio < 0.25) {
            slowness = energyRatio / 0.25;
        }
        else if (ageRatio > 0.8) {
            slowness = 1 - ((ageRatio - 0.8) / 0.2) * 0.5;
        }

        this.position.x += dirX * this.stats.speed * delta * slowness;
        this.position.y += dirY * this.stats.speed * delta * slowness;
    }

    private stayInsideBounds(canvas: HTMLCanvasElement) {
        if (this.position.x <= 0 || this.position.x >= canvas.width) {
            this.position.x = Math.max(0, Math.min(this.position.x, canvas.width));
            this.velocity.x *= -1;
        }

        if (this.position.y <= 0 || this.position.y >= canvas.height) {
            this.position.y = Math.max(0, Math.min(this.position.y, canvas.height));
            this.velocity.y *= -1;
        }
    }

    public isColliding(other: Creature): boolean {
        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;

        const distance = Math.sqrt(dx*dx + dy*dy);

        return distance < this.stats.size + other.stats.size;
    }

    public attack(target?: Creature) {
        if (!target)
            return;

        let hitChance = 0.7; // base accuracy

        // bigger creatures are easier to land hits with
        hitChance += (this.stats.size - target.stats.size) * 0.02;

        // faster creatures are harder to hit
        hitChance -= target.genes.speed * 0.02;

        hitChance = Math.max(0.1, Math.min(0.95, hitChance));

        if (Math.random() < hitChance) {
            target.takeDamage(this.stats.damage, this);
        }

        this.targetCreature = undefined;
        this.behaviour = CreatureState.Wandering;
    }

    public takeDamage(amount: number, attacker?: Creature) {

        this.state.health -= amount;

        this.damageFlash = this.damageFlashDuration;

        if (this.state.health <= 0) {

            this.die();

            if (attacker) {
                attacker.state.energy += this.state.energy;

                attacker.state.energy = Math.min(
                    attacker.state.energy,
                    attacker.stats.maxEnergy
                );

                attacker.state.health += this.stats.maxHealth * 0.25;

                attacker.state.health = Math.min(
                    attacker.state.health,
                    attacker.stats.maxHealth
                );
            }
        }
    }

    public bounceFrom(other: Creature) {

        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;

        const length = Math.sqrt(dx * dx + dy * dy);

        const strengthDifference = other.genes.strength - this.genes.strength;

        const knockback = 2 + Math.max(0, strengthDifference) * 0.5;


        this.velocity.x += (dx / length) * knockback;
        this.velocity.y += (dy / length) * knockback;
    }

    private die() {
        this.state.alive = false;
    }

    public draw(ctx: CanvasRenderingContext2D) {

        if (!this.state.alive) {
            addDeathAnimation(ctx, this);
            return;
        }

        ctx.beginPath();
        const radius = 3 + this.stats.size;

        const squish =
            1 + (this.genes.size / 10) * 0.2;

        ctx.ellipse(
            this.position.x,
            this.position.y,
            radius * squish,
            radius,
            0,
            0,
            Math.PI * 2
        );

        this.addStrengthOutline(ctx);

        ctx.fillStyle = getColor(this.clan, this.genes);
        ctx.fill();

        addEyes(ctx, this);
        //addLegs(ctx, this);

        // damage flash overlay
        if (this.damageFlash > 0) {
            addDamageFlash(ctx, this);
        }
    }

    private addStrengthOutline(ctx: CanvasRenderingContext2D)
    {
        ctx.shadowBlur = this.genes.strength * 2;
        ctx.shadowColor = getColor(this.clan, this.genes);

        ctx.lineWidth = this.genes.strength / 5;
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.stroke();
    }
}