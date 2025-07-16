-- Sample Data for Oasis Protocol Platform
-- Run this after creating the tables to populate with test data

-- Insert sample challenges
INSERT INTO [Challenges] ([Title], [Description], [Points], [IsActive], [CreatedAt])
VALUES 
('Array Manipulation Challenge', 'Solve complex array problems to unlock the matrix buildathon.', 100, 1, GETUTCDATE()),
('String Algorithm Quest', 'Master string algorithms to access the cryptography buildathon.', 150, 1, GETUTCDATE()),
('Graph Theory Adventure', 'Navigate through graph problems to unlock the network buildathon.', 200, 1, GETUTCDATE()),
('Dynamic Programming Odyssey', 'Conquer DP problems to access the optimization buildathon.', 250, 1, GETUTCDATE()),
('Data Structure Mastery', 'Implement efficient data structures for the system design buildathon.', 300, 1, GETUTCDATE());

-- Insert algorithmic problems for each challenge
INSERT INTO [AlgorithmicProblems] ([ChallengeId], [Title], [ProblemStatement], [InputFormat], [OutputFormat], [Constraints], [SampleInput], [SampleOutput], [TestCases], [TimeLimit], [MemoryLimit], [CreatedAt])
VALUES 
(1, 'Two Sum Problem', 
'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
'First line contains n (size of array)
Second line contains n integers
Third line contains target integer',
'Two integers representing the indices',
'2 <= n <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9',
'4
2 7 11 15
9',
'0 1',
'[{"input":"4\n2 7 11 15\n9","output":"0 1"},{"input":"3\n3 2 4\n6","output":"1 2"},{"input":"2\n3 3\n6","output":"0 1"}]',
2, 128, GETUTCDATE()),

(2, 'Longest Palindromic Substring',
'Given a string s, return the longest palindromic substring in s.

A palindrome is a string that reads the same forward and backward.',
'A single line containing string s',
'The longest palindromic substring',
'1 <= s.length <= 1000
s consist of only digits and English letters',
'babad',
'bab',
'[{"input":"babad","output":"bab"},{"input":"cbbd","output":"bb"},{"input":"a","output":"a"}]',
2, 128, GETUTCDATE()),

(3, 'Number of Islands',
'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
'First line contains m and n
Next m lines contain n characters each (0 or 1)',
'Number of islands',
'1 <= m, n <= 300',
'4 5
11110
11010
11000
00000',
'1',
'[{"input":"4 5\n11110\n11010\n11000\n00000","output":"1"},{"input":"4 5\n11000\n11000\n00100\n00011","output":"3"}]',
2, 128, GETUTCDATE()),

(4, 'Longest Increasing Subsequence',
'Given an integer array nums, return the length of the longest strictly increasing subsequence.

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.',
'First line contains n
Second line contains n integers',
'Length of longest increasing subsequence',
'1 <= nums.length <= 2500
-10^4 <= nums[i] <= 10^4',
'4
10 9 2 5',
'3',
'[{"input":"4\n10 9 2 5","output":"3"},{"input":"7\n0 1 0 3 2 3","output":"4"},{"input":"8\n7 7 7 7 7 7 7","output":"1"}]',
2, 128, GETUTCDATE()),

(5, 'Implement Trie',
'Implement a trie with insert, search, and startsWith methods.

Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // return True
trie.search("app");     // return False
trie.startsWith("app"); // return True',
'Multiple lines with operations:
INSERT word
SEARCH word  
STARTSWITH prefix',
'For each SEARCH and STARTSWITH: True or False',
'1 <= word.length, prefix.length <= 2000
word and prefix consist only of lowercase English letters
At most 3 * 10^4 calls to insert, search, and startsWith',
'INSERT apple
SEARCH apple
SEARCH app
STARTSWITH app',
'True
False
True',
'[{"input":"INSERT apple\nSEARCH apple\nSEARCH app\nSTARTSWITH app","output":"True\nFalse\nTrue"}]',
2, 128, GETUTCDATE());

-- Insert buildathon problems for each challenge
INSERT INTO [BuildathonProblems] ([ChallengeId], [Title], [Description], [Requirements], [Deliverables], [EvaluationCriteria], [TimeLimit], [CreatedAt])
VALUES 
(1, 'Matrix Processing System',
'Build a web application that can process and visualize large matrices with real-time operations.',
'- Create a web interface for matrix input
- Implement matrix operations (multiplication, transpose, determinant)
- Add real-time visualization
- Support matrices up to 1000x1000
- Include performance optimization',
'- GitHub repository with source code
- Live demo URL (deployed application)
- README with setup instructions
- Performance benchmarking results',
'- Code quality and architecture (30%)
- User interface and experience (25%)
- Performance and optimization (25%)
- Documentation and testing (20%)',
24, GETUTCDATE()),

(2, 'Cryptography Vault',
'Develop a secure text encryption/decryption system with multiple algorithms.',
'- Implement at least 3 encryption algorithms
- Create a secure key management system
- Build a user-friendly interface
- Add file encryption support
- Include security audit features',
'- GitHub repository with complete source code
- Deployed web application
- Security documentation
- Algorithm comparison analysis',
'- Security implementation (35%)
- Algorithm variety and correctness (25%)
- User interface (20%)
- Documentation and testing (20%)',
24, GETUTCDATE()),

(3, 'Network Topology Visualizer',
'Create an interactive network topology visualization and analysis tool.',
'- Build interactive graph visualization
- Implement network analysis algorithms
- Add real-time network monitoring
- Support various graph formats
- Include pathfinding algorithms',
'- GitHub repository with source code
- Interactive web application
- Network analysis reports
- Performance benchmarks',
'- Visualization quality (30%)
- Algorithm implementation (30%)
- User interaction (20%)
- Performance and scalability (20%)',
24, GETUTCDATE()),

(4, 'Optimization Engine',
'Build an optimization engine that solves various optimization problems.',
'- Implement multiple optimization algorithms
- Create a problem definition interface
- Add visualization of optimization process
- Support scheduling and resource allocation
- Include performance comparisons',
'- GitHub repository with complete code
- Web-based optimization interface
- Algorithm comparison study
- Real-world use cases',
'- Algorithm implementation (35%)
- Problem-solving capability (25%)
- Interface and visualization (20%)
- Documentation and examples (20%)',
24, GETUTCDATE()),

(5, 'Distributed System Simulator',
'Create a simulator for distributed systems with various consistency models.',
'- Simulate distributed nodes
- Implement different consistency models
- Add failure simulation and recovery
- Create monitoring dashboard
- Include performance metrics',
'- GitHub repository with source code
- Simulation dashboard
- Consistency model analysis
- Performance evaluation report',
'- System design and architecture (35%)
- Simulation accuracy (25%)
- Monitoring and visualization (20%)
- Documentation and analysis (20%)',
24, GETUTCDATE());

-- Insert flags for each challenge
INSERT INTO [Flags] ([ChallengeId], [Value], [IsActive], [CreatedAt])
VALUES 
(1, 'OASIS{tw0_sum_m4st3r_2025}', 1, GETUTCDATE()),
(2, 'OASIS{p4l1ndr0m3_k1ng_2025}', 1, GETUTCDATE()),
(3, 'OASIS{1sl4nd_n4v1g4t0r_2025}', 1, GETUTCDATE()),
(4, 'OASIS{dp_0pt1m1z3r_2025}', 1, GETUTCDATE()),
(5, 'OASIS{tr13_m4st3r_2025}', 1, GETUTCDATE());

PRINT 'Sample data inserted successfully!';
PRINT '';
PRINT 'Challenges created:';
PRINT '1. Array Manipulation Challenge (100 points)';
PRINT '2. String Algorithm Quest (150 points)';
PRINT '3. Graph Theory Adventure (200 points)';
PRINT '4. Dynamic Programming Odyssey (250 points)';
PRINT '5. Data Structure Mastery (300 points)';
PRINT '';
PRINT 'Each challenge includes:';
PRINT '- Algorithmic problem with test cases';
PRINT '- Buildathon problem with requirements';
PRINT '- Flag for validation';
PRINT '';
PRINT 'Teams can now register and start solving challenges!';
PRINT 'Admin credentials: admin@oasis.com / Admin@123456';
