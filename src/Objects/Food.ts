import type { Position } from "../Types/Position";

export class Food {

    position: Position = {
        x: 0,
        y: 0
    }

    energy: number;
    size: number;

    constructor(canvas: HTMLCanvasElement, size: number) {

        let padding = 15;
        this.position.x = padding + Math.random() * (canvas.width - padding * 2);
        this.position.y = padding + Math.random() * (canvas.height - padding * 2);

        this.size = size;
        this.energy = 20 + (this.size * 10);
    }

    update() {

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(90, 180, 60, 1)";
        ctx.arc(this.position.x, this.position.y, 1 + this.size, 0, Math.PI * 2);
        ctx.fillStyle = "#6FAE45";
        ctx.fill();
    }
}