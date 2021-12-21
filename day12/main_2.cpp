// Part 2
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <set>

using namespace std;

typedef size_t NodeIndex;
typedef set<NodeIndex> Visited;
typedef set<NodeIndex> SmallCaves;
// Is there some way to do this nicer? i.e. with only one collection
typedef map<NodeIndex, string> IndexToName;
typedef map<string, NodeIndex> NameToIndex;
typedef vector<NodeIndex> Edges;
typedef vector<NodeIndex> Path;
typedef vector<Edges> Graph;
typedef vector<Path> Paths;

NodeIndex addNode(string nodeName, Graph& graph, NameToIndex& nameToIndex, IndexToName& indexToName, SmallCaves& smallCaves) {
	auto existingNode = nameToIndex.find(nodeName);
	if (existingNode != nameToIndex.end()) {
		return existingNode->second;
	} else {
		NodeIndex nodeIndex = graph.size();
		graph.push_back(Edges(0, 0));
		indexToName.insert(make_pair(nodeIndex, nodeName));
		nameToIndex.insert(make_pair(nodeName, nodeIndex));
		if (nodeName != "start" && nodeName != "end" && islower(nodeName.at(0))) {
			smallCaves.insert(nodeIndex);
		}
		return nodeIndex;
	}
}

void connect(Graph& graph, NodeIndex& n1, NodeIndex& n2) {
	graph[n1].push_back(n2);
	graph[n2].push_back(n1);
}

string readStr(ifstream& is) {
	string str;
	is >> str;
	return str;
}

 Paths allPaths(
		Path const& path,
		Visited const& visited,
		NodeIndex const& node,
		bool canGoBackOnce,
		Graph const& graph,
		IndexToName const& indexToName,
		SmallCaves const& smallCaves
		) {
	if (indexToName.find(node)->second == "end") {
		auto newPath(path);
		newPath.push_back(node);
		return Paths({ newPath });
	}
	Paths paths;
	for (auto next : graph[node]) {
		if (indexToName.find(next)->second == "start") {
			// Never go to the start node
			continue;
		}
		// If we are allowed to go back once, consider all, else consider unvisited
		if (canGoBackOnce || visited.find(next) == visited.end()) {
			auto newPath(path);
			newPath.push_back(node);
			auto newVisited(visited);
			bool newCanGoBackOnce = canGoBackOnce;
			if (canGoBackOnce && visited.find(next) != visited.end()) {
				// We went to this node an extra time
				newCanGoBackOnce = false;
			}
			if (smallCaves.find(node) != smallCaves.end()) {
				newVisited.insert(node);
			}
			auto newPaths = allPaths(newPath, newVisited, next, newCanGoBackOnce, graph, indexToName, smallCaves);
			paths.insert(paths.end(), newPaths.begin(), newPaths.end());
		}
	}
	return paths;
}

int main() {
	Graph graph;
	NameToIndex nameToIndex;
	IndexToName indexToName;
	SmallCaves smallCaves;

	ifstream is("./input3.txt");
	string nodeName = readStr(is);
	while (!is.eof()) {
		auto node1 = addNode(nodeName,    graph, nameToIndex, indexToName, smallCaves);
		auto node2 = addNode(readStr(is), graph, nameToIndex, indexToName, smallCaves);
		connect(graph, node1, node2);
		nodeName = readStr(is);
	}

	auto start = nameToIndex.find("start")->second;
	auto paths = allPaths(Path(), Visited({ start }), start, true, graph, indexToName, smallCaves);

	cout << "Paths" << endl;
	for (auto p : paths) {
		for (auto n : p) {
			cout << indexToName.find(n)->second << " ";
		}
		cout << endl;
	}
	cout << endl;
	cout << "Number of paths found: " << paths.size() << endl;
	return 0;
}
