import { Logo, getRandomLogos } from "@/lib/logos";

const DEFAULT_LOGO_COUNT = 30;
const INCORRECT_MESSAGE = "Incorrect! Try again.";

type GameState = {
  logoData: Logo[];
  currentLogoIndex: number;
  score: number;
  userGuess: string;
  isCorrect: boolean;
  message: string;
  gameOver: boolean;
};

type Action =
  | { type: "NEXT" }
  | { type: "MAKE_GUESS"; userGuess: string }
  | { type: "GUESS_CORRECT"; message: string }
  | { type: "GUESS_INCORRECT" }
  | { type: "GAME_OVER" }
  | { type: "RESET" };

const initialState: GameState = {
  logoData: getRandomLogos(DEFAULT_LOGO_COUNT),
  currentLogoIndex: 0,
  score: 0,
  userGuess: "",
  isCorrect: false,
  message: "",
  gameOver: false,
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "MAKE_GUESS":
      return { ...state, userGuess: action.userGuess, };
    case "NEXT":
      return {
        ...state,
        currentLogoIndex: state.currentLogoIndex + 1,
        userGuess: "",
        message: "",
        isCorrect: false,
      };
    case "GUESS_CORRECT":
      return {
        ...state,
        score: state.score + 1,
        message: action.message,
        userGuess: "",
        isCorrect: true,
      };
    case "GUESS_INCORRECT":
      return { ...state, message: INCORRECT_MESSAGE };
    case "GAME_OVER":
      return { ...state, gameOver: true };
    case "RESET":
      return { ...initialState, logoData: getRandomLogos(DEFAULT_LOGO_COUNT) };
    default:
      return state;
  }
};

export { gameReducer, initialState };