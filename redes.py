# Libreria para creacion de redes
import igraph as ig
from numpy import random
import sys, math
#from triangular import Triangular

def guardar_imagen(n_vertices, identificador=''):
    g = ig.Graph()
    g.add_vertices(n_vertices)
    g = ig.Graph.Read_Edgelist('./data/redes/connlist.dat')
    ig.plot(g,'imagenes/red.png')

def random_graph(N, p, imagen=True, identificador=''):
    ## Create a random conectivity matrix in which each edge is included with
    ## probability p (Erdos-Renyi model).

    # print(type(N))
    #
    # print('---------')
    # print('Parametros recibidos:', N, p)
    # print('---------')

    #Link counter
    lnkcnt = [0 for i in range(N)]

    ###Link matrix
    ##links = Triangular(N)

    #link list
    llinks = []

    #make the links
    for i in range(N-1):
        for j in range(i+1,N):
            pair = [min(i,j),max(i,j)]
            if random.random() < p:
                lnkcnt[i] += 1
                lnkcnt[j] += 1
                #print(pair)
                #	    links.set_element(i,j,1)
                llinks.append(pair)

    # print(lnkcnt)
    # print(float(sum(lnkcnt))/N)

    aux = '-' if identificador != '' else ''
    ff = open('./data/redes/connlist' + aux + str(identificador) + '.dat', 'w')
    for i in range(len(llinks)):
        # print("printing link")
        ff.write(str(llinks[i][0])+" "+str(llinks[i][1])+"\n")
    ff.close()

    #histogram
    hist = [0 for i in range(N)]
    for i in lnkcnt:
        hist[i] += 1

    hf = open('./data/redes/deg_hist-' + str(identificador) + '.dat', 'w')
    for i in range(N):
        hf.write(str(i)+' '+str(hist[i])+'\n')
    hf.close()

    if imagen:
        guardar_imagen(N, identificador=identificador)

def small_world(N,p):
    ## Create a regular conectivity matrix in which each edge is connected only
    ## with its nearest neighbors (lattice), using PBC. Then, reconnect each link
    ## with probability p to a random node. (Watts and Strogatz model)
    # N=No. of nodes, p=link reconnection probability
    #Link counter
    lnkcnt = [0 for i in range(N)]

    ###Link matrix
    ##links = Triangular(N)

    #link list
    llinks = []

    #Square lattice
    sq = math.sqrt(N)
    sqint = int(sq)
    if sq == sqint:
        for i in range(N):
            row = int(math.floor(float(i)/sqint))
            col = int(i - row * sqint)

            j = i + 1
            if random.random() >= p:
                if col == sqint-1:  #PBC
                    j -= sqint
            else: #reconnection
                rnd = i
                while rnd == i:
                    rnd = random.randint(N)
                j = rnd

            k = i + sqint
            if random.random() >= p:
                if row == sqint-1:  #PBC
                    k -= sqint * sqint
            else: #reconnection
                rnd = i
                while rnd == i:
                    rnd = random.randint(N)
                k = rnd

            #	print(str(i)+" "+str(j)+" "+str(k)+"\n")
            #	links.set_element(i,j,1)

            pair1 = [i,j]
            llinks.append(pair1)
            pair2 = [i,k]
            llinks.append(pair2)
            lnkcnt[i] += 2
            lnkcnt[j] += 1
            lnkcnt[k] += 1
    else:
        print("Cannot form a square lattice!")

    print(lnkcnt)

    ff = open('./data/connlist.dat', 'w')
    for i in range(len(llinks)):
        ff.write(str(llinks[i][0])+" "+str(llinks[i][1])+"\n")
    ff.close()

    #histogram
    hist = [0 for i in range(N)]
    for i in lnkcnt:
        hist[i] += 1

    hf = open('./data/deg_hist.dat', 'w')
    for i in range(N):
        hf.write(str(i)+' '+str(hist[i])+'\n')
    hf.close()

    if imagen:
        guardar_imagen(N)

def scale_free(N, N0, Nhci, pnhc, phc):
    ## Initially, there are N0 nodes connected randomly to one another (prob. p0).
    ## New nodes are added one by one. The prob of the new node to connect with an
    ## existingnode i is pi=ki/sum_j kj. Where kj is the degree (No. of connections)
    ## of node j. (Barabasi and Albert model)
    # N=No. of nodes,N0=No. of  nodes in the initial network,
    # Nhci=No. of highly connected (HC) nodes in the initial network,
    # pnhc=prob. of links between non HC nodes in the same initial cluster,phc=prob. of links between initial (HC) nodes

    #Link counter
    lnkcnt = [0 for i in range(N)]

    ###Link matrix
    ##links = Triangular(N)

    #link list
    llinks = []

    #Generate initial network
    clsize = int(N0 / Nhci)
    N0 = Nhci * clsize
    nodes = [i for i in range(N0)]
    clusters = [[] for i in range(Nhci)]
    for n in range(Nhci):
        for j in range(clsize):
            rnd = random.randint(0,len(nodes))
            k = nodes[rnd]
            clusters[n].append(k)
            nodes.remove(k)
    print(clusters)

    for n in range(Nhci):
        #connect to HC node
        hcn = clusters[n][0]
        for a in range(1,clsize):
            i = clusters[n][a]
            lnkcnt[hcn] += 1
            lnkcnt[i] += 1
            #	    print(str(i)+" "+str(j)+"\n")
            #	    links.set_element(i,j,1)
            pair = [min(i,j),max(i,j)]
            llinks.append(pair)
        #connect among other nodes
        for a in range(1,clsize-1):
            i = clusters[n][a]
            for b in range(a+1,clsize):
                j = clusters[n][b]
                rnd = random.random()
                if rnd < pnhc:
                    lnkcnt[i] += 1
                    lnkcnt[j] += 1
                    pair = [min(i,j),max(i,j)]
                    llinks.append(pair)
    for n in range(Nhci-1):
        #connect among HC nodes
        i = clusters[n][0]
        for m in range(n+1,Nhci):
            j = clusters[m][0]
            rnd = random.random()
            if rnd < phc:
                lnkcnt[i] += 1
                lnkcnt[j] += 1
                pair = [min(i,j),max(i,j)]
                llinks.append(pair)


    #Add new nodes
    for i in range(N0,N):
        #total number of links
        sum_l = sum(lnkcnt)
        for j in range(len(lnkcnt)-1):
            pair = [min(i,j),max(i,j)]
            prob = float(lnkcnt[j]) / sum_l
            if random.random() < prob:
                lnkcnt[i] += 1
                lnkcnt[j] += 1
                #	    print(str(i)+" "+str(j)+"\n")
                #	    links.set_element(i,j,1)
                llinks.append(pair)

    print(lnkcnt)
    print(float(sum(lnkcnt))/N)

    ff = open('./data/connlist.dat', 'w')
    for i in range(len(llinks)):
        ff.write(str(llinks[i][0])+" "+str(llinks[i][1])+"\n")
    ff.close()

    #histogram
    hist = [0 for i in range(N)]
    for i in lnkcnt:
        hist[i] += 1

    hf = open('./data/deg_hist.dat', 'w')
    for i in range(N):
        hf.write(str(i)+' '+str(hist[i])+'\n')
    hf.close()

    if imagen:
        guardar_imagen(N)
