#include <iostream>
#include <fstream>
#include <map>

using namespace std;

// Part 1, naive approach, it should be enough to finish part 1
// even though the memory complexity is O(2^n) for n = insertion steps
// Our own list struct for fun and profit
int element_count = 0;
struct List {
  char val;
  List* prev;
  List* next;

  explicit List(char val, List* prev, List* next) : val(val), prev(prev), next(next) { element_count += 1; }

  void insert_before(char const& insertedValue) {
    auto newList = new List(insertedValue, prev, this);
    if (prev != nullptr) {
      prev->next = newList;
    }
    prev = newList;
  }

  void insert_after(char const& insertedValue) {
    auto newList = new List(insertedValue, this, next);
    if (next != nullptr) {
      next->prev = newList;
    }
    next = newList;
  }
};

typedef map<string, char> PolymerMap;

char getTokenToInsert(char first, char second, PolymerMap const& polymerMap) {
  string f({first, second});
  return polymerMap.find(f)->second;
}

void printList(List* list) {
  auto current = list;
  while (current != nullptr) {
    cout << current->val << " ";
    current = current->next;
  }
  cout << endl;
}

void polymer_insertion(List* list, PolymerMap const& polymerMap) {
  auto current = list;
  while (current != nullptr) {
    if (current->prev != nullptr) {
      current->insert_before(getTokenToInsert(current->prev->val, current->val, polymerMap));
    }
    current = current->next;
  }
}

int main() {
  ifstream is("./input2.txt");
  string input;
  is >> input;

  List* list = nullptr;
  List* current = nullptr;
  for (size_t i = 0; i < input.length(); i++) {
    if (list == nullptr) {
      list = new List(input.at(i), nullptr, nullptr);
      current = list;
    } else {
      current->insert_after(input.at(i));
      current = current->next;
    }
  }
  printList(list);

  map<string, char> polymerMap;
  string polymer_input;
  is >> polymer_input;

  while (!is.eof()) {
    char polymer_output;
    is >> polymer_output;
    polymerMap.insert(make_pair(polymer_input, polymer_output));
    is >> polymer_input;
  }

  cout << endl << "Print polymer map" << endl;
  for (auto a : polymerMap) {
    cout << a.first << " -> " << a.second << endl;
  }

  for (size_t i = 0; i < 10; i++) {
    polymer_insertion(list, polymerMap);
    printList(list);
  }
  cout << "Total " << element_count << " elements!" << endl;

  // TODO count most common and most uncommon
  map<char, int> counts;
  current = list;
  while (current != nullptr) {
    auto val = current->val;
    auto f = counts.find(val);
    if (f == counts.end()) {
      counts.insert(make_pair(val, 1));
    } else {
      counts.erase(val);
      counts.insert(make_pair(val, f->second + 1));
    }
    current = current->next;
  }

  int mostCommon = 0;
  int leastCommon = 575490560;
  for (auto c : counts) {
    cout << c.first << ": " << c.second << endl;
    mostCommon = c.second > mostCommon ? c.second : mostCommon;
    leastCommon = c.second < leastCommon ? c.second : leastCommon;
  }
  cout << mostCommon << " " << leastCommon << endl;
  cout << mostCommon-leastCommon << endl;

  return 0;
}
