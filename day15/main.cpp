#include <iostream>
#include <fstream>
#include <vector>
#include <queue>
#include <set>
#include <unordered_set>
#include <optional>

using namespace std;

// Part 1
// This is pretty much day 12 but with a dense weighted graph
// Using Dijkstras for this

typedef int N;
typedef long long int Weight;
Weight INF = 9223372036854775807;
typedef vector<Weight> Weights;
// As it is a dense and square graph we use a double vector
// for the graph representation and coordinates to identify nodes
typedef vector<vector<Weight>> Graph;
struct Node {
  N X;
  N Y;
  Node(N x, N y) : X(x), Y(y) {}

  bool operator<(Node const& other) const {
    return Y == other.Y ? X < other.X : Y < other.Y;
  }

  bool operator==(Node const& other) const {
    return Y == other.Y && X == other.X;
  }
};
typedef vector<Node> Nodes;

// For use in unordered set
namespace std {
  template<> struct hash<Node> {
    size_t operator()(Node const& n) const noexcept {
      return n.Y * 10000000 + n.X; // Good enough
    }
  };
}

Weight charToWeight(char c) {
  return (int)c - 48;
}

Graph readGraphFromFile(string const& fileName) {
  string line;
  ifstream is(fileName);
  is >> line;
  Graph graph;
  N y = 0;
  while(!is.eof()) {
    graph.push_back(Weights());
    for(size_t x = 0; x < line.length(); x++) {
      graph[y].push_back(charToWeight(line.at(x)));
    }
    is >> line;
    y++;
  }
  return graph;
}

void printWeight(Weight w) {
  if(w == INF) {
    cout << "INF";
  } else {
    cout << ' ' << w << ' ';
  }
}

void printGraph(Graph const& graph) {
  for(auto row : graph) {
    for(auto weight : row) {
      printWeight(weight);
      cout << ' ';
    }
    cout << "\n\n";
  }
  cout << flush;
}

set<Node> getNeighbors(Node const& node, N const& XMAX, N const& YMAX) {
  set<Node> neighbors;
  if(node.X+1 < XMAX) {
    neighbors.insert(Node(node.X+1, node.Y));
  }
  if(node.Y+1 < YMAX) {
    neighbors.insert(Node(node.X, node.Y+1));
  }
  if(node.X-1 >= 0) {
    neighbors.insert(Node(node.X-1, node.Y));
  }
  if(node.Y-1 >= 0) {
    neighbors.insert(Node(node.X, node.Y-1));
  }
  return neighbors;
}

Graph distanceToEnd(Graph const& graph) {
  // Initialize resulting distances to all nodes from source
  Graph distances(graph);
  for(size_t y = 0; y < distances.size(); y++)
    for(size_t x = 0; x < distances.size(); x++) {
      distances[y][x] = INF;
    }

  // Make a queue where we insert the next nodes to visit in order of shortness to them
  priority_queue<pair<Weight, Node>, vector<pair<Weight, Node>>, greater<pair<Weight, Node>>> tentative;
  // Push the initial node to visit (source)
  tentative.push(make_pair(0, Node(0, 0)));
  // Initialize the starting node to have 0 distance to it (duh)
  distances[0][0] = 0;
  // Initialize a set to keep track of all nodes we have already visited
  unordered_set<Node> visited;

  // While we have nodes to visit
  while(!tentative.empty()) {
    // Visit the first node in the queue
    auto node = tentative.top().second;
    tentative.pop();

    // If we have already visited this node, continue to the next in the queue
    if(visited.find(node) != visited.end()) continue;

    // Else mark it as visited
    visited.insert(node);

    // For all neighbors to this node
    auto neighbors = getNeighbors(node, graph.size(), graph[0].size());
    for(auto neighbor : neighbors) {
      // If we have already visited that neighbor, continue to the next neighbor
      if(visited.find(neighbor) != visited.end()) continue;

      // If the distance to this node + the distance to the neighbor is smaller than the distance already registered at the neighbor
      auto newDistanceToNeigbor = distances[node.Y][node.X] + graph[neighbor.Y][neighbor.X];
      if(newDistanceToNeigbor < distances[neighbor.Y][neighbor.X]) {
        // Register the new (shorter) distance to the neighbor
        distances[neighbor.Y][neighbor.X] = newDistanceToNeigbor;
        // Mark the neighbor as a node to visit again (so it can update its neighbors with the new distance)
        tentative.push(make_pair(newDistanceToNeigbor, neighbor));
        // Do we not need to make it not visited as well?
      }
    }
  }
  // Return all distances
  return distances;
}

int main() {
  auto graph = readGraphFromFile("./input2.txt");
  printGraph(graph);
  cout << '\n';

  auto distances = distanceToEnd(graph);

  cout << "The resulting shortest distances to all nodes" << endl;
  printGraph(distances);
  cout << "Shortest path from source to sink: ";
  printWeight(distances.back().back());
  cout << '\n' << flush;
  return 0;
}

