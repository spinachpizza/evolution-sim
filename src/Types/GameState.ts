export const GameState = {
    Playing: "playing",
    Paused: "paused",
    Stopped: "stopped"
} as const;

export type GameState =
    typeof GameState[keyof typeof GameState];