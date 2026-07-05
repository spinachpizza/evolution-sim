import { CreaturePanel } from "./Components/CreaturePanel";
import { PopulationBar } from "./Components/PopulationBar";
import { Creature } from "./Objects/Creature/Creature";
import { Food } from "./Objects/Food";
import { CreatureState } from "./Types/CreatureState";
import { GameState } from "./Types/GameState";

export class Game {

    public gameSpeed: number = 1;
    private friendlyFire: boolean = true;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private populationBar : PopulationBar;
    private creaturePanel : CreaturePanel;

    private creatures: Creature[] = [];
    private foods: Food[] = [];

    private lastTime: number = 0;

    private foodInterval = 0.6;
    private maxFood = 45; 
    private foodIndex;
    private foodTimer: number = 0;

    private state: GameState = GameState.Paused;

    constructor(startingCreatures: Creature[], foodIndex: number, friendlyFire: boolean) {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;

        this.populationBar = new PopulationBar();
        this.creaturePanel = new CreaturePanel();

        this.canvas.width = 800;
        this.canvas.height = 800;

        this.creatures = startingCreatures;

        this.friendlyFire = friendlyFire;

        this.foodIndex = foodIndex;
        this.applyFoodSettings(foodIndex);

        document.addEventListener("visibilitychange", this.handleVisibility);
    }

    public start() {

        this.spawnInitialFood(Math.min(45, this.maxFood * 0.75));
        this.state = GameState.Playing;

        requestAnimationFrame(this.gameLoop);
    }

    public stop() {

        this.state = GameState.Stopped;
    }

    private gameLoop = (time: number) => {

        if (this.state === GameState.Stopped)
            return;

        if (this.state === GameState.Playing) {

            let delta = (time - this.lastTime) / 1000;
            this.lastTime = time;

            delta *= this.gameSpeed;
            delta = Math.min(delta, 0.5);

            this.update(delta);

            this.spawnFood(delta);
            this.handleCombat();
            this.cleanup();

            this.draw();

            this.populationBar.update(this.creatures);
            this.creaturePanel.update(this.creatures);
        }

        requestAnimationFrame(this.gameLoop);
    };


    private update(delta: number) {
        for (const creature of this.creatures) {
            const child = creature.update(this.canvas, delta, this.foods, this.creatures);

            if (child) {
                this.creatures.push(child);
            }
        }
    }


    private handleVisibility = () => {
        this.lastTime = performance.now();
    };


    private draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const food of this.foods) {
            food.draw(this.ctx);
        }

        for (const creature of this.creatures) {
            creature.draw(this.ctx);
        }
    }

    private applyFoodSettings(foodIndex: number) {
        let multiplier = ((foodIndex - 1) / 2) + 1;

        this.foodInterval /= multiplier;
        this.maxFood *= multiplier;

        console.log(this.foodInterval + " , " + this.maxFood);
    }

    private spawnFood(delta: number) {
        this.foodTimer += delta;

        const foodRatio = this.foods.length / this.maxFood;

        const dynamicInterval = this.foodInterval * (1 + foodRatio);

        while (this.foodTimer >= dynamicInterval) {
            this.foodTimer -= this.foodInterval;

            this.foods.push(new Food(this.canvas, this.getFoodSize()));
        }
    }

    private spawnInitialFood(amount: number) {

        for (let i = 0; i < amount; i++) {
            this.foods.push(new Food(this.canvas, this.getFoodSize()));
        }
    }

    private getFoodSize() : number {

        const sizes = [2, 3, 4];

        const weights = [
            [0.5, 0.3, 0.2], // food 1
            [0.4, 0.4, 0.2],   // food 2
            [0.25, 0.4, 0.35],   // food 3
            [0.1, 0.3, 0.6]  // food 4
        ][this.foodIndex - 1];

        const r = Math.random();

        let sum = 0;

        for (let i = 0; i < sizes.length; i++) {
            sum += weights[i];
            if (r < sum) return sizes[i];
        }

        return 4;
    }

    private handleCombat() {

        for (let i = 0; i < this.creatures.length; i++) {
            for (let j = i + 1; j < this.creatures.length; j++) {

                const a = this.creatures[i];
                const b = this.creatures[j];

                if (!a.state.alive || !b.state.alive)
                    continue;

                if (a.clan === b.clan && !this.friendlyFire)
                    continue;

                if (!a.isColliding(b))
                    continue;

                // Physical response
                a.bounceFrom(b);
                b.bounceFrom(a);

                // Hunter attacks its target
                if (
                    a.behaviour === CreatureState.Hunting &&
                    a.targetCreature === b
                ) {
                    a.attack(b);
                }

                if (
                    b.behaviour === CreatureState.Hunting &&
                    b.targetCreature === a
                ) {
                    b.attack(a);
                }
            }
        }
    }

    private cleanup() {
        this.creatures = this.creatures.filter(
            c => c.state.alive || c.deathTimer < c.deathDuration
        );
    }
}