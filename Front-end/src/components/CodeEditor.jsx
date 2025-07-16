import React from 'react';

const CodeEditor = ({ value, onChange, language, height = '300px' }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const getPlaceholder = () => {
    switch (language) {
      case 'python':
        return `# Write your Python code here
def solution():
    # Your solution here
    pass

# Example:
print("Hello, OASIS!")`;
      case 'javascript':
        return `// Write your JavaScript code here
function solution() {
    // Your solution here
}

// Example:
console.log("Hello, OASIS!");`;
      case 'java':
        return `// Write your Java code here
public class Solution {
    public static void main(String[] args) {
        // Your solution here
        System.out.println("Hello, OASIS!");
    }
}`;
      case 'cpp':
        return `// Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    // Your solution here
    cout << "Hello, OASIS!" << endl;
    return 0;
}`;
      case 'c':
        return `// Write your C code here
#include <stdio.h>

int main() {
    // Your solution here
    printf("Hello, OASIS!\\n");
    return 0;
}`;
      default:
        return 'Write your code here...';
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={getPlaceholder()}
        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-4 text-green-400 font-mono text-sm resize-none focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
        style={{ height }}
        spellCheck={false}
      />
      
      {/* Simple syntax highlighting overlay would go here in a real implementation */}
      <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
        {language.toUpperCase()}
      </div>
    </div>
  );
};

export default CodeEditor;
