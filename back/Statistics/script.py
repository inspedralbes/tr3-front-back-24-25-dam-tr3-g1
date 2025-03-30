import os
import requests
import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from datetime import datetime
import time
from pytz import timezone

def generate_statistics():
    # Carregar les variables d'entorn
    print("Carregant variables d'entorn...")
    load_dotenv()

    # Obtenir la URL de les dades des del fitxer .env
    DATA_USERS_URL = os.getenv("DATA_USERS_URL")
    DATA_CHARACTERS_URL = os.getenv("DATA_CHARACTERS_URL")
    DATA_ARMIES_URL = os.getenv("DATA_ARMIES_URL")

    # Fer una sol·licitud GET a la URL per obtenir les dades
    print("Realitzant sol·licitud GET a les URLs...")
    DATA_USERS_URL = requests.get(DATA_USERS_URL)
    DATA_CHARACTERS_URL = requests.get(DATA_CHARACTERS_URL)
    DATA_ARMIES_URL = requests.get(DATA_ARMIES_URL)
    
    DATA_USERS_URL = DATA_USERS_URL.json()
    DATA_CHARACTERS_URL = DATA_CHARACTERS_URL.json()
    DATA_ARMIES_URL = DATA_ARMIES_URL.json()
    
    print("Dades obtingudes correctament.")

    # Crear un DataFrame amb les dades
    print("Creant DataFrame amb les dades...")
    DATA_USERS_URL = pd.DataFrame(DATA_USERS_URL)
    DATA_CHARACTERS_URL = pd.DataFrame(DATA_CHARACTERS_URL)
    DATA_ARMIES_URL = pd.DataFrame(DATA_ARMIES_URL)
    print("DataFrame creat")

    # Obtenir la data i hora actual
    madrid_tz = timezone('Europe/Madrid')
    current_datetime = datetime.now(madrid_tz).strftime("%d-%m-%Y %H:%M")
    print(f"Data i hora actual: {current_datetime}")

    # Crear directori per guardar les imatges si no existeix
    output_dir = '/Images'
    print(f"Creant directori per guardar imatges a: {output_dir}")
    os.makedirs(output_dir, exist_ok=True)
    print("Directori creat o ja existent.")


    # 1. Nombre de victories (Top 20)
    print("Generant Nombre de victories (Top 20)...")
    top_20_users = DATA_USERS_URL.nlargest(20, "victories")
    plt.figure(figsize=(10, 6))
    plt.barh(top_20_users["username"], top_20_users["victories"], color='green')
    plt.xlabel("Nombre de Victòries")
    plt.title("Victòries dels Jugadors (Top 20) - Data: " + current_datetime)
    plt.gca().invert_yaxis()
    victories_image_path = os.path.join(output_dir, "top_20_victories.png")
    plt.savefig(victories_image_path)
    plt.close()
    print(f"Gràfic de barres del nombre de victòries (Top 20) guardat a: {victories_image_path}")
    
    # 2. Personatges mes forts (Top 20)
    print("Generant Personatges mes forts (Top 20)...")
    top_20_characters = DATA_CHARACTERS_URL.nlargest(20, "atk")
    plt.figure(figsize=(10, 6))
    plt.barh(top_20_characters["name"], top_20_characters["atk"], color='blue')
    plt.xlabel("Força")
    plt.title("Personatges Més Forts (Top 20) - Data: " + current_datetime)
    plt.gca().invert_yaxis()  # Ordenar de major a menor
    strongest_characters_image_path = os.path.join(output_dir, "top_20_atk_characters.png")
    plt.savefig(strongest_characters_image_path)
    plt.close()
    print(f"Gràfic de barres dels personatges més forts (Top 20) guardat a: {strongest_characters_image_path}")
    
    # 3. Personatges més utilitzats (Top 5)
    print("Generant Personatges més utilitzats (Top 5)...")
    # Transformar les columnes `unit1`, `unit2`, `unit3`, `unit4` en files
    character_usage = DATA_ARMIES_URL.melt(id_vars=["userid"], value_vars=["unit1", "unit2", "unit3", "unit4"], 
                                           var_name="unit_slot", value_name="character_id")
    character_usage_count = character_usage["character_id"].value_counts().head(5)
    
    # Obtenir els noms dels personatges
    top_5_characters = DATA_CHARACTERS_URL[DATA_CHARACTERS_URL["id"].isin(character_usage_count.index)]
    top_5_character_names = top_5_characters.set_index("id").loc[character_usage_count.index]["name"]
    
    plt.figure(figsize=(8, 8))
    # autopct='%1.1f%%' per mostrar el percentatge amb un decimal
    plt.pie(character_usage_count, labels=top_5_character_names, autopct='%1.1f%%', startangle=140, colors=plt.cm.tab10.colors)
    plt.title("Personatges Més Utilitzats (Top 5) - Data: " + current_datetime)
    most_used_characters_image_path = os.path.join(output_dir, "top_5_most_popular_character.png")
    plt.savefig(most_used_characters_image_path)
    plt.close()
    print(f"Gràfic de pastís dels personatges més utilitzats (Top 5) guardat a: {most_used_characters_image_path}")

while True:
    time.sleep(100)
    generate_statistics()
