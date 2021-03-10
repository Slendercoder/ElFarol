print("Importing libraries...")
import json
#import numpy as np
import pandas as pd
print("Done!")


######################################################
# Data parsing begins here...
######################################################

N = input("How many data_lgc*.json files are to be parsed?: ")
End = int(N)

indices = []      # Saves the numbers that correspond to data_lgc*.json in folder
D_Frames = []     # Saves the dataframes created for performance from each file

for i in range(End):
	indice = '0'*4 + str(i+1)
	indice = indice[-4:]
	archivo = 'data_' + indice + '.json'
	print('Trying to open file ' + archivo)
	try:
		f = open(archivo, 'r')
		print("OK!")
		f.close()
		indices.append(indice)
	except:
		print("No indice " + str(i+1))

print("Indices corresponding to data:", indices)

# Listas con datos
jugador = []
pago = []

for counter in indices:
	# Opens json file with data from experiment and uploads it into Data
	data_archivo = 'data_' + counter + '.json'
	with open(data_archivo) as data_file:
		Data = json.load(data_file)
	data_file.close()

	# --------------------------------------------------
	# Obtaining information of players payments
	# --------------------------------------------------

	for d in Data:
		try:
			print("Reading line with payment data...", len(d[u'recompensa']))
			jugador.append(d[u'player'])
			pago.append(d[u'recompensa'])
		except:
			pass

dict = {
	'Player': jugador,
	'Payment': pago
}
data = pd.DataFrame.from_dict(dict)

archivo = 'pagos.csv'
data.to_csv(archivo, index=False)
print("Data saved to ", archivo)
