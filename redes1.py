#Library for network implementation
import igraph as ig
import cairocffi as cairo

def create_graph(N, type, k, printg, imagen=True):

    if type == "Full":
        g = ig.Graph.Full(N)
    elif type == "Kregular":
        g = ig.Graph.K_Regular(N,k)
    elif type == "GrowingConected":
        g = ig.Graph.Growing_Random(N, k, False, True)
    elif type == "GrowingUnconected":
        g = ig.Graph.Growing_Random(N, k, False, False)
    elif type == "Ring":
        g = ig.Graph.Ring(N)
    elif type == "CloseRing":
        g = ig.Graph.Ring(N, circular = True)
    elif type == "Star":
        g = ig.Graph.Star(N)
    elif type == "Tree":
        g = ig.Graph.Tree(N,k)
    elif type == "GRG":
        g = ig.Graph.GRG(N,k)
    else:
        print("unvalid input")

    ff = open('data/connlist.dat', 'w')
    for e in g.es:
        edge = e.tuple
        ff.write(str(edge[0])+" "+str(edge[1])+"\n")
    ff.close()

    if imagen:
        ig.plot(g,'imagenes/red.png')
