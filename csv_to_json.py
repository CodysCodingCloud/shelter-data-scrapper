import json
import csv


def get_csv(fn: str):
    with open(fn, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        df = list(reader)
        return df


def createlinks(df: list, linkprefix: str):
    newdf = []
    for line in df:
        if line['stateAbbreviation'] == 'DC':
            continue
        suffix = line['state'].replace(' ', '_').lower()
        line['link'] = linkprefix + suffix
        line['saveFile'] = 'shelter_data_{}'.format(line['stateAbbreviation'])
        newdf.append(line)
    return newdf


def save_to_json(df: list, output_f: str):
    with open(output_f, 'w') as file:
        json.dump(df, file, indent=4)


input_f = 'states.csv'
link_suffix = 'https://www.homelessshelterdirectory.org/state/'
output_f = 'state_links.json'
df = get_csv(input_f)
df = createlinks(df, link_suffix)
save_to_json(df, output_f)
