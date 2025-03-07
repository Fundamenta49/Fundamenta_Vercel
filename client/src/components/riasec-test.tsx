import { useReducer } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Simple initial state
type State = {
  currentQuestion: number;
  answer: string;
};

type Action = 
  | { type: 'SET_ANSWER'; payload: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' };

const initialState: State = {
  currentQuestion: 0,
  answer: '',
};

function reducer(state: State, action: Action): State {
  console.log('Reducer action:', action.type, 'Current state:', state);

  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answer: action.payload,
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        answer: '',
      };
    case 'PREV_QUESTION':
      return {
        ...state,
        currentQuestion: Math.max(0, state.currentQuestion - 1),
        answer: '',
      };
    default:
      return state;
  }
}

const questions = [
  "I like to build things",
  "I enjoy problem solving",
  "I like helping others",
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree"
];

export default function RiasecTest() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log('Current state:', state);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{questions[state.currentQuestion]}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={state.answer}
          onValueChange={(value) => dispatch({ type: 'SET_ANSWER', payload: value })}
        >
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-3 border rounded-lg p-4">
              <RadioGroupItem value={option.toLowerCase().replace(/ /g, '-')} id={option.toLowerCase().replace(/ /g, '-')} />
              <Label htmlFor={option.toLowerCase().replace(/ /g, '-')}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: 'PREV_QUESTION' })}
            disabled={state.currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
            disabled={!state.answer}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}