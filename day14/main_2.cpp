#include <iostream>
#include <fstream>
#include <map>

using namespace std;

// Part 2, better solution with time complexity O(n) and memory complexity O(1)
typedef unsigned long long N;
typedef map<string, char> InsertionRules;
// Keep track of the number of every current pair
typedef map<string, N> PairCounts;
// Keep track of the number of insertions of every type
typedef map<char, N> Counts;

void countElement(Counts& counts, char element, N count) {
  auto f = counts.find(element);
  if (f == counts.end()) {
    counts.insert(make_pair(element, count));
  } else {
    counts.erase(element);
    counts.insert(make_pair(element, f->second + count));
  }
}

void countPair(PairCounts& counts, string pair, N count) {
  auto f = counts.find(pair);
  if (f == counts.end()) {
    counts.insert(make_pair(pair, count));
  } else {
    counts.erase(pair);
    counts.insert(make_pair(pair, f->second + count));
  }
}

void printRules(InsertionRules const& insertionRules) {
  for (auto a : insertionRules) {
    cout << a.first << " -> " << a.second << endl;
  }
  cout << endl;
}

void printConfiguration(Counts const& counts, PairCounts const& pairCounts) {
  for (auto c : pairCounts) {
    cout << c.first << ": " << c.second << endl;
  }
  cout << endl;
  for (auto c : counts) {
    cout << c.first << ": " << c.second << endl;
  }
  cout << endl;
}

int main() {
  ifstream is("./input2.txt");
  string input;
  is >> input;
  Counts counts;

  for (size_t i = 0; i < input.length(); i++) {
    countElement(counts, input.at(i), 1);
  }

  PairCounts pairCounts;
  for (size_t i = 1; i < input.length(); i++) {
    countPair(pairCounts, string({input.at(i-1), input.at(i)}), 1);
  }

  InsertionRules insertionRules;
  string polymerInput;
  is >> polymerInput;

  while (!is.eof()) {
    char polymerOutput;
    is >> polymerOutput;
    insertionRules.insert(make_pair(polymerInput, polymerOutput));
    is >> polymerInput;
  }

  printRules(insertionRules);

  for (int i = 0; i < 40; i++) {
    // Each pair is converted to one element insertion and two new pairs
    PairCounts newPairCounts;
    // For every pair type that exists
    for (auto p : pairCounts) {
      // Insert new element and count new pairs
      auto pair = p.first;
      auto count = p.second;
      auto newElement = insertionRules.find(pair)->second;
      countElement(counts, newElement, count);
      countPair(newPairCounts, string({pair.at(0), newElement}), count);
      countPair(newPairCounts, string({newElement, pair.at(1)}), count);
    }
    pairCounts = newPairCounts;
  }

  printConfiguration(counts, pairCounts);

  N mostCommon = 0;
  N leastCommon = 9223372036854775807;
  for (auto c : counts) {
    mostCommon = c.second > mostCommon ? c.second : mostCommon;
    leastCommon = c.second < leastCommon ? c.second : leastCommon;
  }
  cout << "Most common \t" << mostCommon << endl;
  cout << "Least common\t" << leastCommon << endl;
  cout << "Diff        \t" << mostCommon-leastCommon << endl;

  return 0;
}
