import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, Play, Square, RotateCw } from 'lucide-react';

// Interfaces for type safety
interface Step {
  stepNumber: string;
  title: string;
  content: string;
  formula: string;
  bulletPoints: string[];
  dieExample: number;
}

interface FrequencyData {
  [key: number]: number;
}

interface BarChartDataPoint {
  rolls: number;
  frequency: number;
}

interface DieDisplayProps {
  value: number;
}

const DiceProblemSolution: React.FC = () => {
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [frequencies, setFrequencies] = useState<FrequencyData>({});
  const [averageRolls, setAverageRolls] = useState<number>(0);
  const [totalSimulations, setTotalSimulations] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationCount, setSimulationCount] = useState<number>(1000);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isSimulating) {
      intervalId = setInterval(() => {
        simulateDiceRolls(simulationCount);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulating, simulationCount]);

  const simulateDiceRolls = (numSimulations: number): void => {
    const newFrequencies: FrequencyData = {...frequencies};
    
    for (let i = 0; i < numSimulations; i++) {
      let rollCount = 0;
      while (true) {
        rollCount++;
        if (Math.floor(Math.random() * 6) + 1 === 6) {
          newFrequencies[rollCount] = (newFrequencies[rollCount] || 0) + 1;
          break;
        }
      }
    }

    const newTotalSimulations = totalSimulations + numSimulations;
    const newAverageRolls = Object.entries(newFrequencies).reduce(
      (acc, [rolls, freq]) => acc + (Number(rolls) * freq), 0
    ) / newTotalSimulations;

    setFrequencies(newFrequencies);
    setTotalSimulations(newTotalSimulations);
    setAverageRolls(newAverageRolls);
  };

  const steps: Step[] = [
    {
      stepNumber: "Step 1",
      title: "Understanding the Problem",
      content: "Define the random variable X as the number of rolls until we see a 6",
      formula: "X = number of rolls until success (6 appears)",
      bulletPoints: [
        "This is a geometric distribution problem",
        "Each roll is independent",
        "Success means rolling a 6",
        "We continue rolling until we get a 6"
      ],
      dieExample: 6
    },
    {
      stepNumber: "Step 2",
      title: "Calculate Individual Probabilities",
      content: "Find the probability of success on each specific roll",
      formula: "P(X = k) = (5/6)^(k-1) * (1/6)",
      bulletPoints: [
        "First roll (k=1): P(X=1) = 1/6",
        "Second roll (k=2): P(X=2) = (5/6)(1/6)",
        "Third roll (k=3): P(X=3) = (5/6)²(1/6)",
        "Pattern continues..."
      ],
      dieExample: 6
    },
    {
      stepNumber: "Step 3",
      title: "Apply Expected Value Formula",
      content: "Use the geometric distribution formula",
      formula: "E[X] = 1/p = 1/(1/6) = 6",
      bulletPoints: [
        "For geometric distribution, E[X] = 1/p",
        "Probability of success p = 1/6",
        "Therefore, E[X] = 6 rolls",
        "This is our theoretical expectation"
      ],
      dieExample: 6
    },
    {
      stepNumber: "Final Answer",
      title: "Expected Number of Rolls",
      content: "The expected number of rolls until getting a 6 is 6 rolls",
      formula: "E[X] = 6 rolls",
      bulletPoints: [
        "On average, you need to roll 6 times to get a 6",
        "This is a theoretical average",
        "Actual results may vary",
        "Simulation helps verify this result"
      ],
      dieExample: 6
    }
  ];

  const DieDisplay: React.FC<DieDisplayProps> = ({ value }) => (
    <div className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-gray-100 border-gray-300 transition-all duration-200 transform hover:scale-110">
      <div className="grid grid-cols-3 grid-rows-3 gap-1 p-1">
        {[...Array(value)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-black" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold">Expected Number of Rolls Until 6</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Find the expected number of rolls of a fair six-sided die until a 6 appears.
          </p>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Easy
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Mathematics
            </span>
          </div>
        </div>
        <div>
          <img
            src="https://www.crackquant.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcoupon-collectors-problem-2.ad36801c.jpg&w=1920&q=75"
            alt="Die illustration"
            className="w-24 h-24"
          />
        </div>
      </div>

      <button 
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
        onClick={() => setShowSolution(!showSolution)}
      >
        {showSolution ? <ChevronUp /> : <ChevronDown />}
        {showSolution ? "Hide Solution" : "Show Solution"}
      </button>

      {showSolution && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            {steps.map((step, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="mb-2">{step.content}</p>
                    <div className="bg-gray-50 p-4 rounded-md mb-3 flex items-center gap-4">
                      <code className="text-blue-600 flex-1">{step.formula}</code>
                      <DieDisplay value={step.dieExample} />
                    </div>
                    <ul className="list-disc pl-6 space-y-2">
                      {step.bulletPoints.map((point, i) => (
                        <li key={i} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Simulation for the Roll of Die</h2>
            <div className="flex gap-4 mb-4 items-center">
              <button
                className={`flex items-center gap-2 py-2 px-4 rounded ${
                  isSimulating ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
                onClick={() => setIsSimulating(!isSimulating)}
              >
                {isSimulating ? <Square /> : <Play />}
                {isSimulating ? 'Stop' : 'Start'} Simulation
              </button>
              <button
                className="flex items-center gap-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                onClick={() => {
                  setFrequencies({});
                  setAverageRolls(0);
                  setTotalSimulations(0);
                  setIsSimulating(false);
                }}
              >
                <RotateCw />
                Reset
              </button>
              <div className="flex items-center gap-2">
                <label htmlFor="simulations" className="text-sm">Simulations:</label>
                <input
                  type="range"
                  id="simulations"
                  min="100"
                  max="10000"
                  step="100"
                  value={simulationCount}
                  onChange={(e) => setSimulationCount(Number(e.target.value))}
                  className="w-48"
                />
                <span className="text-sm">{simulationCount}</span>
              </div>
            </div>

            <div className="flex justify-between mb-4 text-sm text-gray-600">
              <div>Total Simulations: {totalSimulations}</div>
              <div>Simulated Average Rolls: {averageRolls.toFixed(2)}</div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={Object.entries(frequencies).map(([rolls, freq]) => ({
                    rolls: Number(rolls),
                    frequency: freq as number
                  })).sort((a, b) => a.rolls - b.rolls)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rolls" label={{ value: 'Number of Rolls', position: 'bottom' }} />
                  <YAxis label={{ value: 'Frequency', angle: -90, position: 'left' }} />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#4299e1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceProblemSolution;