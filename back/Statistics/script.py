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
    
    plt.figure(figsize=(10, 6))
    plt.plot(top_5_character_names, character_usage_count, marker='o', linestyle='-', color='purple')
    plt.xlabel("Personatges")
    plt.ylabel("Nombre d'Usos")
    plt.title("Personatges Més Utilitzats (Top 5) - Data: " + current_datetime)
    plt.grid(True)
    most_used_characters_image_path = os.path.join(output_dir, "top_5_most_popular_character.png")
    plt.savefig(most_used_characters_image_path)
    plt.close()
    print(f"Gràfic de línies i punts dels personatges més utilitzats (Top 5) guardat a: {most_used_characters_image_path}")
    
    # 4. Personatges menys utilitzats (Top 5)
    print("Generant Personatges menys utilitzats (Top 5)...")
    # Transformar les columnes `unit1`, `unit2`, `unit3`, `unit4` en files
    character_usage = DATA_ARMIES_URL.melt(id_vars=["userid"], value_vars=["unit1", "unit2", "unit3", "unit4"], 
                                           var_name="unit_slot", value_name="character_id")
    character_usage_count = character_usage["character_id"].value_counts(ascending=True).head(5)
    
    # Obtenir els noms dels personatges
    bottom_5_characters = DATA_CHARACTERS_URL[DATA_CHARACTERS_URL["id"].isin(character_usage_count.index)]
    bottom_5_character_names = bottom_5_characters.set_index("id").loc[character_usage_count.index]["name"]
    
    plt.figure(figsize=(10, 6))
    plt.plot(bottom_5_character_names, character_usage_count, marker='o', linestyle='-', color='orange')
    plt.xlabel("Personatges")
    plt.ylabel("Nombre d'Usos")
    plt.title("Personatges Menys Utilitzats (Top 5) - Data: " + current_datetime)
    plt.grid(True)
    least_used_characters_image_path = os.path.join(output_dir, "top_5_least_popular_character.png")
    plt.savefig(least_used_characters_image_path)
    plt.close()
    print(f"Gràfic de línies i punts dels personatges menys utilitzats (Top 5) guardat a: {least_used_characters_image_path}")

while True:
    time.sleep(100)
    generate_statistics()
