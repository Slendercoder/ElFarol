import pandas as pd
import ElFarolFunciones as F
import redes1

def crea_dataframe_agentes(Num_agentes, tipoRed, Agentes, Num_iteraciones, PARAMETROS, N, corte=10):
    muestra = []
    num_agentes = []
    red = []
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
            if r%corte == 0:
                muestra.append(N)
                num_agentes.append(Num_agentes)
                red.append(tipoRed)
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
    'Numero_agentes': num_agentes,\
    'Tipo_red': red,\
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

def simulacion(Num_agentes, tipoRed, Num_iteraciones, UMBRAL, inicial, identificador, PARS):
    agentes = F.crear_agentes_aleatorios(Num_agentes)
    politicas = F.crear_politicas()
    # Leyendo red de archivo
    F.leer_red(agentes, identificador)
    for i in range(Num_iteraciones):
        agentes = F.juega_ronda(agentes, politicas, UMBRAL)
        agentes = F.agentes_aprenden(agentes, i)
    data = crea_dataframe_agentes(Num_agentes, tipoRed, agentes, Num_iteraciones, PARS, N)
    # data['Politica_lag'] = data.groupby('Agente')['Politica'].transform('shift', 1)
    # data['Consistencia'] = data.apply(lambda x : F.encontrar_consistencia (x['Politica'], x['Politica_lag']), axis=1)
    F.guardar(data, './data/simulaciones-' + tipoRed + '-' + str(PARS[0]) + '-' + str(PARS[1]) + '.csv', inicial)

Num_experimentos = 100
Num_iteraciones = 100
identificador = 0
UMBRAL = 0.5
inicial = True

print('Corriendo simulaciones...')
tipoRed = 'GRG'
for Num_agentes in [10, 11, 100, 101]:
    for p in [0.1 * x for x in range(1, 11)]:
        for i in range(Num_experimentos):
            PARS = [Num_agentes, p]
            redes1.create_graph(PARS[0], tipoRed, PARS[1], True, imagen=False, identificador)
            simulacion(Num_agentes, tipoRed, Num_iteraciones, UMBRAL, inicial, identificador, PARS)
            identificador += 1
            inicial = False

##################################################################
##################################################################
##################################################################
##################################################################
##################################################################

# print('Corriendo simulacion red completa...')
# tipoRed = 'Full'
# for Num_agentes in [5,6,10,11,101,1000]:
#     for i in range(100):
#         PARS = [Num_agentes, 1]
#         redes1.create_graph(Num_agentes, tipoRed, 1, True)
#         simulacion(Num_agentes,tipoRed,Num_iteraciones,UMBRAL,inicial,identificador,PARS)
#         identificador += 1
#         inicial = False
#
# print('Corriendo simulacion red 2-regular...')
# tipoRed = 'Kregular'
# for Num_agentes in [5,6,10,11,101,1000]:
#     for i in range(100):
#         PARS = [Num_agentes, 2]
#         redes1.create_graph(Num_agentes, tipoRed, 2, True)
#         simulacion(Num_agentes,tipoRed,Num_iteraciones,UMBRAL,inicial,identificador,PARS)
#         identificador += 1
#
# print('Corriendo simulacion red 4-regular...')
# tipoRed = 'Kregular'
# for Num_agentes in [5,6,10,11,101,1000]:
#     for i in range(100):
#         PARS = [Num_agentes, 4]
#         redes1.create_graph(Num_agentes, tipoRed, 4, True)
#         simulacion(Num_agentes,tipoRed,Num_iteraciones,UMBRAL,inicial,identificador,PARS)
#         identificador += 1
