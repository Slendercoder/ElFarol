import numpy as np
import pandas as pd
import random as rd
import os

class agente:
    def __init__(self, estados, scores, politicas, vecinos):
        self.estado = estados # lista
        self.score = scores # lista
        self.politica = politicas # lista
        self.vecinos = vecinos
    def __str__(self):
        return "E:{0}, S:{1}, P:{2}, V{3}".format(self.estado, self.score,self.politica,self.vecinos)

def calcula_medio(agentes):
    a = [x.estado[-1] for x in agentes]
    return np.sum(a)/len(a)

def juega_ronda(Agentes, politicas, UMBRAL):
    for a in Agentes:
        polit = politicas[a.politica[-1]]
        a.estado.append(polit[(a.estado[-1], a.score[-1])])

    X = calcula_medio(Agentes)
    # print('Medio', X)
    for a in Agentes:
        if a.estado[-1] == 1:
            if X > UMBRAL:
                a.score.append(-1)
            else:
                a.score.append(1)
        else:
            a.score.append(0)

    return Agentes

def leer_red(Agentes):

    net = {}

    In = open("data/connlist.dat", "r")
    for line in In:
        v = list(map(int, line.split()))

        if v[0] not in net.keys():
            net[v[0]] = [v[1]]
        else:
            net[v[0]].append(v[1])

        if v[1] not in net.keys():
            net[v[1]] = [v[0]]
        else:
            net[v[1]].append(v[0])

    In.close()
    # print('Red', net)
    for i in range(len(Agentes)):
        try:
            Agentes[i].vecinos = net[i]

        except:
            Agentes[i].vecinos = []

def juega_ronda(Agentes, politicas, UMBRAL):
    for a in Agentes:
        polit = politicas[a.politica[-1]]
        a.estado.append(polit[(a.estado[-1], a.score[-1])])

    X = calcula_medio(Agentes)
    # print('Medio', X)
    for a in Agentes:
        if a.estado[-1] == 1:
            if X > UMBRAL:
                a.score.append(-1)
            else:
                a.score.append(1)
        else:
            a.score.append(0)

    return Agentes

def crea_dataframe_agentes(Agentes, Num_iteraciones, PARAMETROS, N):

    muestra = []
    agente = []
    ronda = []
    estado = []
    puntaje = []
    politica = []
    lista_num_iteraciones = []
    lista_parametros = []
    for p in PARAMETROS:
        lista_parametros.append([])
    for i in range(len(Agentes)):
        for r in range(Num_iteraciones):
            muestra.append(N)
            agente.append(i)
            ronda.append(r)
            estado.append(Agentes[i].estado[r])
            puntaje.append(Agentes[i].score[r])
            politica.append(Agentes[i].politica[r])
            lista_num_iteraciones.append(Num_iteraciones)
            for x in range(len(PARAMETROS)):
                lista_parametros[x].append(PARAMETROS[x])


    data = pd.DataFrame.from_dict(\
    {\
    'Identificador': muestra,\
    'Agente': agente,\
    'Ronda': ronda,\
    'Estado': estado,\
    'Puntaje': puntaje,\
    'Politica': politica\
    })

    for p in range(len(PARAMETROS)):
        nombre = 'Parametro-' + str(p)
        data[nombre] = lista_parametros[p]

    return data

def guardar(dataFrame, archivo, inicial):
    archivo = "data/" + archivo
    if inicial:
        #os.remove(archivo)
        dataFrame.to_csv(archivo, index = False)
    else:
        with open(archivo, 'a') as f:
            dataFrame.to_csv(f, header=False, index=False)

def cargar(archivo):
    data = pd.read_csv(archivo)

def encontrar_consistencia(politica, politica_lag):
    #print(politica_lag, type(politica_lag))
    if np.isnan(politica_lag):
        return np.nan
    elif politica == politica_lag:
        return 1
    else: return 0

def crear_agentes_aleatorios(Num_agentes):
    Agentes = []
    for i in range(Num_agentes):
        Agentes.append(agente([rd.randint(0,1)], [], [rd.randint(0,7)], []))

    X = calcula_medio(Agentes)

    for a in Agentes:
        if a.estado[-1] == 1:
            if X > 0.5:
                a.score.append(-1)
            else:
                a.score.append(1)
        else:
            a.score.append(0)

    return Agentes

def crear_agentes1():
    Agentes = []
    Agentes.append(agente([1],[],[7],[]))
    Agentes.append(agente([0],[],[0],[]))
    Agentes.append(agente([0],[],[0],[]))
    Agentes.append(agente([0],[],[0],[]))

    X = calcula_medio(Agentes)

    for a in Agentes:
        if a.estado[-1] == 1:
            if X > 0.5:
                a.score.append(-1)
            else:
                a.score.append(1)
        else:
            a.score.append(0)

    return Agentes

def crear_politicas():
    politicas = [
    {(0,0): 0, (1,1): 0, (1, -1): 0}, #0
    {(0,0): 0, (1,1): 0, (1, -1): 1}, #1
    {(0,0): 0, (1,1): 1, (1, -1): 0}, #2
    {(0,0): 0, (1,1): 1, (1, -1): 1}, #3
    {(0,0): 1, (1,1): 0, (1, -1): 0}, #4
    {(0,0): 1, (1,1): 0, (1, -1): 1}, #5
    {(0,0): 1, (1,1): 1, (1, -1): 0}, #6
    {(0,0): 1, (1,1): 1, (1, -1): 1}, #7
    ]
    return politicas

def agentes_aprenden(Agentes,ronda):
    #Los agentes copian la politica del ganador de la Ronda
    for agente in Agentes:
        #print(Agentes.index(agente))
        maximo=agente.score[ronda]
        maximo_vecino=Agentes.index(agente)
        #print(agente.vecinos)
        for index_vecino in agente.vecinos:
            if((Agentes[index_vecino].score[ronda])>(maximo)):
                #print('Hay cambio')
                #print('Puntaje anterior',maximo)
                maximo=Agentes[index_vecino].score[ronda]
                #print('Puntaje anterior vecino',maximo)
                maximo_vecino=index_vecino
            #else:
                #print('No hay cambio')
        agente.politica.append(Agentes[maximo_vecino].politica[ronda])
    return Agentes

def simulacion(Num_agentes, Num_iteraciones, UMBRAL, inicial, N, PARS):
    agentes = crear_agentes_aleatorios(Num_agentes)
    politicas = crear_politicas()
    # Leyendo red de archivo
    leer_red(agentes)
    for i in range(Num_iteraciones):
        agentes = juega_ronda(agentes, politicas, UMBRAL)
        agentes = agentes_aprenden(agentes, i)
    data = crea_dataframe_agentes(agentes, Num_iteraciones, PARS, N)
    data['Politica_lag'] = data.groupby('Agente')['Politica'].transform('shift', 1)
    data['Consistencia'] = data.apply(lambda x : encontrar_consistencia (x['Politica'], x['Politica_lag']), axis=1)
    guardar(data, 'agentes.csv', inicial)
