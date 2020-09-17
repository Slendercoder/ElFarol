import pandas as pd
import ElFarolFunciones as F
import redes

def crea_dataframe_agentes(Num_agentes, tipoRed, Agentes, Num_iteraciones, PARS, N, corte=10):

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
    for p in PARS:
        lista_parametros.append([])
    for i in range(len(Agentes)):
        for r in range(Num_iteraciones):
            if corte == 0:
                muestra.append(N)
                num_agentes.append(Num_agentes)
                red.append(tipoRed)
                agente.append(i)
                ronda.append(r)
                estado.append(Agentes[i].estado[r])
                puntaje.append(Agentes[i].score[r])
                politica.append(Agentes[i].politica[r])
                lista_num_iteraciones.append(Num_iteraciones)
                for x in range(len(PARS)):
                    lista_parametros[x].append(PARS[x])
            elif r%corte == 0:
                muestra.append(N)
                num_agentes.append(Num_agentes)
                red.append(tipoRed)
                agente.append(i)
                ronda.append(r)
                estado.append(Agentes[i].estado[r])
                puntaje.append(Agentes[i].score[r])
                politica.append(Agentes[i].politica[r])
                lista_num_iteraciones.append(Num_iteraciones)
                for x in range(len(PARS)):
                    lista_parametros[x].append(PARS[x])
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

    for p in range(len(PARS)):
        nombre = 'Parametro-' + str(p)
        data[nombre] = lista_parametros[p]

    data['Politica_lag'] = data.groupby(['Identificador', 'Agente'])['Politica'].transform('shift', 1)
    data['Consistencia'] = data.apply(lambda x : F.encontrar_consistencia (x['Politica'], x['Politica_lag']), axis=1)
    data = data[['Identificador','Parametro-0','Parametro-1','Agente','Ronda','Estado','Puntaje','Politica_lag','Politica','Consistencia']]

    return data

def simulacion(Num_agentes, tipoRed, Num_iteraciones, UMBRAL, inicial, identificador, PARS):
    politicas = F.crear_politicas()
    agentes = F.crear_agentes_aleatorios(Num_agentes, politicas, UMBRAL, identificador)
    for i in range(Num_iteraciones):
        agentes = F.juega_ronda(agentes, politicas, UMBRAL)
        agentes = F.agentes_aprenden(agentes, i + 1)
    data = crea_dataframe_agentes(Num_agentes, tipoRed, agentes, Num_iteraciones, PARS, identificador, 0)
    F.guardar(data, 'simulaciones-' + tipoRed + '-' + str(PARS[0]) + '-' + str(PARS[1]) + '.csv', inicial)

Num_experimentos = 1
Num_iteraciones = 5
identificador = 0
UMBRAL = 0.5
inicial = True

print('********************************')
print('Corriendo simulaciones...')
print('********************************')
print("")
tipoRed = 'GRG'
conectividades = [0.02 * x for x in range(0, 5)] + [0.1 * x for x in range(1, 11)]
conectividades = [round(x, 2) for x in conectividades]
for Num_agentes in [10, 11, 100, 101]:
    for p in conectividades:
        print('Corriendo experimentos con parametros:')
        print('Num_agentes:', Num_agentes)
        print('p:', p)
        for i in range(Num_experimentos):
            PARS = [Num_agentes, p]
            redes.random_graph(Num_agentes, p, imagen=False, identificador=identificador)
            # redes1.create_graph(PARS[0], tipoRed, PARS[1], True, imagen=False, identificador=str(identificador))
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
