import type { Clan } from "../../Types/Clan";
import type { Genes } from "../../Types/Genes";
import type { Creature } from "./Creature";

export function addEyes(ctx: CanvasRenderingContext2D, thisCreature: Creature) {

    const eyeSize = thisCreature.genes.vision * 0.4;

    // direction creature is moving
    const angle = Math.atan2(thisCreature.velocity.y, thisCreature.velocity.x);

    const forwardX = Math.cos(angle);
    const forwardY = Math.sin(angle);

    const sideX = -forwardY;
    const sideY = forwardX;

    const distance = thisCreature.genes.size * 0.45;
    const spread = thisCreature.genes.vision * 0.8;

    ctx.fillStyle = "white";

    // left eye
    ctx.beginPath();
    ctx.arc(
        thisCreature.position.x + forwardX * distance + sideX * spread,
        thisCreature.position.y + forwardY * distance + sideY * spread,
        eyeSize,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // right eye
    ctx.beginPath();
    ctx.arc(
        thisCreature.position.x + forwardX * distance - sideX * spread,
        thisCreature.position.y + forwardY * distance - sideY * spread,
        eyeSize,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

/*
export function addLegs(ctx: CanvasRenderingContext2D, thisCreature: Creature) {
    const x = thisCreature.position.x;
    const y = thisCreature.position.y;

    const vx = thisCreature.velocity.x;
    const vy = thisCreature.velocity.y;

    const angle = Math.atan2(vy, vx || 0.0001);

    const forwardX = Math.cos(angle);
    const forwardY = Math.sin(angle);

    const sideX = -forwardY;
    const sideY = forwardX;

    const radius = 3 + thisCreature.stats.size;
    const legLength = radius * 0.3;

    // how much the leg bows outward
    const curveStrength = radius * 0.7;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    //addLeg(ctx, x, y, forwardX, forwardY, sideX, sideY, legLength, radius, curveStrength, false);
    //addLeg(ctx, x, y, forwardX, forwardY, sideX, sideY, legLength, radius, curveStrength, true);
    const baseSideX = sideX;
    const baseSideY = sideY;

    // spread angles (tweak these)
    const spread = 0.65;

    const offsets = [-spread, 0, spread];

    for (const a of offsets) {
        const r = rotate(baseSideX, baseSideY, a);

        addLeg(ctx, x, y, forwardX, forwardY, r.x, r.y, legLength, radius, curveStrength, false);

        addLeg(ctx, x, y, forwardX, forwardY, r.x, r.y, legLength, radius, curveStrength, true);
    }
}

function rotate(x: number, y: number, angle: number) {
    return {
        x: x * Math.cos(angle) - y * Math.sin(angle),
        y: x * Math.sin(angle) + y * Math.cos(angle)
    };
}

/*
function addLeg(ctx: CanvasRenderingContext2D,
    x: number, 
    y: number,
    forwardX: number, 
    forwardY: number,
    sideX: number, 
    sideY: number,
    legLength: number,
    radius: number,
    curveStrength: number,
    isRight = false) {

    // flip side for right leg
    const sx = isRight ? -sideX : sideX;
    const sy = isRight ? -sideY : sideY;

    // Hip position
    const hx = x + sx * radius;
    const hy = y + sy * radius;

    // Foot position: mostly to the side, slightly behind
    const sideAmount = legLength;
    const backAmount = legLength * 0.25; // Increase for further back

    const fx = hx + sx * legLength - forwardX * backAmount;
    const fy = hy + sy * legLength - forwardY * backAmount;

    // Midpoint
    const mx = (hx + fx) / 2;
    const my = (hy + fy) / 2;

    // Control point: midpoint, pushed outward and slightly forwards
    const forwardOffset = legLength * 0.3;

    const cx = mx + sx * curveStrength + forwardX * forwardOffset;
    const cy = my + sy * curveStrength + forwardY * forwardOffset;

    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.quadraticCurveTo(cx, cy, fx, fy);
    ctx.stroke();
}
/*
export function addPincers(ctx: CanvasRenderingContext2D, thisCreature: Creature) {
    const x = thisCreature.position.x;
    const y = thisCreature.position.y;

    const vx = thisCreature.velocity.x;
    const vy = thisCreature.velocity.y;

    const angle = Math.atan2(vy, vx || 0.0001);

    const forwardX = Math.cos(angle);
    const forwardY = Math.sin(angle);

    const sideX = -forwardY;
    const sideY = forwardX;

    const radius = 3 + thisCreature.stats.size;
    const legLength = radius * 0.5;

    // how much the leg bows outward
    const curveStrength = radius * 0.6;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    // LEFT LEG anchor
    //const lx = x + sideX * radius;
    //const ly = y + sideY * radius;

    // left direction (perpendicular to forward)
    const lx = -forwardY;
    const ly = forwardX;

    // combine forward + left (this gives the 45° direction)
    let hx = forwardX + lx;
    let hy = forwardY + ly;

    // normalize result so radius works properly
    const len = Math.sqrt(hx * hx + hy * hy);
    hx /= len;
    hy /= len;

    // final point halfway between forward and left
    const px = x + hx * radius;
    const py = y + hy * radius;

    const lfx = px + sideX * 0 + forwardX * legLength;
    const lfy = py + sideY * 0 + forwardY * legLength;

    // control point (push outward for curve)
    const lcx = (px + lfx) / 2 + sideX * curveStrength;
    const lcy = (py + lfy) / 2 + sideY * curveStrength;

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(lcx, lcy, lfx, lfy);
    ctx.stroke();

    const rStartX = x + rx * radius;
    const rStartY = y + ry * radius;

    const rEndX = rStartX + fx * legLength;
    const rEndY = rStartY + fy * legLength;

    const rMidX = (rStartX + rEndX) / 2;
    const rMidY = (rStartY + rEndY) / 2;

    // curve OUTWARD (mirror of left)
    const rCtrlX = rMidX + rx * curveStrength;
    const rCtrlY = rMidY + ry * curveStrength;

    ctx.beginPath();
    ctx.moveTo(rStartX, rStartY);
    ctx.quadraticCurveTo(rCtrlX, rCtrlY, rEndX, rEndY);
    ctx.stroke();
}

function drawLeg2(ctx: CanvasRenderingContext2D, thisCreature: Creature) {

}

function drawCurvedLimb(
    ctx: CanvasRenderingContext2D, 
    sx: number, 
    sy: number, 
    length: number, 
    curveStrength: number, 
    mirror: boolean) {

    // end point (forward direction)
    const ex = sx  * length;
    const ey = sy * length;

    // midpoint
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;

    // control point (curve outward based on side direction)
    const cx = mx * curveStrength;
    const cy = my * curveStrength;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(cx, cy, ex, ey);
    ctx.stroke();
}
*/

export function addDamageFlash(ctx: CanvasRenderingContext2D, thisCreature: Creature) {
    const alpha = thisCreature.damageFlash / thisCreature.damageFlashDuration;

    ctx.beginPath();
    ctx.arc(
        thisCreature.position.x,
        thisCreature.position.y,
        thisCreature.stats.size + 2,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
}

export function addDeathAnimation(ctx: CanvasRenderingContext2D, thisCreature: Creature) {
    const progress = thisCreature.deathTimer / thisCreature.deathDuration;

    ctx.beginPath();

    ctx.arc(
        thisCreature.position.x,
        thisCreature.position.y,
        thisCreature.stats.size * (1 - progress),
        0,
        Math.PI * 2
    );

    ctx.fillStyle = `rgba(150,150,150,${1 - progress})`;
    ctx.fill();
}

export function getColor(clan: Clan, genes: Genes): string {
    let hue = clan.hue;
    let saturation = clan.saturation ?? 70;
    let lightness = clan.lightness ?? 70;

    hue += (genes.speed - 5) * 5;
    hue += (genes.vision -5) * -3;

    lightness -= (genes.strength - 5) * 5;
    saturation += (genes.aggression - 5) * 5;

    hue = (hue + 360) % 360;

    saturation = Math.max(30, Math.min(100, saturation));
    lightness = Math.max(25, Math.min(85, lightness));

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}