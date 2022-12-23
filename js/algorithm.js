
let actualVertexId = -1; 
let actualGraph = 0; 
 
 
 var executeAlgorithm = function (graph, opt) {
    switch(opt) {

        case "1": 
            executeDijkstra(graph); 
            break; 
        case "2" : 
            executeKruskal(graph)  ; 
            break
        case "3": 
            executePrim(graph); 
            break
    }
};

let executeDijkstra = function(graph) {
    if(graph.hasNegativeEdge()) {
        alert("Impossible l'algorihtme de Dijkstra ne fonctionne que avec des poids positifs"); 
        return; 
    }

    let vertexInitial = 0; 
    let vertexFinal = 0; 

    // Need a start node...
    while(graph.search(vertexInitial) == null) {
        vertexInitial = prompt('Entrer le sommet de depart', '1'); 
        if(vertexInitial == null) return; 
    }
    // Need an end node
    while(graph.search(vertexFinal) == null) {
        vertexFinal = prompt("Entrer le sommet d'arrivé", '1'); 
        if(vertexFinal == null) return; 
    }

    var result = dijkstra(graph.getAdjacencyMatrix(), vertexInitial-1, vertexFinal-1 ); 
   
    // coloring the node and edges concerned in the shortest path...
    for(var i in result) {
       
        idVertex = result[i] + 1; 
        
        vertex = graph.search(idVertex); 
        vertex.fill = '#D14836'; 

        if(i != 0) {
           directedEdge = graph.searchDirectedEdge(vertex, graph.search(result[i-1]+1)); 
            directedEdge.fill = '#D14836'; // coloring the edge between the actual in the shortest path and his predecessor...

            inversedEdge = graph.searchDirectedEdge(graph.search(result[i-1]+1), vertex); 
            if(inversedEdge != null) {
                inversedEdge.fill = '#D14836'; // when the edge is not directed...
            }
        }

    }
    graph.update(); 
};



var dijkstra = function(AdjacencyMatrix, vertexInitial, vertexFinal) {
    var queue = PriorityQueue({low: true}); 
    var distances = new Array(AdjacencyMatrix.length); // array of node distances...
    var pr = new Array(AdjacencyMatrix.length); // array of predecessor...

    for(var i = 0; i< AdjacencyMatrix.length; i++) {
        distances[i] = 99999999999999; 
        pr[i] = -1; 
    }

    distances[vertexInitial] = 0; 
    queue.push(vertexInitial, distances[vertexInitial]);

    while(!queue.empty()) {
        nodetmp = queue.top(); 
        i = queue.pop(); 

        for(var j=0; j < AdjacencyMatrix.length; j++) {

            if( parseInt(AdjacencyMatrix[i][j]) > 0 && parseInt(distances[i]) + parseInt(AdjacencyMatrix[i][j]) < parseInt(distances[j]) )  {
               
                distances[j] = parseInt(distances[i]) + parseInt(AdjacencyMatrix[i][j]); 
                pr[j] = i; // j predecessor became i...; 
                queue.push(j, -parseInt(distances[j]));
            }
        }
    }

    var result = new Array(); // this array will contain the predecessor of the final vertex, like that we can return the shortest path...
    result.push(vertexFinal); 

    while(pr[vertexFinal] != -1) {
        result.push(pr[vertexFinal]); 
        vertexFinal = pr[vertexFinal]; 
    }

    return result; 

};

let executeKruskal = function (graph) {
    actualGraph = graph; 
    let result = kruskal(graph); 

    for(var i=0; i < graph.directedEdges.length; i++) {
        graph.directedEdges[i].fill = '#DCDCDC' ; 
        graph.directedEdges[i].fillText = '#DCDCDC'; 

    }

    updateEdges(result, 0) ;
}


let executePrim = function (graph) {
    actualGraph = graph; 
    let result = prim(graph); 

    for(var i=0; i < graph.directedEdges.length; i++) {
        graph.directedEdges[i].fill = '#DCDCDC' ; 
        graph.directedEdges[i].fillText = '#DCDCDC'; 

    }

    updateEdges(result, 0) ;
}

let updateEdges = function (result, i) {
    actualGraph.update(); 

    let edge = result[i]; 
    edge.start.fill = '#D14836'; 
    edge.end.fill = '#D14836'; 
    edge.fill = '#D14836'; 
    edge.fillText = 'black'; 

    inversedEdge = actualGraph.searchDirectedEdge(edge.end, edge.start); 
    if(inversedEdge != null) {
        inversedEdge.start.fill = '#D14836'; 
        inversedEdge.end.fill = '#D14836';
        inversedEdge.fill = '#D14836';
        inversedEdge.fillText = 'black'; 
    }

    count = i; 
    results = result;

    if(i!= result.length) {
        setTimeout("updateEdges(results, count+1)", 1000)
    }
}

let kruskal = function (graph) {

    let queue = PriorityQueue({low:true}); 
    let n = graph.vertices.length; 
    let acm = new Array(); 
    let l = new Array(graph.vertices.length); 

    for(var i = 0; i < l.length; i++) {

        l[i] = new Array(); 
        l[i].push(i); // An array containing arrays with the index value of each array...
    }

    // Adding the edges to the queue...
    for(var i = 0; i < graph.directedEdges.length; i++) {
        queue.push(graph.directedEdges[i], graph.directedEdges[i].value); 
    }

    while(acm.length < n-1 && !queue.empty()) {

        let edge = queue.pop(); 

        let acm1 = kruskal_Find(edge.start.id-1, l); 
        let acm2 = kruskal_Find(edge.end.id-1, l); 

        if(acm1 != acm2) {
            kruskal_Merge(acm1, acm2, l);
            acm.push(edge); 
        }

    }

    return acm; 
}

let kruskal_Find = function(idVertice, l) {
    for(var i=0; i<l.length; i++) {
        for(var j=0; j<l[i].length; j++) {
            if(l[i][j] ==idVertice)
            return i; 
        }
    }
}

let kruskal_Merge = function (acm1, acm2, l) {
    while(l[acm2].length != 0) {
        l[acm1].push(l[acm2].pop())
    }
}





let prim = function(graph) {
    if(graph.empty()) {
        alert('Impossible, le graphe est vide!'); 
        return; 
    }

    let matrix = graph.getAdjacencyMatrix(); 
    let queue = PriorityQueue({low:true}); 

    let arr = new Array(matrix.length); 
    let distArr = new Array(matrix.length); 

    let T = new Array(); 

    for(var i=1; i<matrix.length; i++) {
        arr[i] = 0; 
        distArr[i] = (matrix[i][0] == 0) ? 99999999999 : matrix[i][0]; 

    }

    for(var i=0; i<matrix.length-1; i++) {
        min = 99999999999; 
        var k; 

        for(var j=1; j<matrix.length; j++) {
            if( parseInt(distArr[j]) >= 0 && parseInt(distArr[j]) < parseInt(min)) {
                min = distArr[j]; 
                k = j ; 
            }
        }

        T.push(graph.searchDirectedEdge(graph.search(k+1), graph.search(arr[k]+1)));
        distArr[k] = -1; 

        for(var j=1; j<matrix.length; i++) {
            value = (matrix[k][j] == 0)? 9999999999999:matrix[k][j]; 
            if(parseInt(value) < parseInt(distArr[j])) {
                distArr[j] = (matrix[k][j] == 0) ? 9999999999999 : matrix[k][j]; 
                arr[j] = k; 
            }
        }
    }  
    
    return T; 
}


