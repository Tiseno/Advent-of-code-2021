#include <iostream>
#include <fstream>
#include <vector>
#include <queue>
#include <set>
#include <unordered_set>

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
typedef vector<vector<Node>> Paths;

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

Graph graphX5(Graph const& graph) {
  Graph newGraph(graph);
  // Create new rows and fill out the existing rows
  for(size_t offset = 0; offset < 4; offset++) {
    for(size_t y = 0; y < graph.size(); y++) {
      newGraph.push_back(vector<Weight>());
      for(size_t x = 0; x < graph[y].size(); x++) {
        auto w = newGraph[y][x + (offset * graph[y].size())] + 1;
        newGraph[y].push_back(w == 10 ? 1 : w);
        newGraph.back().push_back(w == 10 ? 1 : w);
      }
    }
  }
  // Fill out the new rows
  for(size_t y = graph.size(); y < newGraph.size(); y++) {
    for(size_t offset = 0; offset < 4; offset++) {
      for(size_t x = 0; x < graph[0].size(); x++) {
        auto w = newGraph[y][x + (offset * graph[0].size())] + 1;
        newGraph[y].push_back(w == 10 ? 1 : w);
      }
    }
  }
  return newGraph;
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

void printNode(Node const& n) {
  cout << " \t" << n.X << ", " << n.Y << " ";
}

void printPath(Paths const& paths) {
  vector<vector<string>> shortest(paths.size(), vector<string>(paths[0].size(), " "));

  string botRight = "\u251B";
  string topRight = "\u2513";
  string topLeft = "\u250F";
  string botLeft = "\u2517";
  string horizontal = "\u2501";
  string vertical = "\u2503";

  Node current(paths[0].size() -1, paths.size() -1);
  Node previous(-1, -1);
  while(current.X != 0 || current.Y != 0) {
    auto next = paths[current.Y][current.X];
    if(previous.X == -1) {
      if(next.X == current.X) {
        shortest[current.Y][current.X] = vertical;
      } else if(next.Y == current.Y) {
        shortest[current.Y][current.X] = horizontal;
      } else {
        shortest[current.Y][current.X] = "O";
      }
    } else if(next.X < current.X) {
      if(previous.Y < current.Y) {
        shortest[current.Y][current.X] = botRight;
      } else if(previous.Y > current.Y) {
        shortest[current.Y][current.X] = topRight;
      } else {
        shortest[current.Y][current.X] = horizontal;
      }
    } else if(next.X > current.X) {
      if(previous.Y < current.Y) {
        shortest[current.Y][current.X] = botLeft;
      } else if(previous.Y > current.Y) {
        shortest[current.Y][current.X] = topLeft;
      } else {
        shortest[current.Y][current.X] = horizontal;
      }
    } else if(next.Y < current.Y) {
      if(previous.X < current.X) {
        shortest[current.Y][current.X] = botRight;
      } else if(previous.X > current.X) {
        shortest[current.Y][current.X] = botLeft;
      } else {
        shortest[current.Y][current.X] = vertical;
      }
    } else if(next.Y > current.Y) {
      if(previous.X < current.X) {
        shortest[current.Y][current.X] = topRight;
      } else if(previous.X > current.X) {
        shortest[current.Y][current.X] = topLeft;
      } else {
        shortest[current.Y][current.X] = vertical;
      }
    } else {
      printNode(current);
      printNode(next);
      cout << endl;
      throw "Not possible.";
    }

    previous = current;
    current = next;
  }

  for(auto row : shortest) {
    for(auto p : row) {
      cout << p;
    }
    cout << endl;
  }
  cout << endl;
}

set<Node> getNeighbors(Node const& node, N const& XMAX, N const& YMAX) {
  set<Node> neighbors;
  if(node.X+1 < XMAX) neighbors.insert(Node(node.X+1, node.Y));
  if(node.Y+1 < YMAX) neighbors.insert(Node(node.X,   node.Y+1));
  if(node.X-1 >= 0)   neighbors.insert(Node(node.X-1, node.Y));
  if(node.Y-1 >= 0)   neighbors.insert(Node(node.X,   node.Y-1));
  return neighbors;
}

pair<Graph, Paths> allShortestPaths(Graph const& graph) {
  // Initialize resulting distances and paths to all nodes from source
  Graph distances(graph);
  Paths paths;
  for(size_t y = 0; y < distances.size(); y++) {
    paths.push_back(vector<Node>());
    for(size_t x = 0; x < distances.size(); x++) {
      distances[y][x] = INF;
      // All path nodes refer to itself (no path)
      paths[y].push_back(Node(x, y));
    }
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
		// Set this node as the path node to reach the neighbor for its registered distance
        paths[neighbor.Y][neighbor.X] = node;
      }
    }
  }
  // Return all distances and paths
  return make_pair(distances, paths);
}

int main() {
  auto smallGraph = readGraphFromFile("./input2.txt");
  cout << "Input graph" << endl;
  // printGraph(smallGraph);

  // auto graph = smallGraph;
  // Part 2 transform the graph to be five times bigger
  auto graph = graphX5(smallGraph);
  cout << "Graph X5" << endl;
  // printGraph(graph);
  cout << '\n';

  cout << "Calculating all shortest paths" << endl;
  auto distancesAndPaths = allShortestPaths(graph);

  cout << "The resulting shortest path from source to sink" << endl;
  printPath(distancesAndPaths.second);
  cout << "Shortest path from source to sink: ";
  printWeight(distancesAndPaths.first.back().back());
  cout << endl;
  return 0;
}

