export const dsaProblems = [
  // DAY 1
  { id: 1, day: 1, title: "Contains Duplicate", leetcodeId: 217, level: "Easy", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/contains-duplicate/", hint: "Use a HashSet to keep track of elements you have seen so far in O(1) average time." },
  { id: 2, day: 1, title: "Valid Anagram", leetcodeId: 242, level: "Easy", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/valid-anagram/", hint: "Count frequencies using an array of size 26 or a HashMap." },
  { id: 3, day: 1, title: "Two Sum", leetcodeId: 1, level: "Easy", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/two-sum/", hint: "Map each value to its index; for each x check if (target - x) is in map." },

  // DAY 2
  { id: 4, day: 2, title: "Valid Palindrome", leetcodeId: 125, level: "Easy", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/valid-palindrome/", hint: "Use two pointers from left and right, ignoring non-alphanumeric chars." },
  { id: 5, day: 2, title: "Best Time to Buy and Sell Stock", leetcodeId: 121, level: "Easy", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", hint: "Track minimum price seen so far and maximum profit achievable." },
  { id: 6, day: 2, title: "Group Anagrams", leetcodeId: 49, level: "Medium", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/group-anagrams/", hint: "Use sorted string or char frequency array tuple as key in a HashMap." },

  // DAY 3
  { id: 7, day: 3, title: "Longest Common Prefix", leetcodeId: 14, level: "Easy", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-common-prefix/", hint: "Compare char by char across all strings or sort strings and compare first/last." },
  { id: 8, day: 3, title: "Majority Element", leetcodeId: 169, level: "Easy", topic: "Sliding Window", url: "https://leetcode.com/problems/majority-element/", hint: "Use Boyer-Moore Voting Algorithm for O(1) extra space." },
  { id: 9, day: 3, title: "Longest Substring Without Repeating Characters", leetcodeId: 3, level: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", hint: "Sliding window with HashSet or HashMap storing last seen indices." },

  // DAY 4
  { id: 10, day: 4, title: "Roman to Integer", leetcodeId: 13, level: "Easy", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/roman-to-integer/", hint: "If current val < next val, subtract current val; else add it." },
  { id: 11, day: 4, title: "Move Zeroes", leetcodeId: 283, level: "Easy", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/move-zeroes/", hint: "Two pointers: place pointer tracks next position for non-zero element." },
  { id: 12, day: 4, title: "Top K Frequent Elements", leetcodeId: 347, level: "Medium", topic: "Arrays & Hashing", url: "https://leetcode.com/problems/top-k-frequent-elements/", hint: "Use Bucket Sort by frequency or a Min-Heap of size K." },

  // DAY 5
  { id: 13, day: 5, title: "Remove Duplicates from Sorted Array", leetcodeId: 26, level: "Easy", topic: "Two Pointers", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", hint: "Use slow/fast pointers on sorted array." },
  { id: 14, day: 5, title: "Merge Sorted Array", leetcodeId: 88, level: "Easy", topic: "Two Pointers", url: "https://leetcode.com/problems/merge-sorted-array/", hint: "Fill from the back (right to left) to avoid overwriting elements." },
  { id: 15, day: 5, title: "3Sum", leetcodeId: 15, level: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/3sum/", hint: "Sort array, fix first element i, then use two pointers (left & right)." },

  // DAY 6
  { id: 16, day: 6, title: "Valid Parentheses", leetcodeId: 20, level: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", hint: "Push opening brackets to stack, match closing brackets with top." },
  { id: 17, day: 6, title: "Implement Stack using Queues", leetcodeId: 225, level: "Easy", topic: "Stack", url: "https://leetcode.com/problems/implement-stack-using-queues/", hint: "Rotate queue elements on push so top element is always at front." },
  { id: 18, day: 6, title: "Min Stack", leetcodeId: 155, level: "Medium", topic: "Stack", url: "https://leetcode.com/problems/min-stack/", hint: "Maintain a secondary min stack or push pairs (val, current_min)." },

  // DAY 7
  { id: 19, day: 7, title: "Implement Queue using Stacks", leetcodeId: 232, level: "Easy", topic: "Stack (Monotonic Stack)", url: "https://leetcode.com/problems/implement-queue-using-stacks/", hint: "Use input stack and output stack; push to input, pop from output." },
  { id: 20, day: 7, title: "Next Greater Element I", leetcodeId: 496, level: "Easy", topic: "Stack (Monotonic Stack)", url: "https://leetcode.com/problems/next-greater-element-i/", hint: "Use a monotonic decreasing stack + hash map." },
  { id: 21, day: 7, title: "Daily Temperatures", leetcodeId: 739, level: "Medium", topic: "Stack (Monotonic Stack)", url: "https://leetcode.com/problems/daily-temperatures/", hint: "Monotonic decreasing stack of indices." },

  // DAY 8
  { id: 22, day: 8, title: "Binary Search", leetcodeId: 704, level: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/binary-search/", hint: "Low, high, mid = low + (high - low) / 2." },
  { id: 23, day: 8, title: "First Bad Version", leetcodeId: 278, level: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/first-bad-version/", hint: "Binary search range [1, n]; shrink high when bad, low when good." },
  { id: 24, day: 8, title: "Search in Rotated Sorted Array", leetcodeId: 33, level: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", hint: "One half (left or right) is always sorted; determine which half." },

  // DAY 9
  { id: 25, day: 9, title: "Reverse Linked List", leetcodeId: 206, level: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", hint: "3 pointers: prev = null, curr = head, next." },
  { id: 26, day: 9, title: "Merge Two Sorted Lists", leetcodeId: 21, level: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/merge-two-sorted-lists/", hint: "Use dummy head node to attach smaller nodes step by step." },
  { id: 27, day: 9, title: "Remove Nth Node From End of List", leetcodeId: 19, level: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", hint: "Two pointers separated by n steps; advance together till fast reaches end." },

  // DAY 10
  { id: 28, day: 10, title: "Linked List Cycle", leetcodeId: 141, level: "Easy", topic: "Linked List (Fast & Slow)", url: "https://leetcode.com/problems/linked-list-cycle/", hint: "Floyd's fast & slow pointers: slow 1 step, fast 2 steps." },
  { id: 29, day: 10, title: "Middle of the Linked List", leetcodeId: 876, level: "Easy", topic: "Linked List (Fast & Slow)", url: "https://leetcode.com/problems/middle-of-the-linked-list/", hint: "When fast reaches end, slow is exactly at middle node." },
  { id: 30, day: 10, title: "Add Two Numbers", leetcodeId: 2, level: "Medium", topic: "Linked List (Fast & Slow)", url: "https://leetcode.com/problems/add-two-numbers/", hint: "Simulate column-by-column addition with carry." },

  // DAY 11
  { id: 31, day: 11, title: "Intersection of Two Linked Lists", leetcodeId: 160, level: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/intersection-of-two-linked-lists/", hint: "Two pointers: when p1 hits end switch to headB; p2 to headA." },
  { id: 32, day: 11, title: "Palindrome Linked List", leetcodeId: 234, level: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/palindrome-linked-list/", hint: "Find middle using fast/slow, reverse second half, compare." },
  { id: 33, day: 11, title: "Copy List with Random Pointer", leetcodeId: 138, level: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", hint: "HashMap mapping old node -> new node, or interleave new nodes." },

  // DAY 12
  { id: 34, day: 12, title: "Maximum Depth of Binary Tree", leetcodeId: 104, level: "Easy", topic: "Trees (DFS Traversal)", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", hint: "1 + max(depth(left), depth(right))." },
  { id: 35, day: 12, title: "Binary Tree Inorder Traversal", leetcodeId: 94, level: "Easy", topic: "Trees (DFS Traversal)", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/", hint: "Recursive DFS (left, root, right) or explicit stack." },
  { id: 36, day: 12, title: "Binary Tree Level Order Traversal", leetcodeId: 102, level: "Medium", topic: "Trees (DFS Traversal)", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", hint: "BFS with Queue, tracking size at each level." },

  // DAY 13
  { id: 37, day: 13, title: "Same Tree", leetcodeId: 100, level: "Easy", topic: "Trees (Recursive)", url: "https://leetcode.com/problems/same-tree/", hint: "Check p.val == q.val and recursively check left & right." },
  { id: 38, day: 13, title: "Invert Binary Tree", leetcodeId: 226, level: "Easy", topic: "Trees (Recursive)", url: "https://leetcode.com/problems/invert-binary-tree/", hint: "Swap left and right children recursively for all nodes." },
  { id: 39, day: 13, title: "Validate Binary Search Tree", leetcodeId: 98, level: "Medium", topic: "Trees (Recursive)", url: "https://leetcode.com/problems/validate-binary-search-tree/", hint: "Pass range [min_val, max_val] down recursively." },

  // DAY 14
  { id: 40, day: 14, title: "Search in a Binary Search Tree", leetcodeId: 700, level: "Easy", topic: "Trees (BST + Heap)", url: "https://leetcode.com/problems/search-in-a-binary-search-tree/", hint: "If target < root.val go left, else go right." },
  { id: 41, day: 14, title: "Kth Largest Element in a Stream", leetcodeId: 703, level: "Easy", topic: "Trees (BST + Heap)", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", hint: "Maintain a Min-Heap of size K." },
  { id: 42, day: 14, title: "Kth Smallest Element in a BST", leetcodeId: 230, level: "Medium", topic: "Trees (BST + Heap)", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", hint: "Inorder traversal visits BST nodes in sorted order." },

  // DAY 15
  { id: 43, day: 15, title: "Symmetric Tree", leetcodeId: 101, level: "Easy", topic: "Mixed Review Foundation", url: "https://leetcode.com/problems/symmetric-tree/", hint: "Helper isMirror(t1, t2): compare t1.val == t2.val and mirrored subtrees." },
  { id: 44, day: 15, title: "Balanced Binary Tree", leetcodeId: 110, level: "Easy", topic: "Mixed Review Foundation", url: "https://leetcode.com/problems/balanced-binary-tree/", hint: "Return depth if balanced, -1 if imbalanced." },
  { id: 45, day: 15, title: "Lowest Common Ancestor of a BST", leetcodeId: 235, level: "Medium", topic: "Mixed Review Foundation", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", hint: "If both p and q < root go left; if both > root go right; else root is LCA." },

  // DAY 16
  { id: 46, day: 16, title: "Climbing Stairs", leetcodeId: 70, level: "Easy", topic: "Backtracking", url: "https://leetcode.com/problems/climbing-stairs/", hint: "Fibonacci pattern: dp[i] = dp[i-1] + dp[i-2]." },
  { id: 47, day: 16, title: "Subsets", leetcodeId: 78, level: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/subsets/", hint: "Backtracking choice tree: include current element or skip it." },
  { id: 48, day: 16, title: "Permutations", leetcodeId: 46, level: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/permutations/", hint: "Track visited elements in boolean array or swap elements." },

  // DAY 17
  { id: 49, day: 17, title: "Happy Number", leetcodeId: 202, level: "Easy", topic: "Backtracking", url: "https://leetcode.com/problems/happy-number/", hint: "Use HashSet or fast/slow pointers to detect cycle in sum of squared digits." },
  { id: 50, day: 17, title: "Combination Sum", leetcodeId: 39, level: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/combination-sum/", hint: "Can reuse same element: recurse with index i." },
  { id: 51, day: 17, title: "Combination Sum II", leetcodeId: 40, level: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/combination-sum-ii/", hint: "Sort input, skip duplicate elements at same recursion level." },

  // DAY 18
  { id: 52, day: 18, title: "Single Number", leetcodeId: 136, level: "Easy", topic: "Backtracking + Tries", url: "https://leetcode.com/problems/single-number/", hint: "Bitwise XOR: x ^ x = 0 and x ^ 0 = x." },
  { id: 53, day: 18, title: "Subsets II", leetcodeId: 90, level: "Medium", topic: "Backtracking + Tries", url: "https://leetcode.com/problems/subsets-ii/", hint: "Sort elements, skip duplicates during backtracking." },
  { id: 54, day: 18, title: "Implement Trie (Prefix Tree)", leetcodeId: 208, level: "Medium", topic: "Backtracking + Tries", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", hint: "TrieNode with array of 26 children + isEndOfWord boolean." },

  // DAY 19
  { id: 55, day: 19, title: "Flood Fill", leetcodeId: 733, level: "Easy", topic: "Graphs (BFS/DFS)", url: "https://leetcode.com/problems/flood-fill/", hint: "DFS/BFS from starting cell, update matching original color cells." },
  { id: 56, day: 19, title: "Number of Islands", leetcodeId: 200, level: "Medium", topic: "Graphs (BFS/DFS)", url: "https://leetcode.com/problems/number-of-islands/", hint: "Iterate grid; when cell is '1', increment island count & run DFS to sink it." },
  { id: 57, day: 19, title: "Clone Graph", leetcodeId: 133, level: "Medium", topic: "Graphs (BFS/DFS)", url: "https://leetcode.com/problems/clone-graph/", hint: "HashMap mapping original node -> cloned node to prevent infinite loops." },

  // DAY 20
  { id: 58, day: 20, title: "Missing Number", leetcodeId: 268, level: "Easy", topic: "Graphs (Topological Sort)", url: "https://leetcode.com/problems/missing-number/", hint: "Expected sum n*(n+1)/2 minus actual array sum." },
  { id: 59, day: 20, title: "Course Schedule", leetcodeId: 207, level: "Medium", topic: "Graphs (Topological Sort)", url: "https://leetcode.com/problems/course-schedule/", hint: "Detect cycle in directed graph (Kahn's in-degree BFS or DFS visiting states)." },
  { id: 60, day: 20, title: "Rotting Oranges", leetcodeId: 994, level: "Medium", topic: "Graphs (Topological Sort)", url: "https://leetcode.com/problems/rotting-oranges/", hint: "Multi-source BFS starting with all initial rotten oranges in queue." },

  // DAY 21
  { id: 61, day: 21, title: "Plus One", leetcodeId: 66, level: "Easy", topic: "1-D Dynamic Programming", url: "https://leetcode.com/problems/plus-one/", hint: "Traverse right-to-left, handling carry." },
  { id: 62, day: 21, title: "House Robber", leetcodeId: 198, level: "Medium", topic: "1-D Dynamic Programming", url: "https://leetcode.com/problems/house-robber/", hint: "dp[i] = max(dp[i-1], dp[i-2] + nums[i])." },
  { id: 63, day: 21, title: "Coin Change", leetcodeId: 322, level: "Medium", topic: "1-D Dynamic Programming", url: "https://leetcode.com/problems/coin-change/", hint: "dp[a] = min(dp[a], 1 + dp[a - coin]) for each coin." },

  // DAY 22
  { id: 64, day: 22, title: "Maximum Subarray", leetcodeId: 53, level: "Medium", topic: "1-D Dynamic Programming", url: "https://leetcode.com/problems/maximum-subarray/", hint: "Kadane's Algorithm: max_ending_here = max(num, max_ending_here + num)." },
  { id: 65, day: 22, title: "Longest Increasing Subsequence", leetcodeId: 300, level: "Medium", topic: "1-D Dynamic Programming", url: "https://leetcode.com/problems/longest-increasing-subsequence/", hint: "O(n^2) DP or O(n log n) with patience sorting + binary search." },
  { id: 66, day: 22, title: "Maximum Product Subarray", leetcodeId: 152, level: "Medium", topic: "1-D Dynamic Programming", url: "https://leetcode.com/problems/maximum-product-subarray/", hint: "Maintain both min_prod and max_prod due to negative numbers." },

  // DAY 23
  { id: 67, day: 23, title: "Unique Paths", leetcodeId: 62, level: "Medium", topic: "2-D Dynamic Programming", url: "https://leetcode.com/problems/unique-paths/", hint: "dp[r][c] = dp[r-1][c] + dp[r][c-1]." },
  { id: 68, day: 23, title: "Minimum Path Sum", leetcodeId: 64, level: "Medium", topic: "2-D Dynamic Programming", url: "https://leetcode.com/problems/minimum-path-sum/", hint: "dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])." },
  { id: 69, day: 23, title: "Longest Common Subsequence", leetcodeId: 1143, level: "Medium", topic: "2-D Dynamic Programming", url: "https://leetcode.com/problems/longest-common-subsequence/", hint: "If s1[i] == s2[j]: 1 + dp[i+1][j+1]; else max(dp[i+1][j], dp[i][j+1])." },

  // DAY 24
  { id: 70, day: 24, title: "Number of 1 Bits", leetcodeId: 191, level: "Easy", topic: "Greedy", url: "https://leetcode.com/problems/number-of-1-bits/", hint: "n &= (n - 1) clears lowest set bit." },
  { id: 71, day: 24, title: "Jump Game", leetcodeId: 55, level: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game/", hint: "Greedy goal pointer: shift goal backwards if current index + max_jump >= goal." },
  { id: 72, day: 24, title: "Merge Intervals", leetcodeId: 56, level: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/merge-intervals/", hint: "Sort by start time, merge if next.start <= prev.end." },

  // DAY 25
  { id: 73, day: 25, title: "Kth Largest Element in an Array", leetcodeId: 215, level: "Medium", topic: "Intervals + Heap", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", hint: "Min-Heap of size K or QuickSelect algorithm." },
  { id: 74, day: 25, title: "Insert Interval", leetcodeId: 57, level: "Medium", topic: "Intervals + Heap", url: "https://leetcode.com/problems/insert-interval/", hint: "Add before, merge overlapping, add remaining after." },
  { id: 75, day: 25, title: "Task Scheduler", leetcodeId: 621, level: "Medium", topic: "Intervals + Heap", url: "https://leetcode.com/problems/task-scheduler/", hint: "Max-heap for frequencies or math formula based on max frequency task." },

  // DAY 26
  { id: 76, day: 26, title: "Set Matrix Zeroes", leetcodeId: 73, level: "Medium", topic: "Math & Matrix", url: "https://leetcode.com/problems/set-matrix-zeroes/", hint: "Use first row and first column as markers." },
  { id: 77, day: 26, title: "Rotate Image", leetcodeId: 48, level: "Medium", topic: "Math & Matrix", url: "https://leetcode.com/problems/rotate-image/", hint: "Transpose matrix then reverse each row." },
  { id: 78, day: 26, title: "Pow(x, n)", leetcodeId: 50, level: "Medium", topic: "Math & Matrix", url: "https://leetcode.com/problems/powx-n/", hint: "Binary Exponentiation: x^n = (x^(n/2))^2." },

  // DAY 27
  { id: 79, day: 27, title: "Sort Colors", leetcodeId: 75, level: "Medium", topic: "Sorting & Arrays", url: "https://leetcode.com/problems/sort-colors/", hint: "Dutch National Flag: 3 pointers (low, mid, high)." },
  { id: 80, day: 27, title: "4Sum", leetcodeId: 18, level: "Medium", topic: "Sorting & Arrays", url: "https://leetcode.com/problems/4sum/", hint: "Sort, nested loops for i and j, two pointers for remaining two." },
  { id: 81, day: 27, title: "Next Permutation", leetcodeId: 31, level: "Medium", topic: "Sorting & Arrays", url: "https://leetcode.com/problems/next-permutation/", hint: "Find pivot where nums[i] < nums[i+1], swap with next greater, reverse right." },

  // DAY 28
  { id: 82, day: 28, title: "Word Break", leetcodeId: 139, level: "Medium", topic: "Interview-Level Mix I", url: "https://leetcode.com/problems/word-break/", hint: "dp[i] = true if dp[j] is true and s[j..i] in wordDict." },
  { id: 83, day: 28, title: "Edit Distance", leetcodeId: 72, level: "Medium", topic: "Interview-Level Mix I", url: "https://leetcode.com/problems/edit-distance/", hint: "2D DP: min(insert, delete, replace)." },
  { id: 84, day: 28, title: "Trapping Rain Water", leetcodeId: 42, level: "Hard", topic: "Interview-Level Mix I", url: "https://leetcode.com/problems/trapping-rain-water/", hint: "Two pointers tracking left_max and right_max." },

  // DAY 29
  { id: 85, day: 29, title: "Sliding Window Maximum", leetcodeId: 239, level: "Hard", topic: "Interview-Level Mix II", url: "https://leetcode.com/problems/sliding-window-maximum/", hint: "Monotonic decreasing Deque storing indices." },
  { id: 86, day: 29, title: "Largest Rectangle in Histogram", leetcodeId: 84, level: "Hard", topic: "Interview-Level Mix II", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", hint: "Monotonic increasing stack storing pairs of (index, height)." },
  { id: 87, day: 29, title: "Serialize and Deserialize Binary Tree", leetcodeId: 297, level: "Hard", topic: "Interview-Level Mix II", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", hint: "Preorder DFS with delimiter and 'N' for null nodes." },

  // DAY 30
  { id: 88, day: 30, title: "Merge k Sorted Lists", leetcodeId: 23, level: "Hard", topic: "Final Capstone Mock", url: "https://leetcode.com/problems/merge-k-sorted-lists/", hint: "Min-Heap of list heads or divide and conquer list merging." },
  { id: 89, day: 30, title: "Binary Tree Maximum Path Sum", leetcodeId: 124, level: "Hard", topic: "Final Capstone Mock", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", hint: "DFS returning max branch sum; global max updates with left + val + right." },
  { id: 90, day: 30, title: "Reverse Nodes in k-Group", leetcodeId: 25, level: "Hard", topic: "Final Capstone Mock", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", hint: "Check if k nodes exist, reverse k nodes, reattach recursively." }
];
