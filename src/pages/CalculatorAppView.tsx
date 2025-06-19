import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppWindow from '@/components/AppWindow';
import GlobalHeader from '@/components/layout/GlobalHeader';
import MenuBarItem from '@/components/MenuBarItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; // For conditional classes

const CalculatorAppView = () => {
  console.log('CalculatorAppView loaded');
  const navigate = useNavigate();

  const [displayValue, setDisplayValue] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);

  useEffect(() => {
    // Optional: Add keyboard support
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key >= '0' && event.key <= '9') {
        handleDigitClick(event.key);
      } else if (event.key === '.') {
        handleDecimalClick();
      } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        handleOperatorClick(event.key === '*' ? '×' : event.key === '/' ? '÷' : event.key);
      } else if (event.key === 'Enter' || event.key === '=') {
        handleEqualsClick();
      } else if (event.key === 'Backspace') {
        // Basic backspace: clear last digit or reset if error/result shown
        if (displayValue.length > 1 && displayValue !== 'Error') {
          setDisplayValue(displayValue.slice(0, -1));
        } else {
          setDisplayValue('0');
        }
      } else if (event.key === 'Escape') {
        handleClearClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayValue, firstOperand, operator, waitingForSecondOperand]);


  const handleDigitClick = (digit: string) => {
    if (displayValue === 'Error') return;
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const handleDecimalClick = () => {
    if (displayValue === 'Error') return;
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const performCalculation = (): number | 'Error' => {
    const prev = firstOperand;
    const current = parseFloat(displayValue);

    if (prev === null || isNaN(current)) return 'Error'; // Should not happen with proper input handling

    switch (operator) {
      case '+': return prev + current;
      case '−': return prev - current; // Using '−' (minus sign) for display
      case '×': return prev * current; // Using '×' (multiplication sign) for display
      case '÷': 
        if (current === 0) return 'Error'; // Division by zero
        return prev / current;
      default: return parseFloat(displayValue); // Should not happen
    }
  };

  const handleOperatorClick = (nextOperator: string) => {
    if (displayValue === 'Error') { // If previous state was error, reset before new operation
        handleClearClick();
        setFirstOperand(0); // Set first operand to 0 so operation can start
        setOperator(nextOperator);
        setWaitingForSecondOperand(true);
        return;
    }

    const inputValue = parseFloat(displayValue);

    if (isNaN(inputValue)) { // Handle if current displayValue is not a number (e.g. just a decimal point)
        setDisplayValue('Error');
        return;
    }
    
    if (operator && firstOperand !== null && !waitingForSecondOperand) {
      const result = performCalculation();
      if (result === 'Error') {
        setDisplayValue('Error');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        return;
      }
      setDisplayValue(String(result));
      setFirstOperand(result);
    } else {
      setFirstOperand(inputValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const handleEqualsClick = () => {
    if (displayValue === 'Error' || firstOperand === null || operator === null || waitingForSecondOperand) {
      // If in error state, or no operation pending, or just pressed an operator, do nothing or reset.
      // If waitingForSecondOperand is true, it means an operator was the last thing pressed, not a number for the second operand.
      // However, some calculators repeat the last operation if = is pressed again, or use the display value as both operands.
      // For simplicity, we require a full expression.
      return;
    }
    
    const result = performCalculation();
    if (result === 'Error') {
        setDisplayValue('Error');
    } else {
        setDisplayValue(String(result));
    }
    setFirstOperand(null); // Or set to result for chain calculation
    setOperator(null);
    setWaitingForSecondOperand(false); // Ready for new calculation, or display result
};


  const handleClearClick = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const calculatorMenus = (
    <>
      <MenuBarItem
        label="Calculator"
        items={[
          { label: "About Calculator", onClick: () => alert("MacOS Web Simulator - Calculator v1.0 (Mock)") },
          { isSeparator: true },
          { label: "Quit Calculator", shortcut: "⌘Q", onClick: () => navigate('/') }
        ]}
      />
      <MenuBarItem
        label="Edit"
        items={[
          { 
            label: "Copy", 
            shortcut: "⌘C", 
            onClick: () => {
              if (displayValue !== 'Error') {
                navigator.clipboard.writeText(displayValue)
                  .then(() => console.log("Copied to clipboard:", displayValue))
                  .catch(err => console.error('Failed to copy: ', err));
              }
            }
          }
        ]}
      />
      <MenuBarItem
        label="Window"
        items={[
          { label: "Minimize", shortcut: "⌘M", onClick: () => console.log("Minimize Calculator (Mock)") },
          { label: "Close", shortcut: "⌘W", onClick: () => navigate('/') },
        ]}
      />
      <MenuBarItem
        label="Help"
        items={[{ label: "Calculator Help", onClick: () => alert("Enter numbers and perform basic arithmetic operations. (Mock)") }]}
      />
    </>
  );

  const buttonLayout = [
    { label: 'AC', action: handleClearClick, className: 'col-span-2 bg-neutral-400 dark:bg-neutral-500 hover:bg-neutral-500/90 dark:hover:bg-neutral-600 text-black dark:text-white' },
    // { label: '±', action: () => {}, className: 'bg-neutral-400 dark:bg-neutral-500 hover:bg-neutral-500/90 dark:hover:bg-neutral-600 text-black dark:text-white' },
    // { label: '%', action: () => {}, className: 'bg-neutral-400 dark:bg-neutral-500 hover:bg-neutral-500/90 dark:hover:bg-neutral-600 text-black dark:text-white' },
    { label: 'DEL', action: () => { // Basic backspace
        if (displayValue.length > 1 && displayValue !== 'Error') { setDisplayValue(displayValue.slice(0, -1)); }
        else { setDisplayValue('0'); }
      }, 
      className: 'bg-neutral-400 dark:bg-neutral-500 hover:bg-neutral-500/90 dark:hover:bg-neutral-600 text-black dark:text-white' 
    },
    { label: '÷', action: () => handleOperatorClick('÷'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { label: '7', action: () => handleDigitClick('7') },
    { label: '8', action: () => handleDigitClick('8') },
    { label: '9', action: () => handleDigitClick('9') },
    { label: '×', action: () => handleOperatorClick('×'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { label: '4', action: () => handleDigitClick('4') },
    { label: '5', action: () => handleDigitClick('5') },
    { label: '6', action: () => handleDigitClick('6') },
    { label: '−', action: () => handleOperatorClick('−'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { label: '1', action: () => handleDigitClick('1') },
    { label: '2', action: () => handleDigitClick('2') },
    { label: '3', action: () => handleDigitClick('3') },
    { label: '+', action: () => handleOperatorClick('+'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { label: '0', action: () => handleDigitClick('0'), className: 'col-span-2' },
    { label: '.', action: handleDecimalClick },
    { label: '=', action: handleEqualsClick, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  ];

  return (
    <div 
      className="h-screen w-screen flex flex-col bg-neutral-200 dark:bg-neutral-800"
      style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080?macos,desktop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <GlobalHeader activeAppName="Calculator" appSpecificMenus={calculatorMenus} />
      <main className="flex-1 flex items-center justify-center p-4 pt-[calc(1.5rem+1rem)] relative"> {/* pt for GlobalHeader (h-6 = 1.5rem) + some padding */}
        <AppWindow
          id="calculator-app-window"
          title="Calculator"
          icon={<CalculatorIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />}
          initialPosition={{ x: Math.max(0, (window.innerWidth - 320) / 2), y: Math.max(0, (window.innerHeight - 60 - 480) / 2) }} // Centered approx.
          initialSize={{ width: 320, height: 'auto' }} // Auto height based on content
          zIndex={10}
          onClose={() => navigate('/')}
          onMinimize={() => console.log('Minimize Calculator (Mock)')}
          // onMaximize is not typically available for calculator
          onFocus={() => console.log('Calculator focused (Mock)')}
        >
          <Card className="bg-transparent border-none shadow-none"> {/* Calculator body, make it blend with AppWindow's content area */}
            <CardContent className="p-1"> {/* Reduced padding for tighter fit */}
              <Input
                type="text"
                value={displayValue}
                readOnly
                className="w-full h-20 mb-2 text-5xl text-right bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white dark:text-white pr-3"
                placeholder="0"
                aria-label="Calculator display"
              />
              <div className="grid grid-cols-4 gap-1">
                {buttonLayout.map((btn) => (
                  <Button
                    key={btn.label}
                    onClick={btn.action}
                    variant="default"
                    className={cn(
                      "h-16 text-xl rounded-md transition-colors duration-150 ease-in-out",
                      "bg-neutral-200/60 dark:bg-neutral-700/60 hover:bg-neutral-300/80 dark:hover:bg-neutral-600/80 text-black dark:text-white focus:ring-2 focus:ring-blue-500",
                      btn.className
                    )}
                    aria-label={btn.label === 'DEL' ? 'Delete' : btn.label}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </AppWindow>
      </main>
    </div>
  );
};

export default CalculatorAppView;